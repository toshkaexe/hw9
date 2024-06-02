import {Paginator} from "../models/posts/posts-models";
import {PostDbModel, postMapper, OutputPostModel} from "../models/posts/posts-models";

import {ObjectId, WithId} from "mongodb";
import {PostMongoModel} from "../db/schemas";

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

    static async findPostById(id: string): Promise<OutputPostModel | null> {
        if (!ObjectId.isValid(id)) return null
        const post: WithId<PostDbModel> | null = await PostMongoModel.findOne({_id: new ObjectId(id)})
        return post ? postMapper(post) : null
    }

}