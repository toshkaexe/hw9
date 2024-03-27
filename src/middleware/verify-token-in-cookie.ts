import {NextFunction, Response, Request} from "express";
import {HTTP_STATUSES} from "../models/common";
import {jwtService} from "../domain/jwt-service";
import {SessionRepository} from "../repositories/session-repository";
import {BlacklistService} from "../domain/blacklist-service";


export const verifyTokenInCookie = async (req: Request,
                                          res: Response,
                                          next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    const result = await jwtService.getUserIdAndDeviceId(refreshToken);
    if (!result) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    if (!result?.userId) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    try {
        const session =
            await SessionRepository.findSessionByUserIdAndDeviceId(result!.userId.toString(),
                result!.deviceId)

        if (!session) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);

        req.user = {userId: result!.userId, deviceId: result!.deviceId}
        next();
        return
    } catch (error) {
        console.log("refresh error: ", error)
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
};


export const logoutTokenInCookie = async (req: Request,
                                          res: Response,
                                          next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    const isRefreshTokenInBlackList =
        await BlacklistService.isInBlacklist(refreshToken);

    if (isRefreshTokenInBlackList ) {
        return res.sendStatus(401)
    }

    if (!refreshToken) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    const result =
        await jwtService.getUserIdAndDeviceId(refreshToken);
    if (!result) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    req.user = {userId: result!.userId, deviceId: result!.deviceId}
    next();
    return

};