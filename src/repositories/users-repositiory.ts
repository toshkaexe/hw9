import {UserDbModel} from "../models/users/users-models";
import {ObjectId, WithId} from "mongodb";
import {UserMongoModel} from "../db/schemas";


export class UsersRepository {


    static async saveNewUser(newUser: UserDbModel): Promise<WithId<UserDbModel>> {
        const result = new UserMongoModel(newUser);
        await result.save()
        return result;
    }

    static async findUserById(id: ObjectId) {
        const product = await UserMongoModel.findById(id);
        return product ? product : null
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        return UserMongoModel.findOne(
            {
                $or: [
                    {'userData.email': loginOrEmail},
                    {'userData.login': loginOrEmail}]
            });
    }

    static async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false
        const result = await UserMongoModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    static async deleteAll() {
        return UserMongoModel.deleteMany({})
    }

    static async confirmUser(id: string) {
        if (!ObjectId.isValid(id)) return false
        const result = await UserMongoModel.updateOne({_id: new ObjectId(id)},
            {$set: {'emailConfirmation.isConfirmed': true}})
        return result.matchedCount === 1

    }


    static async updateConfirmation(id: string) {
        if (!ObjectId.isValid(id)) return false
        const result = await UserMongoModel.updateOne({_id: new ObjectId(id)},
            {$set: {'emailConfirmation.isConfirmed': true}})
        return result.matchedCount === 1
    }

    static async updateReqCode(email: string, code: string, data: Date) {
        await UserMongoModel.updateOne({"accountData.email": email}, {
            $set: {
                "emailConfirmation.confirmationCode": code,
                "emailConfirmation.expirationDate": data,
            }
        })

    }

    static async findUserByConfirmationCode(code: string) {
        const user = await UserMongoModel.findOne(
            {'emailConfirmation.confirmationCode': code})
        return user ? user : null
    }

    static async updateUser(filter: any, updateUser: UserDbModel) {
        const result = await UserMongoModel.updateOne(filter, updateUser)

        return Boolean(result.modifiedCount === 1)
    }


    static async update(email: string, code: string, data: Date) {
        await UserMongoModel.updateOne({"accountData.email": email}, {
            $set: {
                "emailConfirmation.confirmationCode": code,
                "emailConfirmation.expirationDate": data,
            }
        })

    }


}