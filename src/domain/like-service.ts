import {HelpLikesInfo, LikeInfo, LikesForPost} from "../models/likes/likes-model";
import {LikeStatus} from "../models/common";
import {LikeToCommentRepository} from "../repositories/like-to-comment-repository";
import {LikeToPostRepository} from "../repositories/like-to-post-repository";
import {UserMongoModel} from "../db/schemas";

export class LikeService {
    static async pushLikeOrDislike(userId: string,
                                   postId: string,
                                   commentId: string,
                                   likeStatus: LikeStatus) {

        // проверка, что у нас есть коммент
        const comment =
            await LikeToCommentRepository.getCommentByCommentId(commentId);

        if (!comment) {
            //если нет коммента, то создаем
            // create new record in db
            const likeInfo: HelpLikesInfo = {
                commentId: commentId,
                postId: postId,
                likes: [],
                dislikes: []
            }
            // и пушим лайк или дизлайк
            switch (likeStatus) {
                case LikeStatus.LIKE:
                    likeInfo.likes.push(userId);
                    await LikeToCommentRepository.saveInRepo(likeInfo);
                    break;
                case LikeStatus.DISLIKE:
                    likeInfo.dislikes.push(userId);
                    await LikeToCommentRepository.saveInRepo(likeInfo);
                    break;
                case LikeStatus.NONE:
                    await LikeToCommentRepository.saveInRepo(likeInfo);
                    break;
                default:
                    throw new Error("Invalid like status");
            }
        } else {

            const setUserLike = await LikeToCommentRepository.InUserInLikeArray(commentId, userId);
            const setUserDisLike = await LikeToCommentRepository.IsUserInDislikeArray(commentId, userId);

            console.log("setUserLike = ", setUserLike);
            console.log("setUserDisLike = ", setUserDisLike);

            if (!setUserLike && !setUserDisLike) {

                const update = await LikeToCommentRepository.updateComment(commentId, userId, likeStatus);
                return true
            }


            switch (likeStatus) {
                case LikeStatus.LIKE:
                    if (setUserLike) {
                        return;
                    } else {

                        await LikeToCommentRepository.updateComment(commentId, userId, LikeStatus.LIKE);
                        await LikeToCommentRepository.removeUserDislikeFromUser(commentId, userId);
                    }
                    break;
                case LikeStatus.DISLIKE:
                    if (setUserDisLike) {
                        return;
                    } else {


                        await LikeToCommentRepository.updateComment(commentId, userId, LikeStatus.DISLIKE);
                        await LikeToCommentRepository.removeUserLikeFromUser(commentId, userId);
                    }
                    break;
                case LikeStatus.NONE:

                    await LikeToCommentRepository.removeUserLikeFromUser(commentId, userId);
                    await LikeToCommentRepository.removeUserDislikeFromUser(commentId, userId);
                    break;
                default:
                    throw new Error("Invalid likeStatus")
            }
        }
        return true
    }

    static async pushLikeOrDislikeForPost(
        userId: string,
        blogId: string,
        postId: string,
        likeStatus: LikeStatus
    ) {
        // проверка, что у нас есть пост
        const post =
            await LikeToPostRepository.getPostByPostId(postId);

        if (!post) {
            //если нет коммента, то создаем
            // create new record in db
            const postLikeInfo: LikesForPost = {
                postId: postId,
                blogId: blogId,
                likes: [],
                dislikes: []
            }
            const user = await UserMongoModel.findById(userId);
            const likeInfoDetails: LikeInfo = {
                userId: userId,
                userLogin: user!.userData.login,
                createdAt: new Date()
            }
            // и пушим лайк или дизлайк
            switch (likeStatus) {
                case LikeStatus.LIKE:
                    postLikeInfo.likes.push(likeInfoDetails);
                    await LikeToPostRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.DISLIKE:
                    postLikeInfo.dislikes.push(likeInfoDetails);
                    await LikeToPostRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.NONE:
                    await LikeToPostRepository.saveInRepo(postLikeInfo);
                    break;
                default:
                    throw new Error("Invalid like status");
            }
        } else {
            //
            const previousUserLike = await LikeToPostRepository.InUserInLikeArray(postId, userId);
            const previousUserDisLike = await LikeToPostRepository.IsUserInDislikeArray(postId, userId);
            //
            console.log("previousUserLike = ", previousUserLike);
            console.log("previousUserDisLike = ", previousUserDisLike);
            console.log("UserLike = ", likeStatus);
            //
            if (!previousUserLike && !previousUserDisLike) {

                const user = await UserMongoModel.findById(userId);

                const likeInfoDetails: LikeInfo = {
                    userId: userId,
                    userLogin: user!.userData.login,
                    createdAt: new Date()
                }

                const update = await LikeToPostRepository
                    .updatePost(postId, likeInfoDetails, likeStatus);
                return true
            }


            switch (likeStatus) {
                case LikeStatus.LIKE:
                    if (previousUserLike) {
                        return;
                    } else {
                        const user = await UserMongoModel.findById(userId);

                        const likeInfoDetails: LikeInfo = {
                            userId: userId,
                            userLogin: user!.userData.login,
                            createdAt: new Date()
                        }
                        await LikeToPostRepository
                            .updatePost(postId, likeInfoDetails, LikeStatus.LIKE);
                        await LikeToPostRepository
                            .removeUserDislikeFromUser(postId, userId);
                    }
                    break;
                case LikeStatus.DISLIKE:
                    if (previousUserDisLike) {
                        return;



                    } else {
                        const user = await UserMongoModel.findById(userId);

                        const likeInfoDetails: LikeInfo = {
                            userId: userId,
                            userLogin: user!.userData.login,
                            createdAt: new Date()
                        }

                        await LikeToPostRepository
                            .updatePost(postId, likeInfoDetails, LikeStatus.DISLIKE);
                        await LikeToPostRepository.removeUserLikeFromUser(postId, userId,);
                    }
                    break;
                case LikeStatus.NONE:

                    await LikeToPostRepository.removeUserLikeFromUser(postId, userId);
                    await LikeToPostRepository.removeUserDislikeFromUser(postId, userId);
                    break;
                default:
                    throw new Error("Invalid likeStauts")
            }


        }
        return true

    }
}
