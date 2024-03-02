
import {OutputBlogModel} from "../blogs/blog-models";
import {OutputPostModel} from "../posts/posts-models";

export type DBType = {
    blogs: OutputBlogModel[],
    posts: OutputPostModel[]
}

