import * as bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {CreateUserInputModel, UserDbModel, userMapper, UserViewModel} from "../models/users/users-models";
import {UsersRepository} from "../repositories/users-repositiory";
import {LoginInputModel} from "../models/auth/login-model";
import {add} from "date-fns/add";
import {randomUUID} from "crypto";
import {BryptService} from "./brypt-service";



export class UsersService {

    static async findUserById(userId: ObjectId | null) {
        const user = await UsersRepository.findUserById(userId!)
        if (!user) return null
        return userMapper(user)

    }
   static async createUser(body: CreateUserInputModel): Promise<UserViewModel> {
        const passwordHash = await BryptService.getHash(body.password)
        const newUser: UserDbModel = {
            userData: {
                login: body.login,
                email: body.email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString(),
            },
            confirmationData: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false,
                passwordRecoveryCode: "sad"
            }
        };
        return userMapper(await UsersRepository.saveNewUser(newUser))
   }

    static async deleteUser(id: string): Promise<boolean> {
        return UsersRepository.deleteUser(id)
    }


}