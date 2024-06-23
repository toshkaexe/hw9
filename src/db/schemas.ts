import mongoose from "mongoose";
import {BlogDbModel} from "../models/blogs/blog-models";
import {ExtendedLikesInfo, NamesList, PostDbModel} from "../models/posts/posts-models";
import {UserAccountData, UserConfirmationData, UserDbModel} from "../models/users/users-models";
import {ObjectId} from "mongodb";
import {CommentatorInfo, CommentDbModel} from "../models/comments/comment-model";
import {TokenDbModel} from "../models/auth/auth-models";
import {ApiRequestModelDate, DeviceAuthSessionDb} from "../models/devices/devices-models";
import {LikeStatus} from "../models/common";
import {
    HelpLikesInfo,
    LikeCountInfo,
    LikeForPost,

} from "../models/likes/likes-model";
import {type} from "os";
import request from "supertest";

//------------------------------------------
// Define the HelpLikesInfo schema
const HelpLikesInfoSchema
    = new mongoose.Schema<HelpLikesInfo>({
    commentId: {type: String, required: true},
    likes: {type: [String], required: true},
    dislikes: {type: [String], required: true}
});

// Create the Mongoose model for HelpLikesInfo
export const HelpLikesInfoMongoModel =
    mongoose.model('likesForComment', HelpLikesInfoSchema);

//------------------------------------------------------------------------------------

export const likeForPostSchema =
    new mongoose.Schema<LikeForPost>({
        postId: {type: String, required: true},
        blogId: {type: String, required: true},
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
        status:  {type: String, enum: LikeStatus, required: true},
        updated: {type: Date, required: true}
    })

export const LikeToPostModel =
    mongoose.model('likeForPost', likeForPostSchema);
//----------------------------------------------------------------------
const blogSchema
    = new mongoose.Schema<BlogDbModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
});
export const BlogMongoModel =
    mongoose.model('blogs', blogSchema);
//---------------------------------------------------------------------
//--------------POSTS-------------------
// Define the NamesList schema
const NamesListSchema = new mongoose.Schema<NamesList>({
    addedAt: { type: String, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true }
},{_id: false});

// Define the ExtendedLikesInfo schema
const ExtendedLikesInfo =
    new mongoose.Schema<ExtendedLikesInfo>({
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true },
        myStatus: { type: String, required: true },
        newestLikes: [NamesListSchema]
    });

const PostSchema
    = new mongoose.Schema<PostDbModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: ExtendedLikesInfo
});

export const PostMongoModel = mongoose.model('posts', PostSchema);

//--------------------------------------------------------------------
const UserAccountInfo =
    new mongoose.Schema<UserAccountData>({
        login: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        createdAt: {type: String, required: true}
    }, {_id: false});

const UserConfirmationInfo =
    new mongoose.Schema<UserConfirmationData>({
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true},
        passwordRecoveryCode: {type: String, required: true},
    }, {_id: false});

const userSchema =
    new mongoose.Schema<UserDbModel>({
        userData: UserAccountInfo,
        confirmationData: UserConfirmationInfo
    });
export const UserMongoModel = mongoose.model('users', userSchema);


//-----------------------------------------------------------------------------------------------------------------------
const CommentatorSchema =
    new mongoose.Schema<CommentatorInfo>({
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    }, {_id: false});

const LikeInfoSchema =
    new mongoose.Schema<LikeCountInfo>({
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: "String", required: true},
    }, {_id: false});

const CommentSchema =
    new mongoose.Schema<CommentDbModel>({
        postId: {type: String, required: true},
        content: {type: String, required: true},
        commentatorInfo: CommentatorSchema,
        createdAt: {type: String, required: true},
        likesInfo: LikeInfoSchema
    });
export const CommentMongoModel =
    mongoose.model('comments', CommentSchema);


//-----------------------------------------------------------------------------------------------------------------------
const tokenSchema =
    new mongoose.Schema<TokenDbModel>({
        refreshToken: {type: String, required: true}
    });
export const BlacklistTokensMongoModel =
    mongoose.model('tokens', tokenSchema);


const deviceSchema =
    new mongoose.Schema<DeviceAuthSessionDb>({
        userId: {type: String, required: true},
        ip: {type: String, required: true},
        issuedAt: {type: String, required: true},
        deviceId: {type: String, required: true},
        deviceName: {type: String, required: true},
        lastActiveDate: {type: String, required: true}
    });
export const DeviceMongoModel = mongoose.model('devices', deviceSchema);

const apiRequestSchema =
    new mongoose.Schema<ApiRequestModelDate>({
        ip: {type: String, required: true},
        url: {type: String, required: true},
        date: {type: Date, required: true}
    });
export const ApiRequestMongoModel = mongoose.model('apirequests', apiRequestSchema);