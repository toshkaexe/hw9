import {WithId} from "mongodb";

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentDbModel = {
    postId: string,
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentWidthPostModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentOutputModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}
export const commentMapper = (comment: WithId<CommentDbModel>): CommentOutputModel => {
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