import {DeviceAuthSessionDb} from "../models/devices/devices-models";
import {deviceCollection} from "../db/db";

export class DeviceRepository {

    static async saveDeviceSession(sessionData: DeviceAuthSessionDb) {
        try {
            const res = await deviceCollection.insertOne(sessionData)
            return res.insertedId.toString()
        } catch (e) {
            return null
        }
    }

    static async updateDeviceSession(expDate: string,
                                     lastActiveDate: string,
                                     userId: string,
                                     deviceId: string) {

        try {
            const res = await deviceCollection
                .updateOne({
                        $and: [
                            {"userId": userId},
                            {"deviceId": deviceId}
                        ]
                    },
                    {
                        $set:
                            {
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


}