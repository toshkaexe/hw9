import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export type UserDbModel = {
    _id: ObjectId,
    accountData: {
        userName: string,
        email: string,
        passwordHash: string,
        createdAt: string,
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type CreateUserInputModel = {
    login: string
    email: string
    password: string
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type Paginator<UserViewModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [UserViewModel]
}
export const userMapper = (user: WithId<UserDbModel>): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
    }
}