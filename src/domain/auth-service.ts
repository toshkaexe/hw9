import {UsersRepository} from "../repositories/users-repositiory";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {jwtService} from "./jwt-service";
import {ApiRequestModelDate} from "../models/devices/devices-models";
import {SessionRepository} from "../repositories/session-repository";
import {UsersService} from "./users-service";

import {RequestApiRepository} from "../repositories/request-api-repository";
import {add} from "date-fns/add";
import {EmailManager} from "../managers/email-manager";
import {CreateUserInputModel, UserDbModel} from "../models/users/users-models";
import bcrypt from "bcrypt";
import {LoginInputModel} from "../models/auth/auth-models";
import {errorMessagesHandleService, HTTP_STATUSES} from "../models/common";
import {AuthQueryRepository} from "../repositories/auth-query-repository";

import {BryptService} from "./brypt-service";
import {appConfig} from "../settings";
import dotenv from "dotenv";

dotenv.config();


const objects: any[] = [];
const userRepository = new UsersRepository();
objects.push(userRepository);
const expiresAccessTokenTime = '1h' // AppSettings.ACCESS_TOKEN_EXPIRES
const expiresRefreshTokenTime= '1h' // AppSettings.REFRESH_TOKEN_EXPIRES

export class AuthService {


    static async logout(deviceId: string, userId: string) {
        return await SessionRepository.deleteSessionByDeviceIdAndUserId(deviceId, userId);
    }

    static async login(loginOrEmail: string, password: string, ip: string, deviceName: string) {
        const user = await UsersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const deviceId = randomUUID();
        //Новый рефреш токен deviceId+userId
        const refreshTokenPayload = {
            deviceId,
            userId: user._id.toString()
        }

        const accessTokenPayload = {
            deviceId,
            userId: user._id.toString()
        }

        const accessToken =
            await jwtService.generateToken(accessTokenPayload, expiresAccessTokenTime)
        const refreshToken =
            await jwtService.generateRefreshToken(refreshTokenPayload, expiresRefreshTokenTime)
        const expDate = await jwtService.getExpirationDate(refreshToken);
        if (!expDate) return null;

        const sessionData = {
            issuedAt: expDate,
            userId: user._id.toString(),
            ip,
            deviceId,
            deviceName: deviceName || 'unknown',
            lastActiveDate: new Date().toISOString() //iat from jwt
        }

        const sessionSaved =
            await SessionRepository.creatDeviceSession(sessionData);
        if (!sessionSaved) return null;

        return {accessToken, refreshToken}
    }

    //обновление refreshTokens
    static async updateTokens(oldRefreshToken: string, userId: ObjectId, deviceId: ObjectId) {
        const user = await UsersService.findUserById(userId);
        if (!user) return;
        const accessToken = await jwtService.generateToken({
            userId: user.id,
            deviceId: deviceId.toString()
        }, expiresAccessTokenTime);


        const refreshToken =
            await jwtService.generateRefreshToken(
                {
                    deviceId,
                    userId: user.id
                }, expiresRefreshTokenTime)

        const expDate = await jwtService.getExpirationDate(refreshToken)
        if (!expDate) return;

        const lastActiveDate = new Date().toISOString();
        const updatedSession =
            await SessionRepository.updateDeviceSession(expDate,
                lastActiveDate,
                user.id, deviceId.toString())
        if (!updatedSession) return;

        return {accessToken, refreshToken}
    }


    static async saveApiRequest(data: { date: Date; ip: string | undefined; url: string }) {
        const exampleRequest: ApiRequestModelDate = {
            ip: data.ip!,
            url: data.url,
            date: data.date
        };
        const savedRequest =
            await RequestApiRepository.saveCollectionToDB(exampleRequest);
        if (!savedRequest) return;
        return savedRequest;
    }

    static async resendCode(email: string) {
        const user = await UsersRepository.findByLoginOrEmail(email)
        if (!user) return null
        if (user.confirmationData.isConfirmed) return false
        const newCode = randomUUID()
        const expirationDate = add(new Date(), {
            hours: 1
        })
        await UsersRepository.updateReqCode(email, newCode, expirationDate)
        const emailData = {
            email: email,
            subject: 'email confirmation',
            message: `
        <h1>Thanks for your registration</h1>
        <p>
            To finish registration, please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newCode}'>
                complete registration
            </a>
        </p>
        <p>Код поддверждения для тестов</p>
        <p>${newCode}</p>
    `
        }
        try {
            await EmailManager.sendEmailRecoveryMessage(emailData)
            return true
        } catch (error) {
            console.log("error in email", error)
            return false
        }
    }

    static async createUserAccount(inputData: CreateUserInputModel): Promise<null | boolean> {

        const userByEmail = await UsersRepository.findByLoginOrEmail(inputData.login)

        if (userByEmail) return false

        const passwordHash = await BryptService.getHash(inputData.password)

        const user: UserDbModel = {
            userData: {
                login: inputData.login,
                email: inputData.email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            confirmationData: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false,
                passwordRecoveryCode: "sad"
            }
        }
        const emailData = {
            email: inputData.email,
            subject: 'email confirmation',
            message: `
        <h1>Thanks for your registration</h1>
        <p>
            To finish registration, please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.confirmationData.confirmationCode}'>
            
                complete registration
            </a>
        </p>
        <p>Код поддверждения для тестов</p>
        <p>'${user.confirmationData.confirmationCode}'</p>
    `
        }
        const createResult = await UsersRepository.saveNewUser(user)
        try {
            await EmailManager.sendEmailRecoveryMessage(emailData)
            console.log('письмо отправлено')
            return true
        } catch (error) {
            console.error("error in", error)
            await UsersRepository.deleteUser(createResult.toString())
            return null
        }
    }

    static async checkCredentials(body: LoginInputModel) {
        const user =
            await UsersRepository.findByLoginOrEmail(body.loginOrEmail)

        console.log("user_check_Credentials", user);
        if (!user) return null

        const compare =
            await bcrypt.compare(body.password, user.userData.passwordHash)
        if (compare) {
            return user
        }
        return null
    }

    static async confirmEmail(code: string) {
        const user = await UsersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.confirmationData.isConfirmed) return false
        if (user.confirmationData.confirmationCode !== code) return false
        if (user.confirmationData.expirationDate < new Date()) return false

        let result = await UsersRepository.updateConfirmation(user._id.toString())
        return result
    }

    static async recoverUserPassword(newPassword: string, recoveryCode: string) {
        const userToConfirm =
            await AuthQueryRepository.getUserByPasswordRecoveryConfirmationCode(recoveryCode)

        console.log("userToConfrm = ", userToConfirm)

        if (!userToConfirm) {
            return {
                status: HTTP_STATUSES.BAD_REQUEST_400,
                data: errorMessagesHandleService({message: 'Incorrect verification code', field: 'recoveryCode'}),
            }
        }

        userToConfirm.userData.passwordHash = await BryptService.getHash(newPassword);

        await userToConfirm.save()

        return {
            status: 'SUCCESS',
            data: null,
        }
    }


    static async sendPasswordRecoveryEmail(email: string) {
        const user =
            await UsersRepository.findByLoginOrEmail(email)


        if (!user) {
            console.log("we do not have this user");
            return false;
        }

        user.confirmationData.passwordRecoveryCode = randomUUID();
        user.confirmationData.expirationDate = add(new Date(),
            {
                hours: 1,
                minutes: 10,
            })

        await user.save()
        // готовим письмо
        const emailData = {
            email: user.userData.email,
            subject: 'Password recovery',
            message: ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${user.confirmationData.passwordRecoveryCode}'>
          recovery password</a>
      </p>`
        };

        try {
            // отправляем письмо
            const mailInfo = await EmailManager.sendPasswordRecoveryMessage(
                emailData.email,
                emailData.subject,
                emailData.message)
            console.log('Information::mailInfo: ', mailInfo)
        } catch (err) {
            console.error('Error::emailManager: ', err)
        }
        return true;
        // return operationsResultService.generateResponse(ResultToRouterStatus.SUCCESS)
    }


}















