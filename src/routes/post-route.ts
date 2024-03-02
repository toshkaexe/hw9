import {Router, Request, Response} from 'express';
import {BlogRepository} from "../repositories/blog-repository";
import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {blogValidation, nameValidation} from "../validators/blog-validation";
import {PostsRepository} from "../repositories/posts-repository";

import {
  HTTP_STATUSES
} from "../models/common";
import {randomUUID} from "crypto";
import {blogRoute} from "./blog-route";
import {CreatePostModel, OutputPostModel} from "../models/posts/posts-models";
import {postValidation} from "../validators/post-validation";
import {db} from "../db/db";
import {getPageOptions} from "../types/type";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {OutputBlogModel} from "../models/blogs/blog-models";
import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {CommentOutputModel} from "../models/comments/comment-model";
import {validateComments, validateContents} from "../validators/comments-validation";
import {validateMongoId} from "../validators/validate-mongodb";

export const postRoute = Router({})

//get
postRoute.get('/', async (req: Request, res: Response) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);

    const foundPosts =
        await PostsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection)
    res.send(foundPosts)
})

postRoute.post('/',
    authMiddleware,
    postValidation(),
    async (req: Request, res: Response) => {
        const newPostId = await PostsService.createPost(req.body)
        if (!newPostId) return res.sendStatus(404);

        const newPost = await PostsQueryRepository.findPostById(newPostId)
        newPost ? res.status(HTTP_STATUSES.CREATED_201).send(newPost) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    })

postRoute.get('/:postId', async (req: Request, res: Response) => {
    const foundPost: OutputPostModel | null =
        await PostsQueryRepository.findPostById(req.params.postId)
    foundPost ? res.status(HTTP_STATUSES.OK_200).send(foundPost) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
//put
postRoute.put('/:postId',
    authMiddleware,
    postValidation(),
    //inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const blogId = req.body.blogId
        const postId = req.params.postId
        const blogExist: OutputBlogModel | null = await BlogsQueryRepository.findBlogById(blogId)
        const postExist = await PostsQueryRepository.findPostById(postId)

        if (!blogExist) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send("error blog")
            return
        }
        if (!postExist) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send("error post")
            return
        }
        await PostsService.updatePost(postId, req.body)
        res.status(HTTP_STATUSES.NO_CONTENT_204).send('No content')
    })

//+
postRoute.delete('/:postId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await PostsService.deletePost(req.params.postId)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })


postRoute.get('/:postId/comments',
    validateMongoId(),
    async (req: Request, res: Response): Promise<void> => {
        const postId = req.params.postId
        const foundPost: OutputPostModel | null = await PostsQueryRepository.findPostById(postId)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);
        const comments =
            await commentsQueryRepository.getCommentsForPost(req.params.postId, pageNumber, pageSize, sortBy, sortDirection)
        if (!comments) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(comments)
    })

// добавляем новый коммент
postRoute.post('/:postId/comments',
    bearerAuth,

    validateContents(),
    async (req: Request, res: Response) => {
        const {id: userId, login: userLogin} = req.user!
        const postId = req.params.postId
        const content = req.body.content

        console.log(postId, 'its post id')

        const newComment: CommentOutputModel | null =
            await CommentsService.CreateComment({userId, userLogin}, postId, content)
        if (!newComment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.status(HTTP_STATUSES.CREATED_201).send(newComment)
    }
)