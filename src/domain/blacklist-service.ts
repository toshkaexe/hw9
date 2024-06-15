import {BlacklistRepository} from "../repositories/blacklist-repository";
import {BlacklistTokensMongoModel} from "../db/schemas";


export class BlacklistService {


    static async getAll() {
        try {

            return await BlacklistTokensMongoModel.find({});

        } catch (e) {
            console.log("error in getAll = ",e)
            return false;
        }
    }


    static async addRefreshTokenToBlacklist(token: string) {

        const addedToken =
            await BlacklistRepository.addRefreshTokenToBlackList(token);
        if (addedToken) {
            return addedToken
        } else {
            return false
        }

    }

    static async isInBlacklist(token: string) {

        const tokenInBlacklist =
            await BlacklistRepository.isInDB(token);
        if (tokenInBlacklist) {
            return true
        } else {
            return false
        }
        ;

    }
}