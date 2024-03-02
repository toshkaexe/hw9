import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {
    apiRequestHistoryCollection,
    blacklistTokens,
    blogsCollection,
    commentsCollection,
    deviceCollection,
    postsCollection,
    usersCollection
} from "../db/db";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await blacklistTokens.deleteMany({});
    await deviceCollection.deleteMany({});
    await apiRequestHistoryCollection.deleteMany({});
    //await database.dropDatabase();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


});