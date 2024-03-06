import {WithId} from "mongodb";

export type DeviceAuthSessionDb = {

    userId: string
    ip: string
    issuedAt: string
    deviceId: string

    deviceName: string

    lastActiveDate: string
}

// храним все случаи обращения к api
export type ApiRequestModel = {
    ip: string | undefined
    url: string
    date: Date
}


export type OutputApiRequestModel = {
    id: string
    ip: string | undefined
    url: string
    date: Date
}
export const apiRequestMapper = (apiRequest: WithId<ApiRequestModel>): OutputApiRequestModel => {
    return {
        id: apiRequest._id.toString(),
        ip: apiRequest.ip,
        url: apiRequest.url,
        date: apiRequest.date
    }
}