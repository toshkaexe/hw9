import {DeviceAuthSessionDb, ApiRequestModel, apiRequestMapper} from "../models/devices/devices-models";
import {apiRequestsCollection, blogsCollection, deviceCollection} from "../db/db";


export class RequestApiRepository {
    static async saveCollectionToDB(apiRequest: ApiRequestModel) {

        try {
            const res = await apiRequestsCollection.insertOne(apiRequest)
             res.insertedId.toString()
            return apiRequestMapper({_id:res.insertedId, ...apiRequest})

        } catch (e) {
            return null
        }
    }

    static async deleteAll() {
        return   await apiRequestsCollection.deleteMany({})
    }
}
