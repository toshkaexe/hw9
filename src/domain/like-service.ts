import {HelpLikesInfo, LikeInfo, LikesForPost} from "../models/likes/likes-model";
import {LikeStatus} from "../models/common";
import {CommentToLikeRepository} from "../repositories/comment-to-like-repository";
import {PostToLikeRepository} from "../repositories/post-to-like-repository";
import {UserMongoModel} from "../db/schemas";

export class LikeService {
    static async pushLikeOrDislike(userId: string,
                                   postId: string,
                                   commentId: string,
                                   likeStatus: LikeStatus) {

        // проверка, что у нас есть коммент
        const comment =
            await CommentToLikeRepository.getCommentByCommentId(commentId);

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
                    await CommentToLikeRepository.saveInRepo(likeInfo);
                    break;
                case LikeStatus.DISLIKE:
                    likeInfo.dislikes.push(userId);
                    await CommentToLikeRepository.saveInRepo(likeInfo);
                    break;
                case LikeStatus.NONE:
                    await CommentToLikeRepository.saveInRepo(likeInfo);
                    break;
                default:
                    throw new Error("Invalid like status");
            }
        } else {

            const setUserLike = await CommentToLikeRepository.InUserInLikeArray(commentId, userId);
            const setUserDisLike = await CommentToLikeRepository.IsUserInDislikeArray(commentId, userId);

            console.log("setUserLike = ", setUserLike);
            console.log("setUserDisLike = ", setUserDisLike);

            if (!setUserLike && !setUserDisLike) {

                const update = await CommentToLikeRepository.updateComment(commentId, userId, likeStatus);
                return true
            }


            switch (likeStatus) {
                case LikeStatus.LIKE:
                    if (setUserLike) {
                        return;
                    } else {

                        await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.LIKE);
                        await CommentToLikeRepository.removeUserDislikeFromUser(commentId, userId);
                    }
                    break;
                case LikeStatus.DISLIKE:
                    if (setUserDisLike) {
                        return;
                    } else {


                        await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.DISLIKE);
                        await CommentToLikeRepository.removeUserLikeFromUser(commentId, userId);
                    }
                    break;
                case LikeStatus.NONE:

                    await CommentToLikeRepository.removeUserLikeFromUser(commentId, userId);
                    await CommentToLikeRepository.removeUserDislikeFromUser(commentId, userId);
                    break;
                default:
                    throw new Error("Invalid likeStauts")
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
            await PostToLikeRepository.getPostByPostId(postId);

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
                    await PostToLikeRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.DISLIKE:
                    postLikeInfo.dislikes.push(likeInfoDetails);
                    await PostToLikeRepository.saveInRepo(postLikeInfo);
                    break;
                case LikeStatus.NONE:
                    await PostToLikeRepository.saveInRepo(postLikeInfo);
                    break;
                default:
                    throw new Error("Invalid like status");
            }
        } else {
            //
            //
            // const setUserLike = await CommentToLikeRepository.InUserInLikeArray(postId, userId);
            // const setUserDisLike = await CommentToLikeRepository.IsUserInDislikeArray(commentId, userId);
            //
            // console.log("setUserLike = ", setUserLike);
            // console.log("setUserDisLike = ", setUserDisLike);
            //
            // if (!setUserLike && !setUserDisLike) {
            //
            //     const update = await CommentToLikeRepository.updateComment(commentId, userId, likeStatus);
            //     return true
            // }
            //
            //
            // switch (likeStatus) {
            //     case LikeStatus.LIKE:
            //         if (setUserLike) {
            //             return;
            //         } else {
            //
            //             await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.LIKE);
            //             await CommentToLikeRepository.removeUserDislikeFromUser(commentId, userId);
            //         }
            //         break;
            //     case LikeStatus.DISLIKE:
            //         if (setUserDisLike) {
            //             return;
            //         } else {
            //
            //
            //             await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.DISLIKE);
            //             await CommentToLikeRepository.removeUserLikeFromUser(commentId, userId);
            //         }
            //         break;
            //     case LikeStatus.NONE:
            //
            //         await CommentToLikeRepository.removeUserLikeFromUser(commentId, userId);
            //         await CommentToLikeRepository.removeUserDislikeFromUser(commentId, userId);
            //         break;
            //     default:
            //         throw new Error("Invalid likeStauts")
            // }
            //
            //
        }

    }
}
