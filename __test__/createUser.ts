/*

import {usersRouter} from "../src/routes/users-route";
import request from "supertest";


import dotenv from 'dotenv';

dotenv.config()


export const createUser = async (app: any) => {
    const resp = await request(app).post("/users")
        .auth( process.env.AUTH_PASSWORD, process.env.AUTH_PASSWORD)
        .send({
            login: 'test',
            email: 'test@gmail.com',
            pass: '123'
        }).expect(200)
}


export const createUsers = async (app: any, count: number) => {
    const users = [];
    for (let i = 0; i <= count; i++) {
        const resp = await request(app).post(usersRouter).auth(process.env.AUTH_LOGIN, process.env.AUTH_PASSWORD)
            .send({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                pass: '123'
            }).expect(200)
        users.push(resp.body)
    }
}



*/
