import request from "supertest";
import {app, appConfig} from "../src/settings";
import {testSeeder} from "./test.seeder";
import {runDBMongoose} from "../src/db/db";
import {HTTP_STATUSES} from "../src/models/common";


describe('USERS_TEST', () => {
        //const app = initApp();
        beforeAll(async () => {
            await runDBMongoose()
        })

        let userDto: any

        it('delete all data  STATUS 401', async () => {
            //  userDto = testSeeder.createUserDto();
            await request(app).delete("/testing/all-data")
                //.send()
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        });
        it(' should not create user without authorisation, STATUS 401', async () => {
            //  userDto = testSeeder.createUserDto();
            await request(app).post("/users")
                .send({
                    login: "",
                    password: "12345"
                })
                .expect(401)
        });

        it('create user with the correct data, return status 201', async () => {
            const newUser = await request(app)
                .post("/auth/registration")
                .auth("admin", "qwerty")
                .send({
                    login: "antonantonanton",

                    password: "1234567891",
                    email: "antonq1231@mail.ru"
                })
                .expect(400)

        })

    it('get all users', async ()=>{
        await request(app)
            .get("/users")
            .auth("admin", "qwerty")

            .expect(401)

    })
    }
)