import {DeviceAuthSessionDb, sessionDbMapper} from "../models/devices/devices-models";
import {deviceCollection} from "../db/db";


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
            const res =
                await deviceCollection.updateOne(
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

    static async deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string) {

        try {
            return await deviceCollection.deleteOne(
                {
                    deviceId: deviceId,
                    userId: userId
                });
        } catch (e) {
            console.log({"error_by_deleting_session_by_device_id": e})
            return false;
        }
    }


    static async findSessionByUserIdAndDeviceId(
        userId: string,
        deviceId: string
    ) {
        try {
            const res =
                await deviceCollection
                    .findOne({
                            userId: userId,
                            deviceId: deviceId
                        });
            return res;
        } catch (e) {
            console.log({'error_message_in_findSessionByUserIdAndDeviceId': e})
            return null;
        }
    }

    static async deleteAllRemoteSessionsExceptCurrentSession(
        userId: string, deviceId: string
    ) {
        try {

            const currentSession =
                await deviceCollection.findOne({deviceId: deviceId, userId: userId});
            return await deviceCollection.deleteMany({_id: {$ne: currentSession!._id}});
        } catch (e) {
            return false;
        }
    }

    static async getSessionByIdExist(deviceId: string) {
        const session = await
            deviceCollection.findOne({deviceId: deviceId});
        if (!session) return false;
        return session;
    }


    static async getAllSessionByUser(userId: string) {
        const user = await deviceCollection.find({userId: userId}).toArray();
        if (!user) return null;

        return user.map(sessionDbMapper);
    }
}
