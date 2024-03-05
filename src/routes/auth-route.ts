import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";

import {inputValidation} from "../validators/input-validation";
import {validateAuthorization} from "../validators/auth-validation";
import {authMiddleware, bearerAuth} from "../middleware/auth-middlewares";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {
    authConfirmationValidation,
    authRegistraionResendingEmail,
    registrationValidation
} from "../middleware/user-already-exist";
import {authService} from "../domain/auth-service";
import {verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {UsersService} from "../domain/users-service";
import {devicesRoute} from "./device-route";
import {RequestApiRepository} from "../repositories/request-api-repository";


export const authRoute = Router({})

authRoute.post('/registration',
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

authRoute.post('/registration-email-resending',
    authRegistraionResendingEmail(),
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


//test post ApiRequests
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

    })

authRoute.delete('/apirequest',

    async (req: Request, res: Response) => {
        const isDeleted = await RequestApiRepository.deleteAll()
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })


authRoute.post('/login',
    validateAuthorization(),
    inputValidation,
    async (req: Request, res: Response): Promise<void> => {

        const apiReq = {
            ip: req.ip,
            url: req.baseUrl || req.originalUrl,
            date: new Date()
        }

//    const apiRequest = await authService.saveApiRequest(apiReq);


        //  const tokens = await authService.login(req.body.loginOrEmail, req.body.password,
        //    req.ip!, req.headers['user-agent']) //req.header['user-agent'])

        /* if (user) {
             const newAccessToken = await jwtService.generateToken(user, '10s');
             const newRefreshToken = await jwtService.generateToken(user._id.toString(), '20s');

             res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});
             res.status(HTTP_STATUSES.OK_200).send({accessToken: newAccessToken})


         } else {
             res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
         }*/
    }
)

authRoute.get('/me',
    bearerAuth,
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

authRoute.post('/logout',
    verifyTokenInCookie,
    inputValidation,
    async (req: Request, res: Response) => {
        const deviceId = req.user!.deviceId as string
        const userId = req.user
        const isLogout = await authService.logout(deviceId, userId);
        if (!isLogout) return res.sendStatus(401)
        return res.sendStatus(204)
    });
