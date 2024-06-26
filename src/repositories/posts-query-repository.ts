import {Paginator} from "../models/posts/posts-models";
import {PostDbModel, postMapper, OutputPostModel} from "../models/posts/posts-models";

import {ObjectId, WithId} from "mongodb";
import {PostMongoModel} from "../db/schemas";
import {LikeForPostsService} from "../domain/like-for-posts-service";
import {LikesForPostsRepository} from "./likes-for-posts-repository";
import {logoutTokenInCookie} from "../middleware/verify-token-in-cookie";
import {blogValidationPostToBlog} from "../validators/blog-validation";

export class PostsQueryRepository {

    static async findPosts(page: number,
                           pageSize: number,
                           sortBy: string,
                           sortDirection: string): Promise<Paginator<OutputPostModel>> {

        let sortOptions: { [key: string]: 1 | -1 } = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const totalCount = await PostMongoModel.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const scip = (page - 1) * pageSize
        const post = await PostMongoModel
            .find({})
            .sort(sortOptions)
            .skip(scip)
            .limit(pageSize);

        console.log(totalCount, 'its totalCount')

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: post.map(postMapper)
        }
    }

    static async findPostById(postId: string, userId: string): Promise<OutputPostModel | null> {

        if (!ObjectId.isValid(postId)) return null
        const post: WithId<PostDbModel> | null = await PostMongoModel.findById(postId)


        console.log("find post by postId=", post)

        post!.extendedLikesInfo.likesCount = await LikeForPostsService.getLikes(postId)
        post!.extendedLikesInfo.dislikesCount = await LikeForPostsService.getDislikes(postId)

        console.log("userId=", userId)
        if (!userId) {
            post!.extendedLikesInfo.myStatus = "None"
            console.log("post=", post)
            return post ? postMapper(post) : null
        }
        post!.extendedLikesInfo.myStatus = await LikesForPostsRepository.getMyStatus(postId, userId)

        let array =
            await LikeForPostsService.getUsersWhoLikes(postId)

        console.log("------------array>,", array)
        post!.extendedLikesInfo.newestLikes = array;
        console.log("post=", post)

        if (!post) return null

        const afterMapping = postMapper(post)

        afterMapping.extendedLikesInfo.newestLikes= array

        console.log("afterMapping=", afterMapping)
        return afterMapping
    }

}