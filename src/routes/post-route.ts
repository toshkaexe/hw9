import {Router, Request, Response} from 'express';
import {BlogRepository} from "../repositories/blog-repository";
import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {blogValidation, nameValidation} from "../validators/blog-validation";
import {PostsRepository} from "../repositories/posts-repository";

import {
    HTTP_STATUSES
} from "../models/common";

import {CreatePostModel, OutputPostModel, postMapper} from "../models/posts/posts-models";
import {postValidation} from "../validators/post-validation";

import {getPageOptions} from "../types/type";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {BlogViewModel} from "../models/blogs/blog-models";
import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {validateComments, validateContents} from "../validators/comments-validation";
import {validateMongoId} from "../validators/validate-mongodb";
import {PostMongoModel, UserMongoModel} from "../db/schemas";

import {jwtService} from "../domain/jwt-service";
import {commentMapper} from "../models/comments/comment-model";

export const postRoute = Router({})

//get
postRoute.get('/', async (req: Request, res: Response) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = getPageOptions(req.query);

    const foundPosts =
        await PostsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection)
    res.send(foundPosts)
})

postRoute.post('/',
    authMiddleware,
    postValidation(),
    async (req: Request, res: Response) => {
        console.log("req.boby = ", req.body)
        const newPostId =
            await PostsService.createPost(req.body)
        if (!newPostId) return res.sendStatus(404);
        console.log("newPostId", newPostId)


        //   const newPost = await PostsQueryRepository.findPostById(newPostId)

        console.log("PostsQueryRepository", PostsQueryRepository)
        /*   newPost ? res.status(HTTP_STATUSES.CREATED_201).send(newPost) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
     */
        res.status(HTTP_STATUSES.CREATED_201).send(postMapper(newPostId))

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
        const blogExist: BlogViewModel | null = await BlogsQueryRepository.findBlogById(blogId)
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

        const {pageNumber, pageSize, sortBy, sortDirection} = getPageOptions(req.query);
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
      validateContents(),
    async (req: Request, res: Response) => {

        //достем парам postId
        const postId = req.params.postId
        //берем контент
        const content = req.body.content

        // проверка действительно ли у нас есть данный postId?
        try {
            const checkedPost =
                await PostMongoModel.findById(postId)
            if (!checkedPost)
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            console.log("Error in postId, does not exist")
            //    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }


        const token= req.headers['authorization']
        console.log("auth=");
        console.log(token);

        if (!token) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
        const token1 = token.split(' ')[1]  //bearer fasdfasdfasdf

        //const userId = await jwtService.getUserIdAndDeviceId(token1)

        console.log("token1: ", token1)
        try {
            let userId = await jwtService.userfromToken(token1);

            if (!userId) {
              return  res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
            }
            console.log("userId = ", userId)
            const user = await UserMongoModel.findById(userId)

            console.log("user = ", user)
            //console.log("email = ", user

            const newComment =
                await CommentsService.CreateComment(
                    {userId: userId, userLogin: user!.userData.login}, postId, content)
            return res.status(HTTP_STATUSES.CREATED_201).send(commentMapper(newComment))
        } catch (error) {
            console.log("error,", error)
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        }
    }
)