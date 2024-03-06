import {NextFunction, Response, Request} from "express";
import {apiRequestsCollection} from "../db/db";
import {HTTP_STATUSES} from "../models/common";
import {inputValidation} from "../validators/input-validation";
export const countDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDateMinus10Seconds = new Date(Date.now() - 10 * 1000);

        const filter = {
            url: req.baseUrl || req.originalUrl,
            ip: req.ip,
            date: { $gte: currentDateMinus10Seconds }
        };
        const countDocuments = await apiRequestsCollection.countDocuments(filter);
        if (countDocuments === 0) {
            return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        }
        next();
    } catch (error) {
        console.error("An error occurred:", error);
        return res.sendStatus(HTTP_STATUSES.InternalServerError_500);
    }
    return;
};

export const countDocValidation = ()=>[
    countDocuments,
    inputValidation
];