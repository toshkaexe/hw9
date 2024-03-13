import {
    DeviceAuthSessionDb,
    ApiRequestModel,
    apiRequestMapper,
    sessionDbMapper
} from "../models/devices/devices-models";
import {deviceCollection} from "../db/db";
import {WithId} from "mongodb";
import {UserDbModel} from "../models/users/users-models";


export class SessionRepository {

    static async creatDeviceSession(sessionData: DeviceAuthSessionDb) {
        try {
            const res = await deviceCollection.insertOne(sessionData)
            return res.insertedId.toString()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    static async updateDeviceSession(expDate: string, lastActiveDate: string, userId: string, deviceId: string) {
        try {
            const res = await deviceCollection.updateOne
            (
                {
                    $and: [
                        {"userId": userId},
                        {"deviceId": deviceId}
                    ]
                }, {
                    $set: {
                        issuedAt: expDate,
                        lastActiveDate: lastActiveDate
                    }
                }
            )
            return !!res.modifiedCount
        } catch (e) {
            return false;
        }
    }

    static async deleteRemoteSession(deviceId: string, userId: string) {
        try {
            const res = await deviceCollection.deleteMany
            (
                {
                    $and: [
                        {"userId": userId},
                        {"deviceId": deviceId}
                    ]
                }
            )
            return true;
        } catch (e) {
            return false;
        }
    }

    static async deleteAllRemoteSessions() {
        try {
            const res = await deviceCollection.deleteMany({});
            return true;
        } catch (e) {
            return false;
        }
    }

    static async getUserBySessionID(sessionID: string) {
        const user =
            await deviceCollection.findOne({deviceId: sessionID});
        if (!user) return null;
        return user;
    }

    static async getAllSessionByUser(userId: string) {
        const user = await deviceCollection.find({userId: userId}).toArray();
        if (!user) return null;

        return user.map(sessionDbMapper);
    }
}
