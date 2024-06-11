import {LikeStatus} from "../common";

export type LikesDBModel = {
    createAt: Date,
    status: LikeStatus,
    authorId: string, //userId
    commentId: string
}

export type LikeCountInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type SetLike = {
    content: LikeStatus
}

export type HelpLikesInfo = {
    commentId: string
    likes:  string []
    dislikes:  string []
}

export type UserIDS = {
    userId: string
}
