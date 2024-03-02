import nodemailer from "nodemailer";

export const emailAdapter = {

    async sendEmail(email: string, subject: string, message: string) {

        let transporter = nodemailer.createTransport({
            service: 'Mail.ru',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PWS
            }
        });

        let info =
            await transporter.sendMail({
                from: "Anton <antonanton2025@internet.ru>",
                to: email,
                subject: subject,
                html: message
            })

        console.log(info);
        return info;
    }

}