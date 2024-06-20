import {LikeForPost} from "../models/likes/likes-model";
import {HelpLikesInfoMongoModel, LikeToPostModel} from "../db/schemas";
import {LikeStatus} from "../models/common";


// Вспомогательный репозиторий для хранения лайков
// пользователей к ИД-постам

export class LikeToPostRepository {
    static async findIfUserSetLikeOrDislike(postId: string,
                                            userId: string,
                                            blogId: string) {
        try {
            const post =
                await LikeToPostModel.findOne({
                    postId: postId,
                    userId: userId,
                    blogId: blogId
                })
            return !!post; // Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log("error in= ", error)
            return false;
        }
    }


    static async InUserInLikeArray(postId: string,
                                   userId: string,
                                   blogId: string) {
        try {
            const post = await LikeToPostModel.findOne(
                {
                    postId: postId,
                    userId: userId,
                    blogId: blogId,
                    status: LikeStatus.LIKE
                });

            return !!post  // Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.error('Error checking likes/dislikes:', error);
            return false
        }
    }

    static async IsUserInDislikeArray(postId: string,
                                      userId: string,
                                      blogId: string) {
        try {
            const post = await LikeToPostModel.findOne(
                {
                    postId: postId,
                    userId: userId,
                    blogId: blogId,
                    status: LikeStatus.DISLIKE
                });

            return !!post  // Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.error('Error checking likes/dislikes:', error);
            return false
        }
    }


    static async updatePost(
        postId: string,
        userId: string,
        blogId: string,
        status1: LikeStatus
    ) {

        console.log("update post")
        try {
            const updatedLike
                = await LikeToPostModel.findOne(
                {
                    postId: postId,
                    blogId: blogId,
                    userId: userId
                })
            if(!updatedLike) return false

            updatedLike!.status = status1;
            updatedLike!.updated = new Date();

            console.log("updatedLike=", updatedLike)
            return true;
        } catch (error) {

            console.log("error = ", error)
            return false;
        }
    }

    static async FindLikeOrDislikeForPost(postId: string,
                                          blogId: string,
                                          userId: string,
    ) {
        try {
            const filter = {postId, blogId, userId};
            const document =
                await LikeToPostModel.findOne(filter);

            if (!document) {
                console.log('LikeForPost found:', document);
                return document!.status
            }
            return false
        } catch (err) {
            console.error('Error finding LikeForPost:', err);
            return false
        }
    }

    static async saveInRepo(dto: LikeForPost) {
        try {
            const res
                = new LikeToPostModel(dto);
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

// Функция для удаления объекта с определенным userId
function removeLikeById(likes: LikeForPost[], userId: string): LikeForPost[] {
    const index = likes.findIndex(like => like.userId === userId);
    if (index !== -1) {
        likes.splice(index, 1);
    }
    return likes;
}