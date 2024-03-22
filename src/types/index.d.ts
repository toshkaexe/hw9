//index.d.ts
import {UserDbModel, UserOutputModel} from "../models/users/users-models";
import {ObjectId} from "mongodb";

declare global {
    namespace Express {
        export interface Request {
            user: {userId: ObjectId, deviceId: ObjectId} | null
        }
    }
}
app.set('trust proxy', true);