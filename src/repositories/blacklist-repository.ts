import {blacklistTokens} from "../db/db";


export class BlacklistRepository {

    static async addRefreshTokenToBlackList(token: string) {
        try {
            const res =
                await blacklistTokens.insertOne({refreshToken: token});
            return res.insertedId.toString()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    static async isInDB(token: string) {
        try {
            const somethingInDB =
                await blacklistTokens.findOne({refreshToken: token});
            return !!somethingInDB; // Return true if document exists, false otherwise
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}