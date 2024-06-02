import {UserDbModel, userMapper, UserViewModel} from "../models/users/users-models";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {UserModel} from "../db/schemas";

export class UsersRepository {


    static async createUser(newUser: UserDbModel): Promise<ObjectId> {
        const result = new UserModel(newUser);
        await result.save()
        return result._id;
    }

    static async findUserById(id: ObjectId) {
        const product = await UserModel.findById(id);
        return product ? product : null
    }

    static async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbModel> | null> {
        const user = await UserModel.findOne(
            {
                $or: [
                    {'accountData.email': loginOrEmail},
                    {'accountData.userName': loginOrEmail}]
            })

        return user
    }

    static async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false
        const result = await UserModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    static async deleteAll() {
        return UserModel.deleteMany({})
    }

    static async confirmUser(id: string) {
        if (!ObjectId.isValid(id)) return false
        const result = await UserModel.updateOne({_id: new ObjectId(id)},
            {$set: {'emailConfirmation.isConfirmed': true}})
        return result.matchedCount === 1

    }


    static async updateConfirmation(id: string) {
        if (!ObjectId.isValid(id)) return false
        const result = await UserModel.updateOne({_id: new ObjectId(id)},
            {$set: {'emailConfirmation.isConfirmed': true}})
        return result.matchedCount === 1
    }

    static async updateReqCode(email: string, code: string, data: Date) {
        await UserModel.updateOne({"accountData.email": email}, {
            $set: {
                "emailConfirmation.confirmationCode": code,
                "emailConfirmation.experationDate": data,
            }
        })
    }

    static async findUserByConfirmationCode(code: string) {
        const user = await UserModel.findOne(
            {'emailConfirmation.confirmationCode': code})
        return user ? user : null
    }

    static async updateUser(filter: any, updateUser: UserDbModel) {
        const result = await UserModel.updateOne(filter, updateUser)

        return Boolean(result.modifiedCount === 1)
    }
}