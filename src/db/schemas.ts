import mongoose from "mongoose";
import {BlogDbModel} from "../models/blogs/blog-models";
import {PostDbModel} from "../models/posts/posts-models";
import {UserDbModel} from "../models/users/users-models";
import {ObjectId} from "mongodb";
import {CommentDbModel} from "../models/comments/comment-model";
import {TokenDbModel} from "../models/auth/auth-models";
import {ApiRequestModelDate, DeviceAuthSessionDb} from "../models/devices/devices-models";


const blogSchema
    = new mongoose.Schema<BlogDbModel>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
});
export const BlogModel =
    mongoose.model('blogs', blogSchema);

const PostSchema
    = new mongoose.Schema<PostDbModel>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
});
export const PostModel = mongoose.model('posts', PostSchema);

const userSchema =
    new mongoose.Schema<UserDbModel>({
        _id: ObjectId,
        accountData: {
            userName: String,
            email: String,
            passwordHash: String,
            createdAt: String,
        },
        emailConfirmation: {
            confirmationCode: String,
            expirationDate: Date,
            isConfirmed: Boolean
        }
    });
export const UserModel = mongoose.model('users', userSchema);

const commentSchema =
    new mongoose.Schema<CommentDbModel>({
        postId: String,
        content: String,
        commentatorInfo: {
            userId: { type: String},
            userLogin: { type: String },
        },
        createdAt: String
    });
export const CommentModel =
    mongoose.model('comments', commentSchema);


const tokenSchema =
    new mongoose.Schema<TokenDbModel>({
        refreshToken: String
    });
export const BlacklistTokensModel =
    mongoose.model('tokens', tokenSchema);


const deviceSchema =
    new mongoose.Schema<DeviceAuthSessionDb>({
        userId: String,
        ip: String,
        issuedAt: String,
        deviceId: String,
        deviceName: String,
        lastActiveDate: String
    });
export const DeviceModel = mongoose.model('devices', deviceSchema);

const apiRequestSchema =
    new mongoose.Schema<ApiRequestModelDate>({
        ip: String,
        url: String,
        date: Date
    });
export const ApiRequestModel = mongoose.model('apirequests', apiRequestSchema);