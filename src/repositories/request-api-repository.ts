import {ApiRequestModelDate} from "../models/devices/devices-models";
import {ApiRequestMongoModel} from "../db/schemas";


export class RequestApiRepository {
    static async saveCollectionToDB(apiRequest: ApiRequestModelDate) {
        try {
            return  await ApiRequestMongoModel.create(apiRequest);
        } catch (e) {
            console.log("error = ", e)
            return null
        }
    }

    static async deleteAll() {
          await ApiRequestMongoModel.deleteMany({})
        return;
    }
}
