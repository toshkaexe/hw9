import {CommentatorInfo, CommentDbModel, CommentOutputModel} from "../models/comments/comment-model";
import {CommentsRepository} from "../repositories/comments-repository";
import {OutputPostModel} from "../models/posts/posts-models";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {LikesDBModel, SetLike} from "../models/likes/likes-model";
import {LikesMongoModel} from "../db/schemas";

export class CommentsService {


    static async saveLike(info: LikesDBModel){
        const result = new LikesMongoModel(info);
        await result.save();
    }

    static async UpdateComment(id: string, body: CommentDbModel, userId: string) {
     const targetComment = await commentsQueryRepository.getCommentById(id)
        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;
         await CommentsRepository.updateComment(id, body)
        return true;
    }

    static async DeleteCommentById(id: string, userId: string) {
        const targetComment = await commentsQueryRepository.getCommentById(id)
        if (!targetComment) return null;
        if (targetComment.commentatorInfo.userId != userId) return false;

       return await CommentsRepository.deleteComment(id)

    }

    static async CreateComment(
        userData: {userId: string, userLogin: string}, postId: string, content: string){

        //const post: OutputPostModel | null = await PostsQueryRepository.findPostById(postId)
        //console.log(post, 'its post')

        //if (!post) return null
        const commentator: CommentatorInfo = {
            userId: userData.userId,
            userLogin: userData.userLogin

        }

        const newComment: CommentDbModel = {
            postId: postId,
            content: content,
            commentatorInfo: commentator,
            createdAt: new Date().toISOString()
        }

        return  await CommentsRepository.saveComment(newComment)

    }
}