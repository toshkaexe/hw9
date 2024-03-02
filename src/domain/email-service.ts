import {emailManager} from "../managers/email-manager";

export const emailService = {
    async sendLetter(user: any) {

        await emailManager.sendEmailRecoveryMessage(user)
    }
}