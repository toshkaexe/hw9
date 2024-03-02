
import {PostsRepository} from "../repositories/posts-repository";
import {UpdatePostModel, CreatePostInputModel, PostDbModel} from "../models/posts/posts-models";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";

export class PostsService {
    static async createPost(inputData: CreatePostInputModel) {

        const blog= await BlogsQueryRepository
            .findBlogById(inputData.blogId)
        if (!blog) return null
        const newPost: PostDbModel = {
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        return await PostsRepository.createPost(newPost)
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