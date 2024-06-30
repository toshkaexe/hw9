import {WithId} from "mongodb";
import {CreatePostModel, ExtendedLikesInfo} from "../posts/posts-models";

export type BlogDbModel = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}


export type CreateBlogInputModel = {
    name: string,
    description: string,
    websiteUrl: string
}


export type UpdateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string
}
export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}


export type Paginator<OutputBlogModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutputBlogModel[]
}

export type CreateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string
    createdAt: string,
    isMembership: boolean
}

export const blogMapper = (blog: WithId<CreateBlogModel>):
    BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}


export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}
export const postToBlogMapper = (blog: WithId<CreatePostModel>): PostViewModel=> {
    return {
        id: blog._id.toString(),
        title: blog.title,
        shortDescription: blog.shortDescription,
        content: blog.content,
        blogId: blog.blogId,
        blogName: blog.blogName,
        createdAt: blog.createdAt,
        extendedLikesInfo: {
            likesCount: blog.extendedLikesInfo.likesCount,
            dislikesCount: blog.extendedLikesInfo.dislikesCount,
            myStatus: blog.extendedLikesInfo.myStatus,
            newestLikes: blog.extendedLikesInfo.newestLikes.map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            }))
        }
    }
}
