import {blacklistTokens, deviceCollection} from "../db/db";


export class BlacklistTokenRepository {

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
            const etwasInDB =
                await blacklistTokens.findOne({refreshToken: token});
            return !!etwasInDB; // Return true if document exists, false otherwise
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}