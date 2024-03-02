import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {UserViewModel} from "../models/users/users-models";

//import {jwtService} from "../application/jwt-service";

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



export const bearerAuth = async (req: Request,
                                 res: Response,
                                 next: NextFunction) => {
    const auth = req.headers['authorization']
    console.log("auth=");
    console.log(auth);
    if (!auth) {
        return res.send(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    const token = auth.split(' ')[1]  //bearer fasdfasdfasdf

    const userId = await jwtService.getUserIdByToken(token)
    console.log(userId, 'its userid')
    if (!userId) return  res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    if(!ObjectId.isValid(userId)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const user: UserViewModel | null = await UsersService.findUserById(userId)
    if (user) {
        req.user = user
        return next()
    }
    console.log('not user')
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
}

