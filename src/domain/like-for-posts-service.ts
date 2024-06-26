import {LikesForPostsRepository} from "../repositories/likes-for-posts-repository";
import {LikeToPostModel} from "../db/schemas";
import {LikeStatus} from "../models/common";


export class LikeForPostsService {

    static async getLikes(postId: string) {
        return await LikesForPostsRepository.getNumberOfLikes(postId)
    }

    static async getDislikes(postId: string) {
        return await LikesForPostsRepository.getNumberOfDisLikes(postId)
    }

    static async getUsersWhoLikes(postId: string) {

       try {
            const likes =
                await LikeToPostModel.find({ postId: postId, status: LikeStatus.LIKE})
                .sort({ updated: -1 }) // Sort by updated date in descending order
                .limit(3); // Limit to the latest 3 likes
            console.log("likes====", likes)
           return likes.map(like => ({
                addedAt: like.updated.toISOString(),
                userId: like.userId,
                login: like.userLogin
            }));
        } catch (error) {
            console.error('Error fetching latest likes:', error);
            return [];
        }
    }
}