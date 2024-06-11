import {HelpLikesInfo} from "../models/likes/likes-model";
import {LikeStatus} from "../models/common";
import {CommentToLikeRepository} from "../repositories/comment-to-like-repository";

export class LikeService {
    static async pushLikeOrDislike(userId: string,
                                   commentId: string,
                                   likeStatus: LikeStatus) {

        const comment =
            await CommentToLikeRepository.getCommentByCommentId(commentId);

        if (!comment) {
            // create new record in db
            const likeInfo: HelpLikesInfo = {
                commentId: commentId,
                likes: [],
                dislikes: []
            }
            if (likeStatus === LikeStatus.LIKE) {
                likeInfo.likes.push(userId);
                await CommentToLikeRepository.saveInRepo(likeInfo)
            }
            if (likeStatus === LikeStatus.DISLIKE) {
                likeInfo.dislikes.push(userId);
                await CommentToLikeRepository.saveInRepo(likeInfo)
            }

        } else {
            const isUserIDinLikes = await CommentToLikeRepository.hasLikefromUser(commentId, userId);
            const isUserIDinDisLikes = await CommentToLikeRepository.hasDislikefromUser(commentId, userId);

            switch (likeStatus) {
                case LikeStatus.LIKE:
                    console.log("isUserIDinLikes = ", isUserIDinLikes);
                    console.log("isUserIDinDisLikes = ", isUserIDinDisLikes);
                    if (!isUserIDinLikes && !isUserIDinDisLikes) {
                        await CommentToLikeRepository.updateComment(commentId, userId, likeStatus);
                    }
                    if (isUserIDinLikes) {
                        return;
                    } else { // remove userId from dislike
                        await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.LIKE);
                        await CommentToLikeRepository.removeUserDislikefromUser(commentId, userId);
                    }
                    break;

                case LikeStatus.DISLIKE:
                    console.log("isUserIDinLikes = ", isUserIDinLikes);
                    console.log("isUserIDinDisLikes = ", isUserIDinDisLikes);
                    if (!isUserIDinLikes && !isUserIDinDisLikes) {
                        await CommentToLikeRepository.updateComment(commentId, userId, likeStatus);
                    }
                    if (isUserIDinDisLikes) {
                        return;
                    } else { // remove userId from dislike
                        await CommentToLikeRepository.updateComment(commentId, userId, LikeStatus.DISLIKE);
                        await CommentToLikeRepository.removeUserLikefromUser(commentId, userId);
                    }
                    break;

                default:
                    // handle default case if necessary
                    break;
            }

            // // get current status
            //
            // if (likeStatus === LikeStatus.LIKE) {
            //
            //     const isUserIDinLikes =
            //         await CommentToLikeRepository.hasLikefromUser(
            //             commentId, userId);
            //
            //     const isUserIDinDisLikes =
            //         await CommentToLikeRepository.hasDislikefromUser(
            //             commentId, userId);
            //
            //     console.log("isUserIDinLikes = ", isUserIDinLikes)
            //     console.log("isUserIDinDisLikes = ", isUserIDinDisLikes)
            //
            //     if (!isUserIDinLikes && !isUserIDinDisLikes) {
            //         await CommentToLikeRepository.updateComment(
            //             commentId, userId, likeStatus)
            //     }
            //
            //     if (isUserIDinLikes) {
            //         return
            //     } else { // remove userId from dislike
            //         await CommentToLikeRepository.updateComment(
            //             commentId, userId, LikeStatus.LIKE)
            //         await CommentToLikeRepository
            //             .removeUserDislikefromUser(commentId, userId)
            //
            //     }
            // }
            // if (likeStatus === LikeStatus.DISLIKE) {
            //
            //     const isUserIDinLikes =
            //         await CommentToLikeRepository.hasLikefromUser(
            //             commentId, userId);
            //
            //     const isUserIDinDisLikes =
            //         await CommentToLikeRepository.hasDislikefromUser(
            //             commentId, userId);
            //
            //     console.log("isUserIDinLikes = ", isUserIDinLikes)
            //     console.log("isUserIDinDisLikes = ", isUserIDinDisLikes)
            //
            //     if (!isUserIDinLikes && !isUserIDinDisLikes) {
            //         await CommentToLikeRepository.updateComment(
            //             commentId, userId, likeStatus)
            //     }
            //
            //     if (isUserIDinDisLikes) {
            //         return
            //     } else { // remove userId from dislike
            //         await CommentToLikeRepository.updateComment(
            //             commentId, userId, LikeStatus.DISLIKE)
            //         await CommentToLikeRepository
            //             .removeUserLikefromUser(commentId, userId)
            //
            //
            //     }
            // }

        }
    }
}
