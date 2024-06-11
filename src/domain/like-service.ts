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

            // get current status

            if (likeStatus === LikeStatus.LIKE) {

                const setUserLike =
                    await CommentToLikeRepository.hasLikefromUser(
                        commentId, userId);

                const setUserDisLike =
                    await CommentToLikeRepository.hasDislikefromUser(
                        commentId, userId);

                console.log("setUserLike = ", setUserLike)
                console.log("setUserDisLike = ", setUserDisLike)

                if (!setUserLike && !setUserDisLike) {
                    await CommentToLikeRepository.updateComment(
                        commentId, userId, likeStatus)
                }

                if (setUserLike) {
                    return
                } else { // remove userId from dislike
                    await CommentToLikeRepository.updateComment(
                        commentId, userId, LikeStatus.LIKE)
                    await CommentToLikeRepository
                        .removeUserDislikefromUser(commentId, userId)

                }
            }
            if (likeStatus === LikeStatus.DISLIKE) {

                const setUserLike =
                    await CommentToLikeRepository.hasLikefromUser(
                        commentId, userId);

                const setUserDisLike =
                    await CommentToLikeRepository.hasDislikefromUser(
                        commentId, userId);

                console.log("setUserLike = ", setUserLike)
                console.log("setUserDisLike = ", setUserDisLike)

                if (!setUserLike && !setUserDisLike) {
                    await CommentToLikeRepository.updateComment(
                        commentId, userId, likeStatus)
                }

                if (setUserDisLike) {
                    return
                } else { // remove userId from dislike
                    await CommentToLikeRepository.updateComment(
                        commentId, userId, LikeStatus.DISLIKE)
                    await CommentToLikeRepository
                        .removeUserLikefromUser(commentId, userId)


                }
            }


            //get current status of who where

            //update number of likes/dislikes for the commentId in db
            // const updateComment = await CommentToLikeRepository
            //   .updateComment(commentId, userId, likeStatus)
        }
    }
}
