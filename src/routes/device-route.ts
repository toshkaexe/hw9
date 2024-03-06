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

export const devicesRoute = Router({})

devicesRoute.get('/',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const sessions =
                await deviceCollection.find().toArray();
            res.json(sessions)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.InternalServerError_500);
        }
    });

devicesRoute.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {

    const userId =
        await  SessionRepository.getUserBySessionID(req.params.id)
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