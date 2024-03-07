import {NextFunction, Response, Request} from "express";
import {apiRequestsCollection} from "../db/db";
import {HTTP_STATUSES} from "../models/common";
import {authService} from "../domain/auth-service";
import {RequestApiRepository} from "../repositories/request-api-repository";


export const restrictNumberQueriesMiddleware = async (req: Request,
                                                      res: Response,
                                                      next: NextFunction) => {
    try {


        const date = new Date();
        const apiReq = {
            ip:  req.ip,
            url: req.originalUrl,
            date: date
        }
        //save in DB
        await authService.saveApiRequest(apiReq);
        const currentDateMinus10Seconds = new Date(Date.now() - 10 * 1000);

        //  console.log(date);
        console.log(currentDateMinus10Seconds);
        const filter = {
            url:  req.originalUrl,
            ip: req.ip,
            date: {$gte: currentDateMinus10Seconds}
        };

        const countDocuments = await apiRequestsCollection.countDocuments(filter);
        console.error("запрос  " + countDocuments);
        if (countDocuments > 5) {
            console.error("У нас больше, чем 5 запросов ");
            res.sendStatus(429);
            return;
        }
        next();
    } catch (error) {
        console.error("An error occurred:", error);
        return res.sendStatus(HTTP_STATUSES.InternalServerError_500);
    }
    return;
};


export const restrictNumberQueriesNOUserMiddleware = async (req: Request,
                                                            res: Response,
                                                            next: NextFunction) => {
    try {
        const currentDateMinus10Seconds = new Date(Date.now() - 10 * 1000);
        const filter = {
            url: req.baseUrl || req.originalUrl,
            ip: req.ip,
            date: {$gte: currentDateMinus10Seconds}
        };
        const countDocuments = await apiRequestsCollection.countDocuments(filter);

        console.log("----------------->")
        console.log(countDocuments);
        const authData = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password
        }
        const login =
            await authService.checkCredentials(authData)

        console.error("У нас меньше, чем 5запросов ");
        console.error(countDocuments);
        console.error("login==");
        console.error(login);

         if (countDocuments < 5 && !login) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return}

        if (countDocuments > 5 && !login) {
            console.error("У нас больше, чем 5 запросов ");
            res.sendStatus(429);
            return;
        }
        next();
    } catch (error) {
        console.error("An error occurred:", error);
        return res.sendStatus(HTTP_STATUSES.InternalServerError_500);
    }
    return;
};

export const restrictionValidator = () => [
    restrictNumberQueriesMiddleware
];


export const addApiRequest = async (req: Request, res: Response, next: NextFunction) => {
    const apiReq = {
        ip: req.ip,
        url: req.baseUrl || req.originalUrl,
        date: new Date()
    }

    const apiRequest = await authService.saveApiRequest(apiReq);
}