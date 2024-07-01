import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {


} from "../db/db";
import {
    ApiRequestMongoModel,
    BlogMongoModel,
    CommentMongoModel,
    DeviceMongoModel,
    PostMongoModel,
    BlacklistTokensMongoModel,
    UserMongoModel,
    HelpLikesInfoMongoModel, LikeToPostModel
} from "../db/schemas";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    await BlogMongoModel.deleteMany({});

    await PostMongoModel.deleteMany({});

    await UserMongoModel.deleteMany({});

    await CommentMongoModel.deleteMany({});

    await BlacklistTokensMongoModel.deleteMany({});

    await DeviceMongoModel.deleteMany({});

    await ApiRequestMongoModel.deleteMany({});

    await HelpLikesInfoMongoModel.deleteMany({});

    await LikeToPostModel.deleteMany({});

    //await database.dropDatabase();

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


});

