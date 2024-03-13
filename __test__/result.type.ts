import {ResultCode} from "./resultCode";

export type Result<T = null> = {

    code: ResultCode;
    errorMessage?: string;
    data: T
}