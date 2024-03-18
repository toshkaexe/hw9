import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {
    apiRequestsCollection,
    blacklistTokens,
    blogsCollection, commentsCollection, deviceCollection, postsCollection, usersCollection

} from "../db/db";
import {BlogDbModel} from "../models/blogs/blog-models";
import {PostDbModel} from "../models/posts/posts-models";
import {UserDbModel} from "../models/users/users-models";
import {CommentDbModel} from "../models/comments/comment-model";
import {TokenDbModel} from "../models/auth/auth-models";
import {ApiRequestModel, DeviceAuthSessionDb} from "../models/devices/devices-models";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    await blogsCollection.deleteMany({});

    await postsCollection.deleteMany({});

    await usersCollection.deleteMany({});

    await commentsCollection.deleteMany({});

    await blacklistTokens.deleteMany({});

    await deviceCollection.deleteMany({});

    await apiRequestsCollection.deleteMany({});

    //await database.dropDatabase();

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


});

