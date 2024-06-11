import {HelpLikesInfo, UserIDS} from "../models/likes/likes-model";
import {HelpLikesInfoMongoModel} from "../db/schemas";
import {LikeStatus} from "../models/common";


// Вспомогательный репозиторий для хранения лайков
// пользователей к ИД-комментарию

export class CommentToLikeRepository {
    static async getCommentByCommentId(id: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id})
            return !!comment;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log(error)
            return false;
        }
    }


    static async hasLikefromUser(id: string, userId: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id, likes: userId})
            return !!comment;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async hasDislikefromUser(id: string, userId: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id, dislikes: userId})
            return !!comment;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log(error)
            return false;
        }
    }


    static async removeUserDislikefromUser(id: string, userId: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel
                    .updateOne(
                        {commentId: id},
                        {$pull: {dislikes: userId}});
            return !!comment;// Return true if a document exists, "false" otherwise

        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async removeUserLikefromUser(id: string, userId: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel
                    .updateOne(
                        {commentId: id},
                        {$pull: {likes: userId}});
            return !!comment;// Return true if a document exists, "false" otherwise

        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async updateComment(commentId: string,
                               userId: string,
                               likeStatus: LikeStatus) {
        try {
            if (likeStatus === LikeStatus.LIKE) {
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: commentId},
                            {$push: {likes: userId}});
                console.log("comment like = ", comment)
                return !!comment;// Return true if a document exists, false otherwise
            } else {
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: commentId},
                            {$push: {dislikes: userId}});
                console.log("comment dislike= ", comment)
                return !!comment;// Return true if a document exists, "false" otherwise
            }
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async saveInRepo(dto: HelpLikesInfo) {
        try {
            const res
                = new HelpLikesInfoMongoModel(dto);
            return await res.save()
        } catch (error) {
            console.log(error)
            return null
        }
    }


}