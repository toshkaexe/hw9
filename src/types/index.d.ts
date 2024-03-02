//index.d.ts
import {UserDbModel, UserOutputModel} from "../models/users/users-models";

declare global {
    namespace Express {
        export interface Request {
            user: UserOutputModel | null
        }
    }
}
