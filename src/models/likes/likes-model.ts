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

export type UserIDS = {
    userId: string
}
//-----------------------------------------------------------
//LikeInfo for Posts
export type LikeInfo = {
    userId: string
    userLogin: string
    createdAt: Date
}

export type LikesForPost = {
    postId: string
    blogId: string
    likes: LikeInfo[]
    dislikes: LikeInfo[]
}
