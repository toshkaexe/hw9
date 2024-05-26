import {BlogDbModel, blogMapper, OutputBlogModel, Paginator} from
        "../models/blogs/blog-models";

import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../models/posts/posts-models";
import {BlogModel, PostModel} from "../db/schemas";

export class BlogsQueryRepository {

    static async findBlogs(page: number,
                           pageSize: number,
                           sortBy: string,
                           sortDirection: string,
                           searchNameTerm: string | null,): Promise<Paginator<OutputBlogModel>> {

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
        const totalCount = await BlogModel.countDocuments(searchNameFilter)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const scip = (+page - 1) * +pageSize
        const blogs = await BlogModel
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

            const totalCount = await PostModel.countDocuments(filter)
            const pagesCount = Math.ceil(+totalCount / +pageSize)
            const scip = (+pageNumber - 1) * +pageSize
            const posts = await PostModel
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

    static async findBlogById(id: string): Promise<OutputBlogModel | null> {
        if (!ObjectId.isValid(id)) return null
        const blog: WithId<BlogDbModel> | null = await BlogModel.findOne(
            {_id: new ObjectId(id)})
        return blog ? blogMapper(blog) : null
    }

}