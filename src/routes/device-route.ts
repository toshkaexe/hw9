import {Router, Response, Request} from "express";
import {getPageOptions} from "../types/type";
import {HTTP_STATUSES} from "../models/common";
import {authMiddleware} from "../middleware/auth-middlewares";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {UsersService} from "../domain/users-service";
import {validateUsers} from "../validators/user-validation";
import {inputValidation} from "../validators/input-validation";
import {deviceCollection} from "../db/db";
import {SessionRepository} from "../repositories/session-repository";
import {restrictionValidator} from "../middleware/restrict-number-queries-middleware";
import {verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {jwtService} from "../domain/jwt-service";
import {usersRouter} from "./users-route";

export const devicesRoute = Router({})

devicesRoute.get('/',
    verifyTokenInCookie,
    async (req: Request, res: Response) => {
        console.log(req.cookies.refreshToken);
        const refreshToken = req.cookies?.refreshToken;

        const userId = await jwtService.userfromToken(refreshToken)
        console.log("userID=>: " + userId);
        try {
            const sessions =
                await deviceCollection.find({userId: userId}).toArray();
            res.json(sessions)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.InternalServerError_500);
        }
    });

devicesRoute.delete('/:id',
    // authMiddleware,
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

//delete all sessions
devicesRoute.delete('/',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await SessionRepository.deleteAllRemoteSessions()
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })