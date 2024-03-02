import {Router, Response, Request} from "express";
import {emailAdapter} from "../adapter/email-adapter";
import {bussinesService} from "../domain/bussines-service";


export const emailRoute = Router({})

emailRoute.post(
    '/send', async (req: Request, res: Response) => {

        await bussinesService.doOperation()
        res.send(200);
        // await  emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message);

    }
)