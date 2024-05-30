import {WithId} from "mongodb";

export type CommentatorInfoModel = {
    userId: string
    userLogin: string
}

export type CommentDbModel = {
    postId: string,
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
}

export type CommentWidthPostModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
}

export type CommentView = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
}
export const commentMapper = (comment: WithId<CommentDbModel>): CommentView => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt
    }
}