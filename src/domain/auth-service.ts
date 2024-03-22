import {UsersRepository} from "../repositories/users-repositiory";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {jwtService} from "./jwt-service";
import {ApiRequestModel, DeviceAuthSessionDb} from "../models/devices/devices-models";
import {SessionRepository} from "../repositories/session-repository";
import {UsersService} from "./users-service";

import {RequestApiRepository} from "../repositories/request-api-repository";
import {add} from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {CreateUserInputModel} from "../models/users/users-models";
import bcrypt from "bcrypt";
import {LoginInputModel} from "../models/auth/auth-models";



const expiresAccessTokenTime = '10s';
const expiresRefreshTokenTime='20s';
export class AuthService  {

    static async logout(deviceId: string, userId: string) {
        console.log("DeviceId in logout", deviceId);
        console.log("userId in logout", userId);
        return await SessionRepository.deleteSessionByDeviceIdAndUserId(deviceId, userId);
    }

    static async login(loginOrEmail: string,
                password: string,
                ip: string,
                deviceName: string) {

        const user =
            await UsersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null;

        const deviceId=randomUUID();
        //Новый рефреш токен deviceId+userId
        const refreshTokenPayload = {
            deviceId,
            userId: user._id.toString()}
        // accessToken = публичный и нет привязки к девейсу
        const accessTokenPayload = {
            deviceId,
            userId: user._id.toString()}
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
        const accessToken = await jwtService.generateToken({userId: user.id, deviceId: deviceId.toString()}, expiresAccessTokenTime)

        console.log("access_token_from_updateTokens"+ accessToken);

        const refreshToken =
            await jwtService.generateRefreshToken(
            {
                deviceId,
                userId: user.id
            }, expiresRefreshTokenTime)
        console.log("refresh_token_from_updateTokens"+ refreshToken);
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

        const exampleRequest: ApiRequestModel = {
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
        if (user.emailConfirmation.isConfirmed) return false
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
            await emailManager.sendEmailRecoveryMessage(emailData)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async createUserAccount(inputData: CreateUserInputModel): Promise<null | boolean> {
        const userByEmail = await UsersRepository.findByLoginOrEmail(inputData.login)
        if (userByEmail) return false
        const passwordHash = await bcrypt.hash(inputData.password, 10)
        const user = {
            _id: new ObjectId(),
            accountData: {
                userName: inputData.login,
                email: inputData.email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const emailData = {
            email: inputData.email,
            subject: 'email confirmation',
            message: `
        <h1>Thanks for your registration</h1>
        <p>
            To finish registration, please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
            
                complete registration
            </a>
        </p>
        <p>Код поддверждения для тестов</p>
        <p>'${user.emailConfirmation.confirmationCode}'</p>
    `
        }
        const createResult = await UsersRepository.createUser(user)
        try {
            await emailManager.sendEmailRecoveryMessage(emailData)
            console.log('письмо отправлено')
            return true
        } catch (error) {
            console.error(error)
            await UsersRepository.deleteUser(user._id.toString())
            return null
        }
    }

    static async checkCredentials(body: LoginInputModel) {
        const user =
            await UsersRepository.findByLoginOrEmail(body.loginOrEmail)

        console.log("user_check_Credentials", user);
        if (!user) return null

        const compare =
            await bcrypt.compare(body.password,  user.accountData.passwordHash)
        if (compare) {
            return user
        }
        return null
    }

    static async confirmEmail(code: string) {
        const user = await UsersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await UsersRepository.updateConfirmation(user._id.toString())
        return result
    }

}















