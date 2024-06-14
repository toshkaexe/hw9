import {Router, Request, Response} from 'express';
import {HTTP_STATUSES, LikeStatus} from "../models/common";


import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {authMiddleware, bearerAuth, bearerAuthUserAuth} from "../middleware/auth-middlewares";
import {validateComments, validateContents, validateLikeStatus} from "../validators/comments-validation";
import {CommentsService} from "../domain/comments-service";
import {LikesDBModel} from "../models/likes/likes-model";
import {CommentDbModel, commentMapper, CommentViewModel} from "../models/comments/comment-model";
import {CommentMongoModel} from "../db/schemas";
import {jwtService} from "../domain/jwt-service";
import {LikeService} from "../domain/like-service";
import {CommentToLikeRepository} from "../repositories/comment-to-like-repository";
import {sessionMiddleware} from "../middleware/verify-token-in-cookie";
import {WithId} from "mongodb";


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
    bearerAuthUserAuth,
    validateLikeStatus(),
    async (req: Request, res: Response) => {


        const commentId = req.params.commentId  //считали из path
        console.log("commentId=", commentId)
        try {
            // проверка действительно ли у нас есть данный commentId?
            //если коммент существует, то
            const isCommentExists =
                await CommentMongoModel.findById(commentId)
            if (!isCommentExists)
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

            const likeStatus1 = req.body.likeStatus;
            console.log("likeStatus=", likeStatus1)
            console.log("isCommentExists=", isCommentExists)

            const token = req.headers['authorization']

            if (!token) {
                return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            }


            const token1 = token.split(' ')[1]  //bearer fasdfasdfasdf
            console.log("token1: ", token1)
            const userId = await jwtService.userfromToken(token1);
            if (!userId) {
                return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
            }
            console.log("userId=", userId)

            // если юзер неавторизован, то не ставим лайки
            if (!userId)
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

            await LikeService.pushLikeOrDislike(userId, commentId, likeStatus1)

        } catch (error) {
            console.log(error)

        }
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

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
            const foundComment: WithId<CommentDbModel> | null =
                await CommentMongoModel.findById(req.params.commentId)

            console.log("fountComment=", foundComment)
            if (!foundComment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

            foundComment.likesInfo.likesCount = await CommentToLikeRepository.getLikesCount(req.params.commentId)
            foundComment.likesInfo.dislikesCount = await CommentToLikeRepository.getDislikesCount(req.params.commentId)

            console.log("foundComment ", foundComment)

            const token = req.headers['authorization']
            console.log("token = ", token);
            if (!token) {
                // получить коммент для авторизованного юзера
                foundComment.likesInfo.myStatus = await CommentToLikeRepository.getStatusForUnauthorisatedUser(req.params.commentId)
                return res.status(HTTP_STATUSES.OK_200).send(commentMapper(foundComment))

            }

            const tokenWithoutBearer = token.split(' ')[1]  //bearer fasdfasdfasdf
            console.log("tokenWithoutBearer: ", tokenWithoutBearer)
            // получить коммент для авторизованного юзера
            const userId =
                await jwtService.userfromToken(tokenWithoutBearer);
            console.log("userId = ", userId);

            foundComment.likesInfo.myStatus =
                await CommentToLikeRepository.getCurrentUserStatus(req.params.commentId, userId)

            return res.status(HTTP_STATUSES.OK_200).send(commentMapper(foundComment))
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
