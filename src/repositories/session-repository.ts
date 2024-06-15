import {DeviceAuthSessionDb, sessionDbMapper} from "../models/devices/devices-models";
import {DeviceMongoModel} from "../db/schemas";


export class SessionRepository {

    static async creatDeviceSession(sessionData: DeviceAuthSessionDb) {
        try {
            const res = await DeviceMongoModel.create(sessionData)
            return res.toString()
        } catch (e) {
            console.log("error in create device" , e)
            return null
        }
    }

    static async updateDeviceSession(expDate: string, lastActiveDate: string, userId: string, deviceId: string) {
        try {
            const res =
                await DeviceMongoModel.updateOne(
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
            console.log("error in , ", e)
            return false;
        }
    }

    static async deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string) {

        try {
            return await DeviceMongoModel.deleteOne(
                {
                    deviceId: deviceId,
                    userId: userId
                });
        } catch (e) {
            console.log({"error  _ by_deleting_session_by_device_id": e})
            return false;
        }
    }


    static async findSessionByUserIdAndDeviceId(
        userId: string,
        deviceId: string
    ) {
        try {
            const res =
                await DeviceMongoModel
                    .findOne({
                            userId: userId,
                            deviceId: deviceId
                        });
            return res;
        } catch (e) {
            console.log({'error  _message_in_findSessionByUserIdAndDeviceId': e})
            return null;
        }
    }

    static async deleteAllRemoteSessionsExceptCurrentSession(
        userId: string, deviceId: string
    ) {
        try {

            const currentSession =
                await DeviceMongoModel.findOne({deviceId: deviceId, userId: userId});
            return await DeviceMongoModel.deleteMany({_id: {$ne: currentSession!._id}});
        } catch (error) {
            console.log("error in current session", error)
            return false;
        }
    }

    static async getSessionByIdExist(deviceId: string) {
        const session = await
            DeviceMongoModel.findOne({deviceId: deviceId});
        if (!session) return false;
        return session;
    }


    static async getAllSessionByUser(userId: string) {
        const user = await DeviceMongoModel.find({userId: userId});
        if (!user) return null;

        return user.map(sessionDbMapper);
    }
}
