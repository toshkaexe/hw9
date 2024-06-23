import {CreatePostModel, PostDbModel, UpdatePostModel} from "../models/posts/posts-models";

import {ObjectId, WithId} from "mongodb";

import {BlogRepository} from "./blog-repository";
import {inflate} from "zlib";
import {postMapper} from "../models/posts/posts-models";
import {PostMongoModel} from "../db/schemas";

export class PostsRepository {
    static async savePost(data: PostDbModel) {
        const blog = await BlogRepository.getBlogById(data.blogId);

        console.log("createPost = ", blog)
        if (blog) {

            const result =  new PostMongoModel(data)
            await result.save();
            return result;
        } else {
            return null;
        }
    }


    static async updatePost(postId: string, body: UpdatePostModel) {

        if(!ObjectId.isValid(postId) ) return  false;

        const blog = await BlogRepository.getBlogById(body.blogId);
        if (!blog){return  false;}
        const result =
            await PostMongoModel.updateOne({_id: new ObjectId(postId)},
                {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId,
                        blogName: blog!.name
                    }
                });
        return result.matchedCount === 1;
    }

    static async getAllPosts() {
        const posts = await PostMongoModel.find({});
        return posts.map(postMapper);

    }

    static async getPostById(id: string) {
        try {
            const post =
                await PostMongoModel.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return postMapper(post);

        } catch (err) {
            console.log("error = ", err)
            return null;
        }

    }



    static async deletePost(id: string) {

        if (!ObjectId.isValid(id)) return false;

        try {
            const result =
                await PostMongoModel.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            console.log("error = ", err)
            return false
        }
    }

    static async deleteAll(){
        const result = await PostMongoModel.deleteMany({})
    }
}