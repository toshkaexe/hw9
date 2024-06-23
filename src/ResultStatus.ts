import {MongoClient, Db} from "mongodb";
import {appConfig} from "./settings";
import {UserDbModel} from "./models/users/users-models";

export enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest'
}
