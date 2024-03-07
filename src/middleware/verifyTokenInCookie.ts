import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {UserViewModel} from "../models/users/users-models";
import {blacklistTokens} from "../db/db";
import request from "supertest";
import {inputValidation} from "../validators/input-validation";
import {emailExistValidation, emailValidation} from "./user-already-exist";


export const verifyTokenInCookie = async (req: Request,
                                          res: Response,
                                          next: NextFunction) => {

    console.log(req.cookies.refreshToken);
    const refreshToken = req.cookies?.refreshToken;

    console.log("refreshToken: " +refreshToken);
    const userId = await jwtService.getUserIdByToken(refreshToken)
    console.log("....")
    console.log("userId:" + userId)
    console.log("---------> userId:" + userId)
    if (!userId) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    try {
        const tokenExists = await blacklistTokens.findOne({accessToken: refreshToken});
        if (tokenExists) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        }
        next();
        return
    } catch (error) {

        return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
};

export const logoutMiddleware = ()=>[
    verifyTokenInCookie
];