import {BlogDbModel, blogMapper, OutputBlogModel, Paginator} from
        "../models/blogs/blog-models";
import {blogsCollection, postsCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {postMapper} from "../models/posts/posts-models";

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
        const totalCount = await blogsCollection.countDocuments(searchNameFilter)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const scip = (+page - 1) * +pageSize
        const blogs = await blogsCollection
            .find(searchNameFilter)
            .sort(sortOptions)
            .skip(scip)
            .limit(+pageSize)
            .toArray()

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

            const totalCount = await postsCollection.countDocuments(filter)
            const pagesCount = Math.ceil(+totalCount / +pageSize)
            const scip = (+pageNumber - 1) * +pageSize
            const posts = await postsCollection
                .find(filter)
                .sort(sortOptions)
                .skip(scip)
                .limit(+pageSize)
                .toArray()

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
        const blog: WithId<BlogDbModel> | null = await blogsCollection.findOne(
            {_id: new ObjectId(id)})
        return blog ? blogMapper(blog) : null
    }

}