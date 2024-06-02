import {DeviceModel, UserModel} from "../db/schemas";
import {authMappers} from "../models/mapper/authMapper";


export class AuthQueryRepository {
    static async getUserMeModelById(userId: string) {
        const foundUser = await UserModel.findOne({_id: userId})

        return foundUser && authMappers.mapDbUserToMeModel(foundUser)
    }

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        const users = await UserModel.find({
            $or: [
                {'userData.login': loginOrEmail},
                {'userData.email': loginOrEmail},
            ]
        })

        if (users.length !== 1) {
            return false
        }

        return users[0]
    }

    static async getUserByConfirmationCode(confirmationCode: string) {
        return UserModel.findOne({'confirmationData.confirmationCode': confirmationCode})
    }

    static async getUserByPasswordRecoveryConfirmationCode(recoveryCode: string) {
        return UserModel.findOne({'confirmationData.passwordRecoveryCode': recoveryCode})
    }

    static async isAuthSessionExist(userId: string, deviceId: string, iat: number) {
        const authSession = await DeviceModel.findOne({
            userId,
            deviceId,
            iat,
        })

        return Boolean(authSession)
    }
}
