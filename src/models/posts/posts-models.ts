import {WithId} from "mongodb";

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: NamesList[]
}

export type NamesList = {
    addedAt: string
    userId: string,
    login: string
}

export type PostDbModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: NamesList[]
    }
}
export type CreatePostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type CreatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}

export type UpdatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type OutputPostModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}


export type Paginator<OutputPostModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutputPostModel[]
}
export const postMapper =
    (post: WithId<CreatePostModel>):
        OutputPostModel => {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: post.extendedLikesInfo.myStatus,
                newestLikes: []
            }
        }
    }

