import {DeviceAuthSessionDb, ApiRequestModel} from "../models/devices/devices-models";
import {apiRequestsCollection, deviceCollection} from "../db/db";


export class SecurityDevicesRepository {

    static async saveDevicesSession(sessionData: DeviceAuthSessionDb) {
        try {
            const res = await deviceCollection.insertOne(sessionData)
            return res.insertedId.toString()
        } catch (e) {
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
    static async deleteRemoteSession(deviceId: string, userId: string){

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

}
