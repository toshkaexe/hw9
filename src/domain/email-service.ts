import {EmailManager} from "../managers/email-manager";


export const emailService = {
    async sendLetter(user: any) {

        await EmailManager.sendEmailRecoveryMessage(user)
    }
}