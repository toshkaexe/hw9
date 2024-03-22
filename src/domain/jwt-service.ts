import {ObjectId} from "mongodb";

import jwt from 'jsonwebtoken';


const secretWord = process.env.JWT_SECRET || "test";

export class jwtService {
    static async getUserIdAndDeviceId(token: string) {
        const secretKey = 'your_secret_key';
        try {
            console.log("token in getUserIdAndDeviceId: " + token);
            const result: any = jwt.verify(token, secretKey)
            if (!result) return null;
            console.log("result_in_getUserIdAndDeviceId=" + result);

            const userId: ObjectId = new ObjectId(result.userId);
            const deviceId = result.deviceId;

            console.log("user_id_ in getUserIDandDeviceId", userId)
            console.log("device_id_ in getUserIDandDeviceId", deviceId)
            return {userId, deviceId}

        } catch (error) {
            console.log({get_user_by_token_error: error})
            return null
        }
    }


    static async  getUserIdFromToken(token:string) {
        const secretKey = 'your_secret_key';
        try {
            const decoded: any = jwt.verify(token, secretKey);
            return new ObjectId( decoded.userId);
        } catch (error) {
            // Если произошла ошибка при верификации токена
            console.error("Error verifying token:", error);
            return null;
        }
    }


    static async generateToken(payload: {deviceId: string, userId:string}, expiresIn: string) {
        //console.log(userId, '111')
        const secretKey = 'your_secret_key';
        const sign = jwt.sign(payload, secretKey,
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
            console.log({error_generate_refresh_token: error})
            throw new Error('Error generating refresh token');
        }
    }


}