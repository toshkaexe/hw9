import {CommentatorInfo, CommentDbModel, CommentViewModel} from "../models/comments/comment-model";
import {CommentsRepository} from "../repositories/comments-repository";
import {OutputPostModel} from "../models/posts/posts-models";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {LikeCountInfo, LikesDBModel, SetLike} from "../models/likes/likes-model";
import {LikesMongoModel} from "../db/schemas";

export class CommentsService {
    static async UpdateComment(id: string, body: CommentDbModel, userId: string) {
        const targetComment = await CommentsQueryRepository.getCommentById(id)

        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;

        await CommentsRepository.updateComment(id, body)
        return true;
    }

    static async DeleteCommentById(id: string, userId: string) {

        const targetComment = await CommentsQueryRepository.getCommentById(id)
        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;

        return await CommentsRepository.deleteComment(id)

    }

    static async CreateComment(
        userData: { userId: string, userLogin: string },
        postId: string,
        content: string) {

        const commentator: CommentatorInfo = {
            userId: userData.userId,
            userLogin: userData.userLogin
        }
        const initialLike: LikeCountInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None"
        }

        const newComment: CommentDbModel = {
            postId: postId,
            content: content,
            commentatorInfo: commentator,
            createdAt: new Date().toISOString(),
            likesInfo: initialLike
        }

        return await CommentsRepository.saveComment(newComment)

    }
}