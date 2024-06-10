import {DBType} from "../models/db/db";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

export const db: DBType = {
    blogs: [],
    posts: []
}


const dbName = process.env.DBNAME || 'blogs-hws';
const mongoURI = process.env.MONGO_URI_CLOUD
    || process.env.MONGO_URI_LOCAL
    || 'mongodb+srv://antonzeltser:admin@cluster0.rmbeaqk.mongodb.net/'
    || 'mongo://localhost:27017/';


const port = process.env.PORT;

export async function runDB() {
    try {
        await mongoose.connect(mongoURI +dbName);
        console.log('Connected successfully to mongo server!');
        console.log(`Example app listening on port: ${port}`)
    } catch (err) {
        console.log(`Cannot connect to the db: ${err}`)
        await mongoose.disconnect()
    }
}


//
// //export const client = new MongoClient(mongoURI);
// //export const database = client.db('blogs-hws')
// export const blogsCollection = database.collection<BlogDbModel>('blogs');
// export const postsCollection = database.collection<PostDbModel>('posts');
// export const usersCollection = database.collection<UserDbModel>('users');
// export const commentsCollection = database.collection<CommentDbModel>('comments');
// export const blacklistTokens = database.collection<TokenDbModel>('tokens');
// export const deviceCollection = database.collection<DeviceAuthSessionDb>('devices');
// export const apiRequestsCollection = database.collection<ApiRequestModel>('apirequests');
//
//
