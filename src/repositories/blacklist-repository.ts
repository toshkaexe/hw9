import {BlacklistTokensMongoModel} from "../db/schemas";


export class BlacklistRepository {

    static async addRefreshTokenToBlackList(token: string) {
        try {
            const res =
                new  BlacklistTokensMongoModel(token);
            return await res.save()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    static async isInDB(token: string) {
        try {
            const somethingInDB =
                await BlacklistTokensMongoModel.findOne({refreshToken: token});
            return !!somethingInDB; // Return true if document exists, false otherwise
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}