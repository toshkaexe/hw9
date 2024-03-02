import {ObjectId, WithId} from "mongodb";

import jwt from 'jsonwebtoken';
import {UserDbModel} from "../models/users/users-models";

const secretWord =  process.env.JWT_SECRET || "test";
export class jwtService {
        static async createJWT(user: WithId<UserDbModel>) {

            return jwt.sign({userId: user._id},
                secretWord, {expiresIn: '2h'})
        }

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

   static  async generateToken(userId: string, expiresIn: string) {
        console.log(userId, '111')
        const secretKey = 'your_secret_key';
        const sign = jwt.sign({userId}, secretKey, { expiresIn: expiresIn });
        return sign
    };


    static async verifyRefreshToken(refreshToken: any) {
        const secretKey = 'your_secret_key';
        try {

            const res: any = jwt.verify(refreshToken, secretKey);


            return res.userId
        } catch (error) {
            return null;
        }
    }


}