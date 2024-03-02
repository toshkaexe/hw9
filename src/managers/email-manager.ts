import {emailAdapter} from "../adapter/email-adapter";

export const emailManager = {

    async sendPasswordRecoveryMessage() {
        await emailAdapter.sendEmail("zurix@mail.ru", "password recovery", "<div>message</div>")
    },
    async sendEmailRecoveryMessage(user: any) {
        await emailAdapter.sendEmail(user.email, user.subject, user.message)
    }
}