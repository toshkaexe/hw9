import nodemailer from "nodemailer";
import {emailAdapter} from "../adapter/email-adapter";
import {emailManager} from "../managers/email-manager";

export const bussinesService = {

    async doOperation() {
        //save to repo
        // get user from repo

        await emailManager.sendPasswordRecoveryMessage()

    },


    async doOperation2() {
        //save to repo
        // get user from repo

        await emailManager.sendPasswordRecoveryMessage()

    }
}