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
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
});
export const BlogModel =
    mongoose.model('blogs', blogSchema);

const PostSchema
    = new mongoose.Schema<PostDbModel>({
    title: { type: String, required: true},
    shortDescription:{ type:  String, required: true},
    content: { type: String, required: true},
    blogId: { type: String, required: true},
    blogName: { type: String, required: true},
    createdAt: { type: String, required: true}
});
export const PostModel = mongoose.model('posts', PostSchema);

const userSchema =
    new mongoose.Schema<UserDbModel>({
        _id: ObjectId,
        accountData: {
            userName: { type: String,required: true},
            email: { type: String,required: true},
            passwordHash: { type: String,required: true},
            createdAt: { type: String,required: true},
        },
        emailConfirmation: {
            confirmationCode: { type: String,required: true},
            expirationDate: { type: Date,required: true},
            isConfirmed: { type: Boolean,required: true}
        }
    });
export const UserModel = mongoose.model('users', userSchema);

const commentSchema =
    new mongoose.Schema<CommentDbModel>({
        postId: {type: String,required: true},
        content: {type: String,required: true},
        commentatorInfo: {
            userId: {type: String, required: true},
            userLogin: {type: String, required: true},
        },
        createdAt: {type: String, required: true}
    });
export const CommentModel =
    mongoose.model('comments', commentSchema);


const tokenSchema =
    new mongoose.Schema<TokenDbModel>({
        refreshToken: { type: String, required: true}
    });
export const BlacklistTokensModel =
    mongoose.model('tokens', tokenSchema);


const deviceSchema =
    new mongoose.Schema<DeviceAuthSessionDb>({
        userId: { type: String,required: true},
        ip: { type: String,required: true},
        issuedAt: { type: String,required: true},
        deviceId: { type: String,required: true},
        deviceName: { type: String,required: true},
        lastActiveDate: { type: String,required: true}
    });
export const DeviceModel = mongoose.model('devices', deviceSchema);

const apiRequestSchema =
    new mongoose.Schema<ApiRequestModelDate>({
        ip: { type: String,required: true},
        url: { type: String,required: true},
        date: { type: Date, required: true}
    });
export const ApiRequestModel = mongoose.model('apirequests', apiRequestSchema);