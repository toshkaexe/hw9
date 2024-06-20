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
    postId: string
    likes: string []
    dislikes: string []
}


//-----------------------------------------------------------
export type LikeForPost = {
    postId: string,
    blogId: string,
    userId: string,
    userLogin: string,
    status: LikeStatus,
    updated: Date
}

