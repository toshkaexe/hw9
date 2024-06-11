import {Router, Request, Response} from 'express';
import {HTTP_STATUSES, LikeStatus} from "../models/common";


import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {validateComments, validateContents, validateLikeStatus} from "../validators/comments-validation";
import {CommentsService} from "../domain/comments-service";
import {LikesDBModel} from "../models/likes/likes-model";
import {commentMapper, CommentViewModel} from "../models/comments/comment-model";
import {CommentMongoModel} from "../db/schemas";
import {jwtService} from "../domain/jwt-service";
import {LikeService} from "../domain/like-service";


export const commentsRoute = Router({})

commentsRoute.put('/:commentId',
    bearerAuth,
    validateContents(),
    async (req: Request, res: Response) => {

        const commentId = req.params.commentId
        const isUpdated = await CommentsService.UpdateComment(commentId, req.body, req.user!.userId.toString())

        if (isUpdated === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        if (!isUpdated) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    })

//set like status for a comment
commentsRoute.put('/:commentId/like-status',
    //bearerAuth,
    authMiddleware,
    validateLikeStatus(),
    async (req: Request, res: Response) => {
        //достаем commentId
        const commentId = req.params.commentId  //считали из path
        console.log("commentId=", commentId)
        const likeStatus = req.body.likeStatus;

        console.log("likeStatus=", likeStatus)


        // проверка действительно ли у нас есть данный commentId?
        try {
            const isCommentExists =
                await CommentMongoModel.findById(commentId)
            if (!isCommentExists)
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

            //если коммент существует, то
            console.log("isCommentExists=", isCommentExists)
            // из кук достаем userId
            const refreshToken = req.cookies?.refreshToken;
            const userId = await jwtService.userfromToken(refreshToken);
            console.log("userId=", userId)

            // если юзер неавторизован, то не ставим лайки
            if (!userId)
                return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);

                // заполняем массив с лайками от юзеров
            //(likeStatus == LikeStatus.LIKE) {
            console.log("in the if")
            await LikeService.pushLikeOrDislike(userId, commentId, likeStatus)


        } catch (error) {


        }

        // commentId
        //
        // const info: LikesDBModel = {
        //     createAt: new Date(),
        //     status: req.body.content,
        //     authorId: req.params.toString(),
        //     commentId: commentId
        // }
        //
        // const saveLike = await CommentsService.saveLike(info);
        // // const isUpdated = await CommentsService.UpdateComment(commentId, req.body, req.user!.userId.toString())
        //
        // // if (isUpdated === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        // // if (!isUpdated) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.sendStatus(HTTP_STATUSES.OK_200);

    })


commentsRoute.delete('/:commentId',

    bearerAuth,

    async (req: Request, res: Response) => {
        const commentId = req.params.commentId
        const isDeleted = await
            CommentsService.DeleteCommentById(req.params.commentId, req.user!.userId.toString())

        if (isDeleted === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        if (!isDeleted) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


    }
)


commentsRoute.get('/:commentId',
    async (req: Request, res: Response) => {
        try {
            const foundComment: CommentViewModel | null = await CommentMongoModel.findById(req.params.commentId)
            return res.status(HTTP_STATUSES.OK_200).send(foundComment)
        } catch (error) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

    }
)


commentsRoute.get('/',
    async (req: Request, res: Response) => {
        try {
            const foundComment: CommentViewModel | null = await CommentMongoModel.findById(req.params.commentId)
            return res.status(HTTP_STATUSES.OK_200).send(foundComment)
        } catch (error) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

    }
)
