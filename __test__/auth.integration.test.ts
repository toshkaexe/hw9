/*
import {UsersRepository} from "../src/repositories/users-repositiory";
import bcrypt from "bcrypt";
import {describe} from "node:test";
import {nodemailerService} from "./nodemailer.service";

export const authService = {

    async registerUser(login: string, pass: string, email: string) {

        const user = await UsersRepository.findByLoginOrEmail(login, email);
        if (user) return null;

        const passwordHash = await bcrypt.hash(pass)

        const newUser: IUser
    }
}


describe('AUTH-INTEGRATION', () => {
    describe('User Registration', () => {


        //     nodemailerService.sendMail = jest.fn();

        nodemailerService.sendMail = jest.fn().mockImplementation((email: string, code: string, template: (code: string) => string) =>
            console.log("email in mock", email))
        return true
    })

        const registrationUserCase = authService.registerUser;


        it('should register user with correct data', async () => {
        })


        it.skip('should not register user twice', async () => {
        })

    })
});
*/
