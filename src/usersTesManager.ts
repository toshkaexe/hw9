import { ObjectId } from 'mongodb'
import {HTTP_STATUSES} from "./models/common";
import {app, RoutesList} from "./settings";
import {userInputMock} from "./mock/usersMock";
import {UserMongoModel} from "./db/schemas";

const supertest = require('supertest')

const request = supertest(app)

class UsersTestManager {
    async createUser(payload: {
        shouldExpect?: boolean
        user?: string
        password?: string
        expectedStatusCode?: HTTP_STATUSES
        checkedData?: { field: string, value: any }
    } = {}) {
        const {
            shouldExpect = false,
            user = 'admin',
            password = 'qwerty',
            expectedStatusCode = HTTP_STATUSES.CREATED_201,
            checkedData,
        } = payload

        const result = await request.post(RoutesList.USERS)
            .auth(user, password)
            .send(checkedData
                ? { ...userInputMock, [checkedData.field]: checkedData.value }
                : userInputMock )
            .expect(expectedStatusCode)

        if (shouldExpect && expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            const user = await UserMongoModel.findOne({ _id: result.body.id })

            expect(result.body.email).toBe(userInputMock.email)
            expect(result.body.login).toBe(userInputMock.login)
            expect(ObjectId.isValid(user?._id ?? '')).toBeTruthy()
        }

        if (shouldExpect && expectedStatusCode === HTTP_STATUSES.BAD_REQUEST_400 && checkedData?.field) {
            const users = await UserMongoModel.find({})

            expect(result.body.errorsMessages.length).toBe(1)
            expect(result.body.errorsMessages[0].field).toBe(checkedData.field)
            expect(result.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
            expect(users.length).toBe(0)
        }

        return result
    }
}

export const usersTestManager = new UsersTestManager()