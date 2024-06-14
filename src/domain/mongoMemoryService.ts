import { MongoMemoryServer } from 'mongodb-memory-server'
import {AppSettings} from "../settings";
import mongoose from 'mongoose'
import {runDBMongoose} from "../db/db";

function getMongoMemoryService() {
    let memoryServer: MongoMemoryServer

    async function connect() {
        memoryServer = await MongoMemoryServer.create()
        AppSettings.MONGO_URI = memoryServer.getUri()
        AppSettings.DB_NAME = 'blogs-hws'
        await runDBMongoose()
    }

    async function close() {
        await mongoose.disconnect()
        await memoryServer.stop()
    }

    return { connect, close }
}

export const memoryService = getMongoMemoryService()