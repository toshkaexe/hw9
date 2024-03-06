import {ObjectId, WithId} from "mongodb";

import jwt from 'jsonwebtoken';
import {UserDbModel} from "../models/users/users-models";

const secretWord = process.env.JWT_SECRET || "test";

export class jwtService {

    static async getUserIdByToken(token: string) {
        const secretKey = 'your_secret_key';
        try {
            console.log("token" + token);
            const result: any = jwt.verify(token, secretKey)
            console.log("result=" + result);

            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }


    static async  getUserIdFromToken(token:string) {
        const secretKey = 'your_secret_key';
        try {
            const decoded:any = jwt.verify(token, secretKey);
            return new ObjectId( decoded.userId);
        } catch (error) {
            // Если произошла ошибка при верификации токена
            console.error("Error verifying token:", error);
            return null;
        }
    }


    static async generateToken(userId: string, expiresIn: string) {
        console.log(userId, '111')
        const secretKey = 'your_secret_key';
        const sign = jwt.sign({userId}, secretKey,
            {expiresIn: expiresIn});
        return sign
    };



    static async userfromToken(refreshToken: any) {

        const secretKey = 'your_secret_key';
        try {
            const res: any = jwt.verify(refreshToken, secretKey);
            return res.userId
        } catch (error) {
            return null;
        }
    }

    static async validateToken(token: string) {

        const secretKey = 'your_secret_key';

        try {
            const decodedToken: any = jwt.verify(token, secretKey);
            const deviceId = decodedToken.userId;
            const iat = new Date(decodedToken.iat * 1000).toISOString();
            const exp = new Date(decodedToken.exp * 1000).toISOString()

            console.log("decodedToken: " + decodedToken);
            console.log("iat: " + iat);
            console.log("exp: " + exp);

            return {deviceId, iat, exp}

        } catch (e) {
            console.log("validateToken failed");
            return null;
        }
    }

    static async getExpirationDate(token: string) {
        try {
            const decodedToken: any = jwt.decode(token);

            return new Date(decodedToken.exp * 1000).toISOString();
        } catch (e) {
            console.log("getExpiration failed");
            return null;
        }
    }

    static async generateRefreshToken(payload: any, expiresIn: string) {
        const secretKey = 'your_secret_key';
        try {const refreshToken =  jwt.sign(payload,  secretKey, {expiresIn});
            return refreshToken;
        } catch (error) {
            throw new Error('Error generating refresh token');
        }
    }


}