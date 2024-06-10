import {LikeStatus} from "../common";

export type LikesDBModel = {
    createAt: Date,
    status: LikeStatus,
    authorId: string, //userId
    commentId: string
}


export type SetLike = {
    content: LikeStatus
}