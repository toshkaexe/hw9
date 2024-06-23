import {Db, MongoClient} from "mongodb";
import {appConfig} from "../settings";
import {UserDbModel} from "../models/users/users-models";

export const db1 = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db("blogs-hws")
    },
    async run(url: string) {
        try {
            this.client = new MongoClient(url)
            await this.client.connect()
            await this.getDbName().command({ping: 1});
            console.log("connected successfully to mongo server");
        } catch (e: unknown) {

            console.error("Cannot connect to mongo server", e)
            await this.client.close()

        }
    },

    async stop() {
        await this.client.close()
        console.log("Connection successfully closed");

    },


    async drop() {
        try {
            //await this.getDbName().dropDatabase()
            const collections =
                await this.getDbName().listCollections().toArray()
            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({})

            }
        } catch (e: unknown) {
            console.log("error in drop db: ", e)
            await this.stop();
        }
    },

    getCollections(){
        return{
            usersCollection: this.getDbName().collection<UserDbModel>("users")
        }
    }


}