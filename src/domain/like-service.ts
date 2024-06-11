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
}
