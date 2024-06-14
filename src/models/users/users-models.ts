import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export type UserDbModel = {
    userData: UserAccountData,
    confirmationData: UserConfirmationData
}

export type UserAccountData = {
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string
}
export type UserConfirmationData = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
    passwordRecoveryCode: string
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
        login: user.userData.login,
        email: user.userData.email,
        createdAt: user.userData.createdAt,
    }
}

export type UserType = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
    recoveryData: RecoveryDataType | null
}


export type AccountDataType = {
    /**
     * Set user`s login. Required. MaxLength: 10, minLength: 3.
     */
    login: string

    /**
     * Set user`s email, required.
     */
    email: string

    /**
     * Generated hash from salt and user password.
     */
    passwordHash: string

    /**
     * Created date of user.
     */
    createdAt: string
}

export type EmailConfirmationType = {
    /**
     * Code for confirm email
     */
    confirmationCode: string

    /**
     * Expiration date of confirmation link.
     */
    expirationDate: Date

    /**
     * Is confirmed email registered user.
     */
    isConfirmed: boolean
}

export type RecoveryDataType = {
    /**
     * Code for recovery password
     */
    recoveryCode: string

    /**
     * Expiration date of recovery link.
     */
    expirationDate: Date
}
export type GetUserOutputModel = UserType;

export type GetUserOutputModelFromMongoDB = GetUserOutputModel & {
    /**
     * Inserted id user from mongodb
     */
    _id: ObjectId
};

export type GetMappedUserOutputModel = Omit<AccountDataType, 'passwordHash'> & {
    /**
     * Mapped id of user from db
     */
    id: string
};