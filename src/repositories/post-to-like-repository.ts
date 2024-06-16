import {HelpLikesInfo, LikesForPost} from "../models/likes/likes-model";
import {HelpLikesInfoMongoModel, LikesForPostMongoModel} from "../db/schemas";
import {LikeStatus} from "../models/common";


// Вспомогательный репозиторий для хранения лайков
// пользователей к ИД-комментарию

export class PostToLikeRepository {
    static async getPostByPostId(id: string) {
        try {
            const post =
                await LikesForPostMongoModel.findOne({postId: id})
            return !!post;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log("error in= ", error)
            return false;
        }
    }


    static async InUserInLikeArray(id: string, userId: string) {
        try {
            const post =
                await LikesForPostMongoModel.findOne({commentId: id, likes: userId})
            return !!post;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log("error = ", error)
            return false;
        }
    }

    static async IsUserInDislikeArray(id: string, userId: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id, dislikes: userId})
            return !!comment;// Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log("error = ", error)
            return false;
        }
    }


    static async removeUserDislikeFromUser(id: string, userId: string) {
        try {
            // тут случай, если у нас новый юзер
            //Провеить,если ли он уже в базе
            const isUserExists = await HelpLikesInfoMongoModel.findOne({
                commentId: id,
                $or: [
                    {likes: {$in: [userId]}},
                    {dislikes: {$in: [userId]}}
                ]
            });

            if (isUserExists) {
                // это для случая,если у нас 1 юзер
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: id},
                            {$pull: {dislikes: userId}});
                return !!comment;// Return true if a document exists, "false" otherwise
            } else {
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: id},
                            {$push: {dislikes: userId}});
                console.log("comment dislike= ", comment)
                return !!comment;// Return "true" if a document exists, "false" otherwise

            }

        } catch (error) {
            console.log("error = ", error)
            return false;
        }
    }

    static async removeUserLikeFromUser(id: string, userId: string) {
        try {
            // тут случай, если у нас новый юзер
            //Провеить,еслть ли он уже в базе
            const isUserExists = await HelpLikesInfoMongoModel.findOne({
                commentId: id,
                $or: [
                    {likes: {$in: [userId]}},
                    {dislikes: {$in: [userId]}}
                ]
            });

            if (isUserExists) {
                // это для случая,если у нас 1 юзер
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: id},
                            {$pull: {likes: userId}});
                return !!comment;// Return true if a document exists, "false" otherwise

            } else {
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: id},
                            {$push: {likes: userId}});
                console.log("comment dislike= ", comment)
                return !!comment;// Return "true" if a document exists, "false" otherwise
            }

        } catch (error) {
            console.log("error = ", error)
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
                return !!comment;// Return "true" if a document exists, "false" otherwise
            } else {
                const comment =
                    await HelpLikesInfoMongoModel
                        .updateOne(
                            {commentId: commentId},
                            {$push: {dislikes: userId}});
                console.log("comment dislike= ", comment)
                return !!comment;// Return "true" if a document exists, "false" otherwise
            }
        } catch (error) {

            console.log("error = ", error)
            return false;
        }
    }

    static async saveInRepo(dto: LikesForPost) {
        try {
            const res
                = new LikesForPostMongoModel(dto);
            return await res.save()
        } catch (error) {
            console.log(error)
            console.log("error = ", error)
            return null
        }
    }

    static async getNumberOfLikes(id: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id})
            if (!comment) {
                return 0
            }
            return comment.likes.length;
        } catch (error) {
            console.log(error)
            console.log("error = ", error)
            return 0;
        }

    }

    static async getNumberOfDislikes(id: string) {
        try {
            const comment =
                await HelpLikesInfoMongoModel.findOne({commentId: id})
            if (!comment) {
                return 0;
            }
            return comment.dislikes.length;
        } catch (error) {
            console.log(error)
            console.log("error = ", error)
            return 0;
        }
    }


    static async getStatusForUnauthorisatedUser(commentId: string) {
        try {
            const result = await HelpLikesInfoMongoModel.findOne({
                commentId: commentId
            });


            return LikeStatus.NONE;

        } catch (error) {
            console.log("Error checking user likes or dislikes: ", error)
            return LikeStatus.NONE;
        }

    }

    static async getCurrentUserStatus(commentId: string, userId: string) {
        try {
            const result = await HelpLikesInfoMongoModel.findOne({
                commentId: commentId,
                $or: [
                    {likes: {$in: [userId]}},
                    {dislikes: {$in: [userId]}}
                ]
            });

            if (result) {
                if (result.likes.includes(userId)) {
                    return LikeStatus.LIKE
                } else if (result.dislikes.includes(userId)) {
                    return LikeStatus.DISLIKE;
                }
            }
            return LikeStatus.NONE;

        } catch (error) {
            console.log("Error checking user likes or dislikes: ", error)
            return LikeStatus.NONE;
        }

    }

}