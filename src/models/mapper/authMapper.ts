import {UserDbModel} from "../users/users-models";
import {WithId} from "mongodb";
import {MeViewModel} from "../auth/auth-models";

export const authMappers = {
    mapDbUserToMeModel(user: WithId<UserDbModel>): MeViewModel {
        return {
            userId: user._id.toString(),
            login: user.userData.login,
            email: user.userData.email,
        }
    }
}
