import {
    BlogDbModel,
    BlogViewModel,
    UpdateBlogModel
} from "../models/blogs/blog-models";
import {blogMapper} from "../models/blogs/blog-models";
import {InsertOneResult, ObjectId} from "mongodb";
import {BlogMongoModel} from "../db/schemas";

export class BlogRepository {

    static async createBlog(newBlog: BlogDbModel) {
        const result = new BlogMongoModel(newBlog)
        await result.save()
        return result._id;
    }

    static async updateBlog(id: string, blog: UpdateBlogModel): Promise<boolean> {
        try {
            const updatedBlog = await BlogMongoModel.findById(id)

            if (!updatedBlog) return false

            updatedBlog.name = blog.name;
            updatedBlog.description = blog.description;
            updatedBlog.websiteUrl = blog.websiteUrl;

            const result = await updatedBlog.save();


            return true;
        } catch (err) {
            return false;
        }
    }


    static async deleteBlogById(id: string): Promise<boolean> {
        try {
            const blog = await BlogMongoModel.findOne({_id: new ObjectId(id)})
            if (!blog) return  false;

            await blog.deleteOne()

            return true
        } catch (err) {
            return false;
        }
    }

    static async deleteAll() {
        const result = await BlogMongoModel.deleteMany({})
    }


    static async getBlogById(id: string): Promise<BlogViewModel | null> {
        if (id == null) return null;
        try {
            const blog = await BlogMongoModel.findOne({_id: new ObjectId(id)});
            if (!blog) {
                return null
            }
            return blogMapper(blog)
        } catch (err) {
            return null;
        }
    }

}

/*    static async createBlog(createdData: CreateBlogModel): Promise<String | null> {
        const createdAt = new Date();

        try {
            const newBlog: BlogDBType = {
                ...createdData,
                createdAt: createdAt.toISOString(),
                isMembership: false
            }
            const blog = await blogsCollection.insertOne(newBlog)

            return blog.insertedId.toString();
        } catch (err) {
            return null;
        }
    }*/

/*static async getAllBlogs(sortData: SortDataType): Promise<OutputBlogType[]> {
const sortDirection = sortData.sortDirection ?? 'desc'
const sortBy = sortData.sortBy ?? 'createdAt'
const searchNameTerm = sortData.searchNameTerm ?? null
const pageSize = sortData.pageSize ?? 10
const pageNumber = sortData.pageNumber ?? 1

let filter = {}

if (searchNameTerm) {
    filter = {
        name: {
            $regex: searchNameTerm,
            $options: 'i'
        }
    }
}


const blogs =
    await blogsCollection
        .find(filter)
        .sort(sortBy, sortDirection)
        .skip((+pageNumber-1) * +pageSize)
        .limit(+pageSize)
        .toArray();

const totalCount =
    await blogsCollection
        .countDocuments(filter);

const pageCount =  Math.ceil(totalCount/+pageSize);

return {
    pagesCount: pageCount,
    page: +pageNumber,
    pageSize: +totalCount,
    items: blogs.map(blogMapper)
}
}
*/









