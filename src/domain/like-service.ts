import {HelpLikesInfo, LikeForPost} from "../models/likes/likes-model";
import {LikeStatus} from "../models/common";
import {LikeToCommentRepository} from "../repositories/like-to-comment-repository";
import {LikeToPostRepository} from "../repositories/like-to-post-repository";
import {LikeToPostModel, UserMongoModel} from "../db/schemas";

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
            await LikeToPostRepository.findIfUserSetLikeOrDislike(postId,
                userId,
                blogId);
        if (!post) {
            //если нет лайка к постам, то создаем
            // create new record in db
            const user =
                await UserMongoModel.findById(userId);
            const postLikeInfo: LikeForPost = {
                postId: postId,
                blogId: blogId,
                userId: userId,
                userLogin: user!.userData.login,
                status: likeStatus,
                updated: new Date()
            }

            // и пушим лайк или дизлайк
            switch (likeStatus) {
                case LikeStatus.LIKE:
                    await LikeToPostRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.DISLIKE:
                    await LikeToPostRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.NONE:
                    break;
                default:
                    throw new Error("Invalid like status");
            }
            return true
        } else {
            const document =
                await LikeToPostModel.findOne({
                    postId: postId,
                    blogId: blogId,
                    userId: userId,
                });
            if (!document) {
                return false
            }
            const user =
                await UserMongoModel.findById(userId);

            if (document!.status === likeStatus) {
                return true
            } else {
                switch (likeStatus) {
                    case LikeStatus.LIKE:
                        // Change to dislike
                        console.log("----need to change to dislike");
                        await deleteLike(postId, blogId, userId);
                        return await saveLike(postId, blogId, userId, user!.userData.login, likeStatus);

                    case LikeStatus.DISLIKE:
                        // Change to like
                        console.log("----need to change to like");
                        await deleteLike(postId, blogId, userId);
                        return await saveLike(postId, blogId, userId, user!.userData.login, likeStatus);

                    case LikeStatus.NONE:
                        console.log("----we are in none");
                        await deleteLike(postId, blogId, userId);
                        return false;

                    default:
                        throw new Error(`Unexpected like status: ${likeStatus}`);
                }
            }
        }

        async function deleteLike(postId: string, blogId: string, userId: string) {
            const document = await LikeToPostModel.deleteOne({
                postId: postId,
                blogId: blogId,
                userId: userId,
            });
            console.log("Deleted document:", document);
        }

        async function saveLike(postId: string, blogId: string, userId: string, userLogin: string, status: LikeStatus) {
            const postLikeInfo: LikeForPost = {
                postId: postId,
                blogId: blogId,
                userId: userId,
                userLogin: userLogin,
                status: status,
                updated: new Date()
            };
            return await LikeToPostRepository.saveInRepo(postLikeInfo);
        }
    }
}
