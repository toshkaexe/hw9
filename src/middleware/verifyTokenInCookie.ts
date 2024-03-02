import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {UserViewModel} from "../models/users/users-models";
import {blacklistTokens} from "../db/db";
import request from "supertest";



// @ts-ignore
export const verifyTokenInCookie = async (req: Request,
                                   res: Response,
                                   next: NextFunction) => {

    console.log(req.cookies.refreshToken);
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    try {
        console.log("works")

        const decodedToken = await jwtService.verifyRefreshToken(refreshToken);
        console.log("de"+decodedToken);

        console.log("refreshT"+refreshToken);
        const tokenExists = await blacklistTokens.findOne({ accessToken: refreshToken });
        console.log("********, tokenExists")
        console.log(tokenExists)

            if (tokenExists) {
                console.log("+++++++")
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        }

        next();

    } catch (error) {

        console.log("ggggggggggggggggg")
        return res.status(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
};