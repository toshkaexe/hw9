import {BlacklistTokenRepository} from "../repositories/blacklistToken-repository";

export class BlacklistService {

    static async addRefreshTokenToBlacklist(token: string) {

        const addedToken =
            await BlacklistTokenRepository.addRefreshTokenToBlackList(token);
        if (addedToken) {
            return addedToken
        } else {
            return false
        };
    }

    static async isInBlacklist(token: string){

        const tokenInBlacklist =
            await BlacklistTokenRepository.isInDB(token);
        if (tokenInBlacklist) {
            return tokenInBlacklist
        } else {
            return false
        };

    }
}