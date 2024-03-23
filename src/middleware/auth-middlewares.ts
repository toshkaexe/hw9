import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {UserViewModel} from "../models/users/users-models";
import {SessionRepository} from "../repositories/session-repository";


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


export const checkHeaderForDeviceId = (req: Request,
                               res: Response,
                               next: NextFunction) => {

    const auth = req.headers['authorization']

    const refreshToken = req.cookies?.refreshToken;


    console.log("refreshToken = ", refreshToken);
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
           return res.send(HTTP_STATUSES.NOT_AUTHORIZED_401)
       }
       const token = auth.split(' ')[1]  //bearer fasdfasdfasdf

       const userIdAndDeviceId = await jwtService.getUserIdAndDeviceId(token)
       console.log(userIdAndDeviceId?.userId, '= its userid')
        console.log(userIdAndDeviceId?.deviceId, ' = its deviceId')
       if (!userIdAndDeviceId) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
       if (!ObjectId.isValid(userIdAndDeviceId.userId)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

       const user: UserViewModel | null = await UsersService.findUserById(userIdAndDeviceId.userId)


     const session = await SessionRepository.findSessionByUserIdAndDeviceId(
         userIdAndDeviceId!.userId.toString(),
         userIdAndDeviceId!.deviceId
     )

        console.log("session ", session)
       if (user && session) {
           req.user = userIdAndDeviceId  //класть только userId
           return next()
       }
       console.log('not user')
       res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
   }
   catch (e)
   {
       console.log("bearere + ",e)
   }
}

