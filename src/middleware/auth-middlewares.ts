import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {UserViewModel} from "../models/users/users-models";
import {SessionRepository} from "../repositories/session-repository";
import {DeviceMongoModel, UserMongoModel} from "../db/schemas";
import {log} from "util";


dotenv.config()

export const authMiddleware = (req: Request,
                               res: Response,
                               next: NextFunction) => {

    const auth = req.headers['authorization']
    if (!auth) {

        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    const [basic, token] = auth.split(" ")
    if (basic !== 'Basic') {

        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
    const decodedData = Buffer.from(token, 'base64').toString()
    //admin:qwerty
    const [login, password] = decodedData.split(":")
    if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
        console.log("working!!")
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
    return next();
}


export const checkRefreshTokenFromHeader = (req: Request,
                                            res: Response,
                                            next: NextFunction) => {

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    return next();
}

export const checkHeaderForDeviceId1 = (req: Request,
                                        res: Response,
                                        next: NextFunction) => {

    const auth = req.headers['authorization']
    if (!auth) {

        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    return next();
}

export const bearerAuth = async (req: Request,
                                 res: Response,
                                 next: NextFunction) => {
    try {
        const auth = req.headers['authorization']
        console.log("auth=");
        console.log(auth);

        if (!auth) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
        const token = auth.split(' ')[1]  //bearer fasdfasdfasdf

        const userIdAndDeviceId =
            await jwtService.getUserIdAndDeviceId(token)
        console.log(userIdAndDeviceId?.userId.toString(), '= its userid')
        console.log(userIdAndDeviceId?.deviceId, ' = its deviceId')
        if (!userIdAndDeviceId) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        /*
                const isUserIdValid = await DeviceMongoModel.findOne({
                    userId: userIdAndDeviceId.userId.toString()
                   // , deviceId: userIdAndDeviceId.deviceId
                })
                if (!isUserIdValid) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)*/
        console.log("userIdAndDeviceId.userID=", userIdAndDeviceId.userId.toString())
        console.log("userIdAndDeviceId.deviceID=", userIdAndDeviceId.deviceId)


        const user: UserViewModel | null = await UserMongoModel.findById(userIdAndDeviceId.userId.toString())

        console.log("user=", user)

        const session =
            /*  await SessionRepository.findSessionByUserIdAndDeviceId(    userIdAndDeviceId!.userId.toString(),
                  userIdAndDeviceId!.deviceId
              )
  */
            await DeviceMongoModel.findOne({
                userId: userIdAndDeviceId.userId,
                deviceId: userIdAndDeviceId.deviceId
            })

        console.log("session ", session)
        if (user && session) {
            req.user = userIdAndDeviceId  //класть только userId
            return next()
        }
        console.log('not user')
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    } catch (e) {
        console.log("error in + ", e)
    }
}

export const bearerAuthUserAuth = async (req: Request,
                                         res: Response,
                                         next: NextFunction) => {
    console.log("we are in bearerAuthUserAuth")

    const token = req.headers['authorization']
    console.log("token = ", token);
    if (!token) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const tokenWithoutBearer = token.split(' ')[1]  //bearer fasdfasdfasdf
    console.log("tokenWithoutBearer: ", tokenWithoutBearer)
    try {
        let userId =
            await jwtService.userfromToken(tokenWithoutBearer);
        if (!userId) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        }
        console.log("userId = ", userId)

        const user =
            await UserMongoModel.findById(userId)
        console.log("user from model = ", user)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            return
        }
        req.user = userId
        return next()
    } catch (e) {
        console.log("error in + ", e)
    }
}

