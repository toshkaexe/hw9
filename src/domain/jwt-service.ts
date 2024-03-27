import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';

export class jwtService {
    static async getUserIdAndDeviceId(token: string) {
        const secretKey = 'your_secret_key';
        try {

            const result: any = jwt.verify(token, secretKey)
            if (!result) return null;
            const userId: ObjectId = new ObjectId(result.userId);
            const deviceId = result.deviceId;
            return {userId, deviceId}

        } catch (error) {
            console.log({get_user_by_token_error: error})
            return null
        }
    }

    static async generateToken(payload: { deviceId: string, userId: string }, expiresIn: string) {
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

    static async getExpirationDate(token: string) {
        try {
            const decodedToken: any = jwt.decode(token);
            return new Date(decodedToken.exp * 1000).toISOString();
        } catch (e) {
            console.log({error_in_getExpirationDate: e});
            return null;
        }
    }

    static async generateRefreshToken(payload: any, expiresIn: string) {
        const secretKey = 'your_secret_key';
        try {
            return jwt.sign(payload, secretKey, {expiresIn});
        } catch (error) {
            console.log({error_generate_refresh_token: error})
            throw new Error('Error generating refresh token');
        }
    }
}