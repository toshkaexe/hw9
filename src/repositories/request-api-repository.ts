import {DeviceAuthSessionDb, ApiRequestModelDate, apiRequestMapper} from "../models/devices/devices-models";
import {ApiRequestModel} from "../db/schemas";



export class RequestApiRepository {
    static async saveCollectionToDB(apiRequest: ApiRequestModelDate) {

        try {


            const res = await ApiRequestModel.create(apiRequest)
           return  res;
         //   return apiRequestMapper({_id: res.toString(), ...apiRequest})

        } catch (e) {
            return null
        }
    }

    static async deleteAll() {
          await ApiRequestModel.deleteMany({})
        return;
    }
}
