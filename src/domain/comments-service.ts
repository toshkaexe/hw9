import {CommentDbModel, CommentOutputModel} from "../models/comments/comment-model";
import {commentsRepository} from "../repositories/comments-repository";
import {OutputPostModel} from "../models/posts/posts-models";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {commentsQueryRepository} from "../repositories/comments-query-repository";

export class CommentsService {

    static async CreateComment(
        userData: {userId: string, userLogin: string}, postId: string, content: string):
        Promise<CommentOutputModel | null> {

        const post: OutputPostModel | null = await PostsQueryRepository.findPostById(postId)
        console.log(post, 'its post')

        if (!post) return null
        const newComment: CommentDbModel = {
            postId: post.id,
            content: content,
            commentatorInfo: {
                userId: userData.userId,
                userLogin: userData.userLogin
            },
            createdAt: new Date().toISOString()
        }

        return await commentsRepository.createComment(newComment)
    }

    static async UpdateComment(id: string, body: CommentDbModel, userId: string) {
     const targetComment = await commentsQueryRepository.getCommentById(id)
        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;
         await commentsRepository.updateComment(id, body)
        return true;
    }

    static async DeleteCommentById(id: string, userId: string) {
        const targetComment = await commentsQueryRepository.getCommentById(id)
        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;

        const result= await commentsRepository.deleteComment(id)
        return result
    }

}