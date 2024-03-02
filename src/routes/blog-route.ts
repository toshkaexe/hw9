import {Router, Request, Response} from 'express';
import {BlogRepository} from "../repositories/blog-repository";
import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {blogValidation, blogValidationPostToBlog, nameValidation} from "../validators/blog-validation";
import {randomUUID} from "crypto";
import {db} from '../db/db'
import {HTTP_STATUSES
} from "../models/common";
import {CreateBlogModel, OutputBlogModel, Paginator} from "../models/blogs/blog-models";
import {ObjectId} from "mongodb";
import {BlogService} from "../domain/blog-service";
import {getPageOptions} from "../types/type";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {postValidation} from "../validators/post-validation";
import {PostsService} from "../domain/posts-service";
import {PostsQueryRepository} from "../repositories/posts-query-repository";


export const blogRoute = Router({})

blogRoute.get('/',

    async (req: Request, res: Response): Promise<void> => {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

        const foundBlogs: Paginator<OutputBlogModel> = await
            BlogsQueryRepository.findBlogs(pageNumber, pageSize,
            sortBy, sortDirection, searchNameTerm)
        res.send(foundBlogs)
    })



blogRoute.get('/:blogId',

    async (req: Request, res: Response): Promise<void> => {
        const foundBlog: OutputBlogModel | null = await BlogsQueryRepository.findBlogById(req.params.blogId)
        foundBlog ? res.status(HTTP_STATUSES.OK_200).send(foundBlog) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })

blogRoute.get('/:blogId/posts',

    async (req: Request, res: Response): Promise<void> => {
        const foundBlog: OutputBlogModel | null =
            await BlogsQueryRepository.findBlogById(req.params.blogId)
        if (!foundBlog) {
            res.sendStatus(404)
            return
        }
        const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);

        const posts = await BlogsQueryRepository.getPostsToBlog(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection)
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(posts)
    })


blogRoute.post('/',
    authMiddleware,
  //  bearerAuth,
    blogValidation(),
    async (req: Request, res: Response): Promise<void> => {
        const newBlog = await BlogService.createBlog(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    })

// create post for specified blog
blogRoute.post('/:blogId/posts',
    authMiddleware,
    blogValidationPostToBlog(),
    async (req: Request, res: Response) => {
        const newPostId = await PostsService.createPost({blogId: req.params.blogId, ...req.body})
        if (!newPostId) return res.sendStatus(404);

        const newPost = await PostsQueryRepository.findPostById(newPostId)
        if (!newPost) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
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