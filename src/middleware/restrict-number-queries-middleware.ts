import {NextFunction, Response, Request} from "express";
import {apiRequestsCollection} from "../db/db";
import {HTTP_STATUSES} from "../models/common";
import {AuthService} from "../domain/auth-service";

export const restrictNumberQueriesMiddleware = async (req: Request,
                                                      res: Response,
                                                      next: NextFunction) => {
    try {
        const date = new Date();
        const apiReq = {ip: req.ip, url: req.originalUrl, date: date}
        //save in DB
        await AuthService.saveApiRequest(apiReq);
        const currentDateMinus10Seconds = new Date(Date.now() - 10 * 1000);
        const filter = {
            url: req.originalUrl,
            ip: req.ip,
            date: {$gte: currentDateMinus10Seconds}
        };

        const countDocuments = await apiRequestsCollection.countDocuments(filter);

        if (countDocuments > 5) {
            console.error("У нас больше, чем 5 запросов!");
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