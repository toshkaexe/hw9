import {Router, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import {authMiddleware, bearerAuth, checkHeader} from "../middleware/auth-middlewares";
import {SessionRepository} from "../repositories/session-repository";
import {restrictionValidator} from "../middleware/restrict-number-queries-middleware";
import {verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {jwtService} from "../domain/jwt-service";
import {UsersQueryRepository} from "../repositories/user-query-repository";

export const deviceRoute = Router({})

deviceRoute.get('/',

    async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;
        try {
            let userId = await jwtService.userfromToken(refreshToken);

            if (!userId) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return;
            }

            let sessions =
                await SessionRepository.getAllSessionByUser(userId);

            if (!sessions) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return;
            }
            res.json(sessions);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.InternalServerError_500);
        }
    });

deviceRoute.delete('/:deviceId',
    checkHeader,
    verifyTokenInCookie, // сессии юзера
    async (req: Request, res: Response) => {

        const isDeviceExist =
            await SessionRepository.isSessionByIdExist(req.params.deviceId);
        console.log("isDeviceExist: ", isDeviceExist)
        if (isDeviceExist == false) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const isDeleted =
            await SessionRepository.
            deleteSessionByDeviceIdAndUserId(req.params.id, req.user!.userId.toString())

        console.log("isDeleted" + isDeleted);
        isDeleted ? res.sendStatus(HTTP_STATUSES.Forbidden_403) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
    })

deviceRoute.delete('/',

    async (req: Request, res: Response) => {
        const isDeleted = await SessionRepository.deleteAllRemoteSessions()
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })