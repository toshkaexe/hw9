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
import {authService} from "../domain/auth-service";
import {logoutMiddleware, verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {
    restrictNumberQueriesMiddleware,
    restrictNumberQueriesNOUserMiddleware
} from "../middleware/restrict-number-queries-middleware";
import {apiRequestsCollection} from "../db/db";


export const authRoute = Router({})


authRoute.post('/registration-email-resending',
    restrictNumberQueriesMiddleware,
    authRegistrationResendingEmail(),
    async (req: Request, res: Response) => {
        const user = await authService.resendCode(req.body.email)
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
        const corfirmResult = await authService.confirmEmail(code);
        if (!corfirmResult) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
)


/*//test post ApiRequests
authRoute.post('/apirequest',
    // validateAuthorization(),
    inputValidation,
    async (req: Request, res: Response): Promise<void> => {

        const apiReq = {
            ip: req.ip,
            url: req.baseUrl || req.originalUrl,
            date: new Date()
        }

        const apiRequest = await authService.saveApiRequest(apiReq);

        apiRequest ? res.sendStatus(HTTP_STATUSES.OK_200) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })*/
async function sendApiRequest(req: Request, res: Response) {
    const apiReq = {
        ip: req.ip,
        url: req.baseUrl || req.originalUrl,
        date: new Date()
    }
    await authService.saveApiRequest(apiReq);
}

authRoute.post('/registration',
    restrictNumberQueriesMiddleware,
    registrationValidation(),
    async (req: Request, res: Response): Promise<void> => {

        const user = await authService.createUserAccount(req.body)
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
                await authService.checkCredentials(authData)

            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return
            }
            const token = await authService
                .login(
                    req.body.loginOrEmail,
                    req.body.password,
                    req.ip!,
                    req.headers['user-agent'] ?? 'string')
            console.log(req.ip, 'req.ip');
            res.cookie('refreshToken', token?.refreshToken, {httpOnly: true, secure: true})
            res.send({accessToken: token?.accessToken})
            res.status(200)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.InternalServerError_500)
        }
    }
)

authRoute.get('/me',
    //   bearerAuth,
    async (req: Request, res: Response) => {
        const userId = req.user!.id
        const currentUser = await UsersQueryRepository.findCurrentUser(userId)
        console.log(currentUser)

        if (!currentUser)
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        res.send({
            email: currentUser.email,
            login: currentUser.login,
            userId: currentUser.id
        })
        return
    })

authRoute.post('/refresh-token',
    verifyTokenInCookie,
    async (req: Request, res: Response) => {
        const deviceId = req.user!.deviceId as string
        const userId = req.user!._id

        const tokens = await authService.refreshTokens(
            req.cookies['refreshToken'], userId, deviceId);

        if (!tokens) {
            res.sendStatus(500);
            return
        }

        const {accessToken, refreshToken} = tokens;

        return res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken})
    });


//restrictionValidator(),
// validateAuthorization(),
//   inputValidation,

authRoute.post('/logout',
    logoutMiddleware(),
    //verifyTokenInCookie,
    //  inputValidation,
    async (req: Request, res: Response) => {
        const deviceId = req.user!.deviceId as string
        const userId = req.user
        const isLogout = await authService.logout(deviceId, userId);
        if (!isLogout) return res.sendStatus(401)
        return res.sendStatus(204)
    });
