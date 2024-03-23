import {Router, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import {checkRefreshTokenFromHeader} from "../middleware/auth-middlewares";
import {SessionRepository} from "../repositories/session-repository";
import {jwtService} from "../domain/jwt-service";


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
    checkRefreshTokenFromHeader,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;
        const result =
            await jwtService.getUserIdAndDeviceId(refreshToken);
        console.log("result", result);
        const userId = result!.userId.toString();

        const session =
            await SessionRepository.getSessionByIdExist(req.params.deviceId);

        console.log("isDeviceExist: ", session)
        if (session == false) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (session.userId !== userId) {
            return res.sendStatus(403);
        }

        const isDeleted =
            await SessionRepository.deleteSessionByDeviceIdAndUserId(req.params.deviceId,
                userId.toString())

        console.log("isDeleted" + isDeleted);
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    })

deviceRoute.delete('/',
    checkRefreshTokenFromHeader,
    async (req: Request, res: Response) => {
        const isDeleted = await SessionRepository.deleteAllRemoteSessions()
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })