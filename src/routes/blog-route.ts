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
import {CreatePostInputModel, OutputPostModel, postMapper} from "../models/posts/posts-models";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {jwtService} from "../domain/jwt-service";


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

        const token = req.headers['authorization']

        if (!token) {


            const posts =
                await BlogsQueryRepository
                    .getPostsToBlog(
                        req.params.blogId,
                        pageNumber,
                        pageSize,
                        sortBy,
                        sortDirection)
            if (!posts) {
                res.sendStatus(404)
                return
            }
            res.status(200).send(posts)
            return
        }


        const token1 = token.split(' ')[1]  //bearer fasdfasdfasdf
        console.log("token1: ", token1)
        const userId = await jwtService.userfromToken(token1);
        console.log("usr=====", userId)
        if (!userId) {


            const posts =
                await BlogsQueryRepository
                    .getPostsToBlog(
                        req.params.blogId,
                        pageNumber,
                        pageSize,
                        sortBy,
                        sortDirection)
            if (!posts) {
                res.sendStatus(404)
                return
            }
            res.status(200).send(posts)
            return
        }
        console.log("userId=", userId)




        const posts =
            await BlogsQueryRepository
                .getPostsToBlog2(
                    req.params.blogId,
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection,
                    userId)
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(posts)
        return

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
 //   authMiddleware,
    authMiddleware,
    blogValidationPostToBlog(),
    async (req: Request, res: Response) => {

        //check if blogId exist
        try {
            const checkBlog
                = await BlogMongoModel.findById(req.params.blogId)
            if (!checkBlog) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("blog does not exists")

        } catch (error) {
            console.log("Error in blog rouete", error)
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