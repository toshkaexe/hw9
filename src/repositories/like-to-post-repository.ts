import {LikeInfo, LikesForPost} from "../models/likes/likes-model";
import {HelpLikesInfoMongoModel, LikesForPostMongoModel} from "../db/schemas";
import {LikeStatus} from "../models/common";


// Вспомогательный репозиторий для хранения лайков
// пользователей к ИД-постам

export class LikeToPostRepository {
    static async getPostByPostId(id: string) {
        try {
            const post =
                await LikesForPostMongoModel.findOne({postId: id})
            return !!post; // Return "true" if a document exists, "false" otherwise
        } catch (error) {
            console.log("error in= ", error)
            return false;
        }
    }


    static async InUserInLikeArray(id: string, userId: string) {
        try {
            const post = await LikesForPostMongoModel.findOne({postId: id});

            if (!post) {
                console.log(`Post with id ${id} not found.`);
                return;
            }

            const isInLikes = post.likes.some(like => like.userId === userId);
            const isInDislikes = post.dislikes.some(dislike => dislike.userId === userId);

            if (isInLikes) {
                console.log(`User with id ${userId} is in the likes.`);
                return true
            }
            console.log(`User with id ${userId} is in the dislikes.`);
            return false;

        } catch (error) {
            console.error('Error checking likes/dislikes:', error);
            return false
        }
    }

    static async IsUserInDislikeArray(id: string, userId: string) {
        try {
            const post = await LikesForPostMongoModel.findOne({postId: id});

            if (!post) {
                console.log(`Post with id ${id} not found.`);
                return;
            }


            const isInDislikes = post.dislikes.some(dislike => dislike.userId === userId);

            if (isInDislikes) {
                console.log(`User with id ${userId} is in the dislikes.`);
                return true
            }
            console.log(`User with id ${userId} is in the like.`);
            return false;

        } catch (error) {
            console.error('Error checking likes/dislikes:', error);
            return false
        }
    }


    static async removeUserDislikeFromUser(id: string, userId: string) {
        try {
            // тут случай, если у нас новый юзер
            //Провеить,еслть ли он уже в базе
            const post
                = await LikesForPostMongoModel.findOne({postId: id})

            const isInLikes = post!.likes.some(like => like.userId === userId);
            const isInDislikes = post!.dislikes.some(dislike => dislike.userId === userId);

            const isUserExists = isInLikes || isInDislikes;


            if (isUserExists) {
                // это для случая,если у нас 1 юзер
                const removeDislike =
                    await LikesForPostMongoModel
                        .updateOne(
                            {postId: id},
                            {$pull: {dislike: userId}});
                return !!removeDislike;// Return true if a document exists, "false" otherwise

            } else {
                const pushLike =
                    await LikesForPostMongoModel
                        .updateOne(
                            {commentId: id},
                            {$push: {likes: userId}});
                console.log("post dislike= ", pushLike)
                return !!pushLike;// Return "true" if a document exists, "false" otherwise
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
            const post
                = await LikesForPostMongoModel.findOne({
                postId: id
            })

            const isInLikes = post!.likes.some(like => like.userId === userId);
            const isInDislikes = post!.dislikes.some(dislike => dislike.userId === userId);

            const isUserExists = isInLikes || isInDislikes;


            if (isUserExists) {
                // это для случая,если у нас 1 юзер
                const removeLike =
                    await LikesForPostMongoModel
                        .updateOne(
                            {postId: id},
                            {$pull: {likes: userId}});
                return !!removeLike;// Return true if a document exists, "false" otherwise

            } else {
                const pushDislike =
                    await LikesForPostMongoModel
                        .updateOne(
                            {commentId: id},
                            {$push: {dislike: userId}});
                console.log("post dislike= ", pushDislike)
                return !!pushDislike;// Return "true" if a document exists, "false" otherwise
            }

        } catch (error) {
            console.log("error = ", error)
            return false;
        }
    }

    static async updatePost(postId: string,
                            data: LikeInfo,
                            likeStatus: LikeStatus) {
        try {
            if (likeStatus === LikeStatus.LIKE) {
                const post =
                    await LikesForPostMongoModel
                        .updateOne(
                            {postId: postId},
                            {$push: {likes: data}});
                console.log("post like = ", post)
                return !!post;// Return "true" if a document exists, "false" otherwise
            } else {
                const post =
                    await LikesForPostMongoModel
                        .updateOne(
                            {postId: postId},
                            {$push: {dislikes: data}});
                console.log("post dislike= ", post)
                return !!post;// Return "true" if a document exists, "false" otherwise
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