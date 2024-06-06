import {Router, Response, Request} from "express";
import {EmailAdapter} from "../adapter/email-adapter";



export const emailRoute = Router({})

emailRoute.post(
    '/send', async (req: Request, res: Response) => {

        res.send(200);
         await  EmailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message);

    }
)