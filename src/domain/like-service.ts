import {HelpLikesInfo, UserIDS} from "../models/likes/likes-model";
import {HelpLikesInfoMongoModel} from "../db/schemas";
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
            //update number of likes/dislikes for the commentId in db
            const updateComment = await CommentToLikeRepository
                .updateComment(commentId, userId, likeStatus)
        }
    }
}
