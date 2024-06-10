import {BlogDbModel, blogMapper, BlogViewModel, Paginator} from
        "../models/blogs/blog-models";

import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../models/posts/posts-models";
import {BlogMongoModel, PostMongoModel} from "../db/schemas";

export class BlogsQueryRepository {

    static async findBlogs(page: number,
                           pageSize: number,
                           sortBy: string,
                           sortDirection: string,
                           searchNameTerm: string | null,):
        Promise<Paginator<BlogViewModel>> {

        let searchNameFilter = {}
        if (searchNameTerm) {
            searchNameFilter = {name:
                    {$regex: searchNameTerm,
                        $options: 'i'}}
        }
        let sortOptions: { [key: string]: 1 | -1 } = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        console.log("----------totalCount---")
        const totalCount = await BlogMongoModel.countDocuments(searchNameFilter)
        console.log("totalCoult", totalCount)

        const pagesCount = Math.ceil(totalCount / +pageSize)
        const scip = (+page - 1) * +pageSize
        const blogs = await BlogMongoModel
            .find(searchNameFilter)
            .sort(sortOptions)
            .skip(scip)
            .limit(+pageSize)

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }
    }

    static async getPostsToBlog(id: string,
                                pageNumber: number,
                                pageSize: number,
                                sortBy: string,
                                sortDirection: string) {
        try {
            if (!ObjectId.isValid(id)) return null
            let sortOptions: { [key: string]: 1 | -1 } = {
                [sortBy]: -1
            }
            if (sortDirection === "asc") {
                sortOptions[sortBy] = 1
            }
            const filter = {blogId: id}

            const totalCount = await PostMongoModel.countDocuments(filter)
            const pagesCount = Math.ceil(+totalCount / +pageSize)
            const scip = (+pageNumber - 1) * +pageSize
            const posts = await PostMongoModel
                .find(filter)
                .sort(sortOptions)
                .skip(scip)
                .limit(+pageSize);

            return posts ? {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: posts.map(postMapper)
            } : null
        } catch (err) {
            return err
        }
    }

    static async findBlogById(id: string): Promise<BlogViewModel | null> {

        console.log("start in findBlogById")
      //  if (!ObjectId.isValid(id)) return null
        const blog: WithId<BlogDbModel> | null = await BlogMongoModel.findById(id)
        console.log("blog---",blog)
        return blog ? blogMapper(blog) : null
    }

}