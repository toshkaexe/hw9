import * as bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {CreateUserInputModel, UserDbModel, userMapper, UserViewModel} from "../models/users/users-models";
import {UsersRepository} from "../repositories/users-repositiory";
import {LoginInputModel} from "../models/auth/login-model";
import {add} from "date-fns/add";
import {randomUUID} from "crypto";



export class UsersService {

    static async findUserById(userId: ObjectId | null) {
        const user = await UsersRepository.findUserById(userId!)
        if (!user) return null
        return userMapper(user)

    }
   static async createUser(body: CreateUserInputModel): Promise<UserViewModel> {
        const passwordHash = await bcrypt.hash(body.password, 10)
        const newUser: UserDbModel = {
            _id: new ObjectId(),
            accountData: {
                "userName": body.login,
                "email": body.email,
                "passwordHash": passwordHash,
                "createdAt": new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }

        };

        return UsersRepository.createUser(newUser)
    }

    static async deleteUser(id: string): Promise<boolean> {
        return UsersRepository.deleteUser(id)
    }

}