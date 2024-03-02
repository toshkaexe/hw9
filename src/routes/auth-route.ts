import {Router, Request, Response} from 'express';
import {HTTP_STATUSES} from "../models/common";
import {blacklistTokens, blogsCollection, database, postsCollection} from "../db/db";
import {WithId} from "mongodb";
import {UserDbModel} from "../models/users/users-models";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {inputValidation} from "../validators/input-validation";
import {validateAuthorization} from "../validators/auth-validation";
import {bearerAuth} from "../middleware/auth-middlewares";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {
    authConfirmationValidation,
    authRegistraionResendingEmail,
    registrationValidation
} from "../middleware/user-already-exist";
import {authService} from "../domain/auth-service";
import {verifyTokenInCookie} from "../middleware/verifyTokenInCookie";
import {TokenDbModel} from "../models/auth/auth-models";
import request from "supertest";


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


authRoute.post('/login',
    validateAuthorization(),
    inputValidation,
    async (req: Request, res: Response): Promise<void> => {
        const user = await authService.checkCredentials(req.body)


        if (user) {
            const newAccessToken = await jwtService.generateToken(user._id.toString(), '10s');
            const newRefreshToken = await jwtService.generateToken(user._id.toString(), '20s');

            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});
            res.status(HTTP_STATUSES.OK_200).send({accessToken: newAccessToken})


        } else {
            res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
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

        console.log("req.cookies");
        console.log(req.cookies)
        const refreshToken = req.cookies.refreshToken;
        const decodedRefreshToken = await jwtService.verifyRefreshToken(refreshToken);

        console.log("decodedRefreshToken" + decodedRefreshToken);
        await blacklistTokens.insertOne({accessToken: refreshToken});

        if (decodedRefreshToken) {
            const newAccessToken = await jwtService.generateToken(decodedRefreshToken, '10s');
            const newRefreshToken = await jwtService.generateToken(decodedRefreshToken, '20s');
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});

            res.send({accessToken: newAccessToken});

        } else {
            res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
    });

authRoute.post('/logout',
    verifyTokenInCookie,
    inputValidation,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const decodedRefreshToken = await jwtService.verifyRefreshToken(refreshToken);

        if (decodedRefreshToken) {

            await blacklistTokens.insertOne({accessToken: refreshToken})
            res.sendStatus(204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
    });
