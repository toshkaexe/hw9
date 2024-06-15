import {DeviceAuthSessionDb, ApiRequestModelDate, apiRequestMapper} from "../models/devices/devices-models";
import {ApiRequestMongoModel} from "../db/schemas";



export class RequestApiRepository {
    static async saveCollectionToDB(apiRequest: ApiRequestModelDate) {

        try {


            const res = await ApiRequestMongoModel.create(apiRequest)
           return  res;
         //   return apiRequestMapper({_id: res.toString(), ...apiRequest})

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
