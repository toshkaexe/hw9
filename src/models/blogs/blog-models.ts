
import {WithId} from "mongodb";

export type BlogDbModel = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type CreateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string
    createdAt: string,
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
export type OutputBlogModel = {
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

export const blogMapper = (blog: WithId<CreateBlogModel>): OutputBlogModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}