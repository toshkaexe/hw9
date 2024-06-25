import {LikeToPostModel} from "../db/schemas";
import {LikeStatus} from "../models/common";

export class LikesForPostsRepository {
    static async getNumberOfLikes(postId: string
    ) {
        try {
            const likes =
                await LikeToPostModel
                    .countDocuments({
                        postId: postId,
                        status: LikeStatus.LIKE
                    });
            console.log("getNumberOfLikes likes====->", likes)
            if (!likes) return 0;
            return likes;
        } catch (error) {
            console.log("error=", error)
            return 0
        }
    }

    static async getNumberOfDisLikes(postId: string) {
        try {
            const dislikes =
                await LikeToPostModel
                    .countDocuments({
                        postId: postId,
                        status: LikeStatus.DISLIKE
                    });

            console.log("getNumberOfDisLikes dislikes====->", dislikes)
            if (!dislikes) return 0;
            return dislikes;
        } catch (error) {
            console.log("error=", error)
            return 0
        }
    }


    static async getMyStatus(postId: string,
                            userId: string) {

        try {
            const user =
                await LikeToPostModel
                    .findOne({
                        postId: postId,
                        userId: userId
                    });
            console.log("getMyStatus=", user)
            if (!user) return LikeStatus.NONE;
            return user.status;
        } catch (error) {
            console.log("error=", error)
            return LikeStatus.NONE
        }


    }


}