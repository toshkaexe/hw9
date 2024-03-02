import {Request} from "express";

export const AvailableResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160"];

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_AUTHORIZED_401 = 401,
    Forbidden_403 = 403,
    NOT_FOUND_404 = 404,
    InternalServerError_500 = 500,
}

export type VideoDbType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions;
}

export type RequestWithBody<B> = Request<{}, {}, B, {}>;
export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>;

export type CreateVideoType = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

export type ErrorMessageType = {
    field: string,
    message: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

export type BlogBody = {
    name: string,
    description: string,
    websiteUrl: string
}

export type PostBody = {

    title: string,
    shortDescription: string,
    content: string,
    blogId: string

}
export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    description: string
}

export type Params = {
    id: string
}