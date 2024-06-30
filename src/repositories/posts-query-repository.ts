import {Paginator} from "../models/posts/posts-models";
import {PostDbModel, postMapper, OutputPostModel} from "../models/posts/posts-models";

import {ObjectId, WithId} from "mongodb";
import {PostMongoModel} from "../db/schemas";
import {LikeForPostsService} from "../domain/like-for-posts-service";
import {LikesForPostsRepository} from "./likes-for-posts-repository";
import {logoutTokenInCookie} from "../middleware/verify-token-in-cookie";
import {blogValidationPostToBlog} from "../validators/blog-validation";
import {LikeToCommentRepository} from "./like-to-comment-repository";

export class PostsQueryRepository {

    static async findPostsForUnauthorizedUser(pageNumber: number,
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
        const scip = (pageNumber - 1) * pageSize

        const posts =
            await PostMongoModel
            .find({})
            .sort(sortOptions)
            .skip(scip)
            .limit(+pageSize);


        console.log("posts===", posts)

        for (const post of posts) {
            let postId = post.id.toString();
            console.log(post.id.toString())
            post!.extendedLikesInfo.likesCount = await LikeForPostsService.getLikes(postId)
            post!.extendedLikesInfo.dislikesCount = await LikeForPostsService.getDislikes(postId)
             let array =
                await LikeForPostsService.getUsersWhoLikes(postId)

            console.log("------------array>,", array)
            post!.extendedLikesInfo.newestLikes = array;

        }

        console.log(totalCount, 'its totalCount')
        console.log("-->=posts=", posts)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }



    static async findPostsForAuthorizedUser(pageNumber: number,
                                              pageSize: number,
                                              sortBy: string,
                                              sortDirection: string,
                                            userId: string): Promise<Paginator<OutputPostModel>> {

        let sortOptions: { [key: string]: 1 | -1 } = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const totalCount = await PostMongoModel.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const scip = (pageNumber - 1) * pageSize

        const posts =
            await PostMongoModel
                .find({})
                .sort(sortOptions)
                .skip(scip)
                .limit(+pageSize);


        console.log("posts===", posts)

        for (const post of posts) {
            let postId = post.id.toString();
            console.log(post.id.toString())
            post!.extendedLikesInfo.likesCount = await LikeForPostsService.getLikes(postId)
            post!.extendedLikesInfo.dislikesCount = await LikeForPostsService.getDislikes(postId)
            post!.extendedLikesInfo.myStatus = await LikesForPostsRepository.getMyStatus(postId, userId)
            let array =
                await LikeForPostsService.getUsersWhoLikes(postId)

            console.log("------------array>,", array)
            post!.extendedLikesInfo.newestLikes = array;

        }

        console.log(totalCount, 'its totalCount')
        console.log("-->=posts=", posts)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


    static async findPostById(postId: string, userId: string, flag: boolean): Promise<OutputPostModel | null> {

        if (!ObjectId.isValid(postId)) return null
        const post: WithId<PostDbModel> | null = await PostMongoModel.findById(postId)


        console.log("find post by postId=", post)

        post!.extendedLikesInfo.likesCount = await LikeForPostsService.getLikes(postId)
        post!.extendedLikesInfo.dislikesCount = await LikeForPostsService.getDislikes(postId)

        if (!flag) {
            post!.extendedLikesInfo.myStatus = "None"
            console.log("post=", post)
            return post ? postMapper(post) : null
        }
        console.log("HELOOOOOOOOO!")
        console.log("userId=", userId)
        if (!userId) {
            post!.extendedLikesInfo.myStatus = "None"
            console.log("post=", post)
            return post ? postMapper(post) : null
        }
        post!.extendedLikesInfo.myStatus = await LikesForPostsRepository.getMyStatus(postId, userId)

        const array =
            await LikeForPostsService.getUsersWhoLikes(postId)

        console.log("------------array =***** >,", array)
        post!.extendedLikesInfo.newestLikes = array;
        console.log("post=", post)
        if (!post) return null
        const afterMapping = postMapper(post)
        afterMapping.extendedLikesInfo.newestLikes=array

        console.log("afterMapping=", afterMapping)
        return afterMapping
    }

}