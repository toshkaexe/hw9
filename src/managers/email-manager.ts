import {EmailAdapter} from "../adapter/email-adapter";

export class EmailManager {

    static async sendPasswordRecoveryMessage(
        email: string,
        subject: string,
        message: string
    ) {
        await EmailAdapter.sendEmail(email, subject, message)
    }

    static async sendEmailRecoveryMessage(user: any) {
        await EmailAdapter.sendEmail(user.email, user.subject, user.message)
    }
}