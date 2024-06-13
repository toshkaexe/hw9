import {Router, Request, Response} from 'express';

import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {blogValidation, blogValidationPostToBlog, nameValidation} from "../validators/blog-validation";

import {
    HTTP_STATUSES
} from "../models/common";
import {blogMapper, BlogViewModel, Paginator, postToBlogMapper} from "../models/blogs/blog-models";

import {BlogService} from "../domain/blog-service";
import {getPageOptions} from "../types/type";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";

import {PostsService} from "../domain/posts-service";

import {BlogMongoModel} from "../db/schemas";
import {CreatePostInputModel, postMapper} from "../models/posts/posts-models";


export const blogRoute = Router({})

blogRoute.get('/',

    async (req: Request, res: Response): Promise<void> => {
        const {pageNumber, pageSize, sortBy, sortDirection} = getPageOptions(req.query);
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

        const foundBlogs: Paginator<BlogViewModel> = await
            BlogsQueryRepository.findBlogs(pageNumber, pageSize,
                sortBy, sortDirection, searchNameTerm)
        res.send(foundBlogs)
    })


blogRoute.get('/:blogId',

    async (req: Request, res: Response): Promise<void> => {
        const foundBlog: BlogViewModel | null =
            await BlogsQueryRepository.findBlogById(req.params.blogId)
        foundBlog ? res.status(HTTP_STATUSES.OK_200).send(foundBlog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })

blogRoute.get('/:blogId/posts',

    async (req: Request, res: Response): Promise<void> => {
        const foundBlog: BlogViewModel | null =
            await BlogsQueryRepository.findBlogById(req.params.blogId)
        if (!foundBlog) {
            res.sendStatus(404)
            return
        }
        const {pageNumber, pageSize, sortBy, sortDirection} = getPageOptions(req.query);

        const posts = await BlogsQueryRepository.getPostsToBlog(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection)
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(posts)
    })


blogRoute.post('/',
    authMiddleware,
    blogValidation(),
    async (req: Request, res: Response): Promise<void> => {
        const newBlog =
            await BlogService.createBlog(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(blogMapper(newBlog))
    })

// create post for specified blog
blogRoute.post('/:blogId/posts',
    authMiddleware,
    blogValidationPostToBlog(),
    async (req: Request, res: Response) => {

        //check if blogId exist
        try {
            const checkBlog
                = await BlogMongoModel.findById(req.params.blogId)
            if (!checkBlog) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("blog does not exists")

        } catch (error) {
            console.log("Error", error)
            return res.status(HTTP_STATUSES.NOT_FOUND_404).send("blog does not exists")
        }

        const post: CreatePostInputModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.blogId
        }

        const newPost =
            await PostsService.createPost(post)
        if (!newPost) return res.sendStatus(404);

        return res.status(HTTP_STATUSES.CREATED_201).send(postToBlogMapper(newPost))
    }
)

blogRoute.put('/:blogId',
    authMiddleware,
    blogValidation(),
    async (req: Request, res: Response): Promise<void> => {
        const blogId = req.params.blogId
        const isUpdated = await BlogService.updateBlog(blogId, req.body)
        isUpdated ? res.status(HTTP_STATUSES.NO_CONTENT_204)
                .send(BlogsQueryRepository.findBlogById(blogId)) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

blogRoute.delete('/:blogId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await BlogService.deleteBlog(req.params.blogId)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })