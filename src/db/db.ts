import {DBType} from "../models/db/db";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

export const db: DBType = {
    blogs: [],
    posts: []
}


const dbName = 'blogs-hws';
const mongoURI = 'mongodb+srv://antonzeltser:admin@cluster0.rmbeaqk.mongodb.net/'
const port = process.env.PORT;

export async function runDBMongoose() {
    try {
        await mongoose.connect(mongoURI! +dbName!);
        console.log('Connected successfully to mongo server!');
        console.log(`Example app listening on port: ${port}`)
    } catch (err) {
        console.log(`Error Cannot connect to the db: ${err}`)
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
