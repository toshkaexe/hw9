import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {inputValidation} from "../validators/input-validation";
import {validateAuthorization} from "../validators/auth-validation";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {
    authConfirmationValidation,
    authRegistrationResendingEmail,
    registrationValidation
} from "../middleware/user-already-exist";
import {AuthService} from "../domain/auth-service";
import {
    logoutTokenInCookie,
    verifyTokenInCookie
} from "../middleware/verify-token-in-cookie";
import {restrictNumberQueriesMiddleware} from "../middleware/restrict-number-queries-middleware";
import {bearerAuth} from "../middleware/auth-middlewares";
import {BlacklistService} from "../domain/blacklist-service";
import {SessionRepository} from "../repositories/session-repository";

export const authRoute = Router({})

authRoute.post('/registration-email-resending',
    restrictNumberQueriesMiddleware,
    authRegistrationResendingEmail(),
    async (req: Request, res: Response) => {
        const user = await AuthService.resendCode(req.body.email)
        if (!user) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
)

authRoute.post('/registration-confirmation',
    restrictNumberQueriesMiddleware,
    authConfirmationValidation(),

    async (req: Request, res: Response): Promise<void> => {
        const code = req.body.code;
        const corfirmResult = await AuthService.confirmEmail(code);
        if (!corfirmResult) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
)

authRoute.post('/registration',
    restrictNumberQueriesMiddleware,
    registrationValidation(),
    async (req: Request, res: Response): Promise<void> => {

        const user =
            await AuthService.createUserAccount(req.body)
        if (!user) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
)
authRoute.post('/login',
    restrictNumberQueriesMiddleware,
    validateAuthorization(),
    inputValidation,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const authData = {
                loginOrEmail: req.body.loginOrEmail,
                password: req.body.password
            }
            const response =
                await AuthService.checkCredentials(authData)

            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return
            }
            const token = await AuthService
                .login(
                    req.body.loginOrEmail,
                    req.body.password,
                    req.ip!,
                    req.headers['user-agent'] ?? 'string')

            res.cookie('refreshToken', token?.refreshToken, {httpOnly: true, secure: true})
            res.send({accessToken: token?.accessToken})
            res.status(200)
        } catch (error) {
            console.log({login_error: error})
            res.sendStatus(HTTP_STATUSES.InternalServerError_500) // better bad request
        }
    }
)

authRoute.get('/me',
    bearerAuth,
    async (req: Request, res: Response) => {
        const userId = req.user!.userId
        const currentUser =
            await UsersQueryRepository.findCurrentUser(userId.toString())
        if (!currentUser)
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return res.send({
            email: currentUser.email,
            login: currentUser.login,
            userId: currentUser.id
        })

    })

authRoute.post('/refresh-token',
    verifyTokenInCookie,
    async (req: Request, res: Response) => {
        const oldRefreshToken = req.cookies?.refreshToken;
        const isRefreshTokenInBlackList =
            await BlacklistService.isInBlacklist(oldRefreshToken);
        if (isRefreshTokenInBlackList) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }

        const deviceId = req.user!.deviceId
        const userId = req.user!.userId;

        const updatedRefreshToken
            = await AuthService.updateTokens(
            req.cookies['refreshToken'], userId, deviceId
        );
        if (!updatedRefreshToken) {
            return res.sendStatus(HTTP_STATUSES.InternalServerError_500);
        }

        const {accessToken, refreshToken} = updatedRefreshToken;
        await BlacklistService.addRefreshTokenToBlacklist(oldRefreshToken);

        return res.cookie('refreshToken', refreshToken,
            {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken})
    });


authRoute.post('/logout',
    logoutTokenInCookie,
    async (req: Request, res: Response) => {

        const deviceId = req.user!.deviceId
        const userId = req.user!.userId

        const session =
            await SessionRepository.findSessionByUserIdAndDeviceId(
                userId.toString(), deviceId.toString());
        if (!session) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }

        const isDeletedSession
            = await AuthService.logout(
            deviceId.toString(),
            userId.toString());

        await BlacklistService.addRefreshTokenToBlacklist(req.cookies?.refreshToken);

        if (!isDeletedSession) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
        return res.sendStatus(204)
    });
