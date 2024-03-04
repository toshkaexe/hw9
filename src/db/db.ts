import {DBType} from "../models/db/db";
import {MongoClient} from "mongodb";
import {BlogDbModel} from "../models/blogs/blog-models";
import {PostDbModel} from "../models/posts/posts-models";
import {UserDbModel} from "../models/users/users-models";
import {CommentDbModel} from "../models/comments/comment-model";
import {validateUsers} from "../validators/user-validation";
import {TokenDbModel} from "../models/auth/auth-models";
import {DeviceAuthSessionDb, DeviceHistoryCollectionDb} from "../models/devices/devices-models";

export const db: DBType = {
    blogs: [],
    posts: []
}

const port = 80;

const uri =  process.env.MONGO_URI_CLOUD
    || process.env.MONGO_URI_LOCAL  || 'mongodb+srv://antonzeltser:admin@cluster0.rmbeaqk.mongodb.net/'
    //'mongo://localhost:27017';


console.log("url: ", uri);
export const client = new MongoClient(uri);
export const database = client.db('blogs-hws')
export const blogsCollection = database.collection<BlogDbModel>('blogs');
export const postsCollection = database.collection<PostDbModel>('posts');
export const usersCollection = database.collection<UserDbModel>('users');
export const commentsCollection = database.collection<CommentDbModel>('comments');
export const blacklistTokens = database.collection<TokenDbModel>('tokens');

export const deviceCollection = database.collection<DeviceAuthSessionDb>('devices');

export const apiRequestHistoryCollection = database.collection<DeviceHistoryCollectionDb>('apiRequestHistory');



export const runDB = async () => {
    try {
        await client.connect()
        console.log('Client connected to Db');
        console.log(`Example app listening on port: ${port}`)
    } catch (err) {
        console.log(`Cannot connect to the db: ${err}`)
        await client.close()
    }
}

