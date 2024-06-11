import {WithId} from "mongodb";
import {LikeCountInfo} from "../likes/likes-model";


export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentDbModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: LikeCountInfo
}


export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: LikeCountInfo
}
export const commentMapper =
    (comment: WithId<CommentDbModel>): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo:
            {likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: comment.likesInfo.myStatus
            }
    }
}