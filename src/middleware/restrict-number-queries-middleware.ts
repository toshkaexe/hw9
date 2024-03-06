import {NextFunction, Response, Request} from "express";
import {apiRequestsCollection} from "../db/db";
import {HTTP_STATUSES} from "../models/common";
import {authService} from "../domain/auth-service";


export const restrictNumberQueriesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDateMinus10Seconds = new Date(Date.now() - 10 * 1000);
        const filter = {
            url: req.baseUrl || req.originalUrl,
            ip: req.ip,
            date: {$gte: currentDateMinus10Seconds}
        };
        const countDocuments = await apiRequestsCollection.countDocuments(filter);
        console.error("У нас меньше, чем 5запросов ");

        console.error(countDocuments);

        if (countDocuments > 5) {
            console.error("У нас больше, чем 5 запросов ");
            return res.sendStatus(429);
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