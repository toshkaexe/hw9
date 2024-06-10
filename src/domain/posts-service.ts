
import {PostsRepository} from "../repositories/posts-repository";
import {UpdatePostModel, CreatePostInputModel, PostDbModel} from "../models/posts/posts-models";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {BlogMongoModel} from "../db/schemas";

export class PostsService {
    static async createPost(inputData: CreatePostInputModel) {

        console.log("inputdata = " , inputData);

        //error
             const blog= await BlogsQueryRepository
            .findBlogById(inputData.blogId)

        if (!blog) return null

        const newPost: PostDbModel = {
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        console.log("in create Post")
        const post = await PostsRepository.savePost(newPost);
        return post!._id
    };

    static async updatePost(postId: string, body: UpdatePostModel) {
        return await PostsRepository.updatePost(postId, body);
    };

    static async deletePost(id: string) {
        return await PostsRepository.deletePost(id);
    };

    static async deleteAll() {
        return await PostsRepository.deleteAll();
    }
}