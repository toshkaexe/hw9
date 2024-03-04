export type DeviceAuthSessionDb = {
    issuedAt: string
    deviceId: string
    ip: string
    deviceName: string
    userId: string
    lastActiveDate: string
}

// храним все случаи обращения к api
export type DeviceHistoryCollectionDb = {
    ip: string
    url: string
    date: Date
}