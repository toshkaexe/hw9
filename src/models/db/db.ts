
import {BlogViewModel} from "../blogs/blog-models";
import {OutputPostModel} from "../posts/posts-models";

export type DBType = {
    blogs: BlogViewModel[],
    posts: OutputPostModel[]
}

