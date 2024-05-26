import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {


} from "../db/db";
import {ApiRequestModel, BlogModel, CommentModel, DeviceModel, PostModel, BlacklistTokensModel, UserModel} from "../db/schemas";

export const testingRoute = Router({})

testingRoute.delete('/all-data', async (req: Request, res: Response) => {

    await BlogModel.deleteMany({});

    await PostModel.deleteMany({});

    await UserModel.deleteMany({});

    await CommentModel.deleteMany({});

    await BlacklistTokensModel.deleteMany({});

    await DeviceModel.deleteMany({});

    await ApiRequestModel.deleteMany({});

    //await database.dropDatabase();

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


});

