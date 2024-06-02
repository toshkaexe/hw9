import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {


} from "../db/db";
import {ApiRequestModel, BlogMongoModel, CommentModel, DeviceModel, PostMongoModel, BlacklistTokensModel, UserModel} from "../db/schemas";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    await BlogMongoModel.deleteMany({});

    await PostMongoModel.deleteMany({});

    await UserModel.deleteMany({});

    await CommentModel.deleteMany({});

    await BlacklistTokensModel.deleteMany({});

    await DeviceModel.deleteMany({});

    await ApiRequestModel.deleteMany({});

    //await database.dropDatabase();

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


});

