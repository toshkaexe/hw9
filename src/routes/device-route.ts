import {Router, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import {authMiddleware} from "../middleware/auth-middlewares";
import {SessionRepository} from "../repositories/session-repository";
import {restrictionValidator} from "../middleware/restrict-number-queries-middleware";
import {verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {jwtService} from "../domain/jwt-service";
export const deviceRoute = Router({})

deviceRoute.get('/',
    verifyTokenInCookie,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;
        try {
            let sessions =
                await SessionRepository.getAllSessionByUser(await jwtService.userfromToken(refreshToken));
            res.json(sessions);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.InternalServerError_500);
        }
    });

deviceRoute.delete('/:id',
    restrictionValidator,
    async (req: Request, res: Response) => {
        const userId =
            await SessionRepository.getUserBySessionID(req.params.id)
        if (!userId) return null;
        const isDeleted =
            await SessionRepository.deleteRemoteSession(req.params.id, userId.toString())
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
    })

deviceRoute.delete('/',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await SessionRepository.deleteAllRemoteSessions()
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })