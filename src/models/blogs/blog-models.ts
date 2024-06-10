
import {WithId} from "mongodb";

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
    items:	OutputBlogModel[]
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

export type BlogInputModel = {
    /**
     * max length 15
     */
    name: string
    /**
     * max length 500
     */
    description: string
    /**
     * max length 100
     * pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
     */
    websiteUrl: string
}

