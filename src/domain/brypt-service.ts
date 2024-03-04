import {ObjectId, WithId} from "mongodb";

import jwt from 'jsonwebtoken';
import {UserDbModel} from "../models/users/users-models";
import bcrypt from "bcrypt";

const secretWord = process.env.JWT_SECRET || "test";

export class BryptService {

    static async compareHashes(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);

        } catch (error) {
            throw new Error('Error comparing hashes');
        }
    }

}