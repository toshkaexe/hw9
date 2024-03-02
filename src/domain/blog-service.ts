import {CreateBlogModel, UpdateBlogModel} from "../models/blogs/blog-models";
import {BlogRepository} from "../repositories/blog-repository";
export class BlogService {
    static async createBlog(body: CreateBlogModel) {
        const newBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return BlogRepository.createBlog(newBlog);
    };

    static async updateBlog(id: string, body: UpdateBlogModel) {
      return await BlogRepository.updateBlog(id, body);
    };

    static  async deleteBlog(id: string) {
        return await BlogRepository.deleteBlogById(id);
    };

    static async deleteAll() {
        return await BlogRepository.deleteAll();
    }
}