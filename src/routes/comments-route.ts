import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";

import {CommentOutputModel} from "../models/comments/comment-model";

import {commentsQueryRepository} from "../repositories/comments-query-repository";
import {bearerAuth} from "../middleware/auth-middlewares";
import {validateComments, validateContents} from "../validators/comments-validation";
import {CommentsService} from "../domain/comments-service";


export const commentsRoute = Router({})

commentsRoute.put('/:commentId',
    bearerAuth,
    validateContents(),
    async (req: Request, res: Response) => {

        const commentId = req.params.commentId
        const isUpdated = await CommentsService.UpdateComment(commentId, req.body, req.user!.id)

        if (isUpdated === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        if ( !isUpdated) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    })

commentsRoute.delete('/:commentId',

    bearerAuth,

    async (req: Request, res: Response) => {
        const commentId = req.params.commentId
        const isDeleted = await CommentsService.DeleteCommentById(req.params.commentId, req.user!.id)

        if (isDeleted === false) return res.sendStatus(HTTP_STATUSES.Forbidden_403);
        if ( !isDeleted) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);


    }
)


commentsRoute.get('/:commentId',
    // authMiddleware,
    async (req: Request, res: Response) => {
        const foundComment: CommentOutputModel | null = await commentsQueryRepository.getCommentById(req.params.commentId)
        foundComment ? res.status(HTTP_STATUSES.OK_200).send(foundComment) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
)
