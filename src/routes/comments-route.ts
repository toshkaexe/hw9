import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";


import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {bearerAuth} from "../middleware/auth-middlewares";
import {validateComments, validateContents, validateLikeStatus} from "../validators/comments-validation";
import {CommentsService} from "../domain/comments-service";
import {LikesDBModel} from "../models/likes/likes-model";
import {commentMapper, CommentOutputModel} from "../models/comments/comment-model";
import {CommentMongoModel} from "../db/schemas";


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
    bearerAuth,
    validateLikeStatus(),
    async (req: Request, res: Response) => {

        const commentId = req.params.commentId  //считали из path

        const info: LikesDBModel = {
            createAt: new Date(),
            status: req.body.content,
            authorId: req.params.toString(),
            commentId: commentId
        }

        const saveLike = await CommentsService.saveLike(info);
        // const isUpdated = await CommentsService.UpdateComment(commentId, req.body, req.user!.userId.toString())

        // if (isUpdated === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        // if (!isUpdated) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
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
            const foundComment: CommentOutputModel | null = await CommentMongoModel.findById(req.params.commentId)
            return res.status(HTTP_STATUSES.OK_200).send(foundComment)
        } catch (error) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

    }
)
