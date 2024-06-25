import {LikesForPostsRepository} from "../repositories/likes-for-posts-repository";


export class LikeForPostsService {

    static async getLikes(postId: string) {
        return await LikesForPostsRepository.getNumberOfLikes(postId)
    }

    static async getDislikes(postId: string) {
        return await LikesForPostsRepository.getNumberOfDisLikes(postId)
    }
}