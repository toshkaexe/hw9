import { postsCollection} from "../db/db"

import {CreatePostModel, UpdatePostModel} from "../models/posts/posts-models";

import {ObjectId, WithId} from "mongodb";

import {BlogRepository} from "./blog-repository";
import {inflate} from "zlib";
import {postMapper} from "../models/posts/posts-models";

export class PostsRepository {
    static async createPost(data: CreatePostModel) {
        const createdAt = new Date();
        const blog = await BlogRepository.getBlogById(data.blogId);

        if (blog) {
            const newPost = {
                ...data,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
            const result = await postsCollection.insertOne(newPost);
            return result.insertedId.toString();
        } else {
            return null;
        }
    }


    static async updatePost(postId: string, body: UpdatePostModel) {

        if(!ObjectId.isValid(postId) ) return  false;

        const blog = await BlogRepository.getBlogById(body.blogId);
        if (!blog){return  false;}
        const result =
            await postsCollection.updateOne({_id: new ObjectId(postId)},
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
        const posts = await postsCollection.find({}).toArray();
        return posts.map(postMapper);

    }

    static async getPostById(id: string) {
        try {
            const post =
                await postsCollection.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return postMapper(post);

        } catch (err) {
            return null;
        }

    }



    static async deletePost(id: string) {

        if (!ObjectId.isValid(id)) return false;

        try {
            const result =
                await postsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }
    }

    static async deleteAll(){
        const result = await postsCollection.deleteMany({})
    }
}