import request from "supertest";

export const createUser = async (app: any) => {
    const resp = await request(app)
        .post('/users')
        .auth("admin", "123")
        .send({
            login: 'test',
            email: 'test@gmail.com',
            pass: "123"
        })
        .expect(200)
    return resp.body;
}

export const createUsers = async (app: any, count: number) => {
    const users = []

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post('/users')
            .auth("admin", "123")
            .send({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                pass: "123456789"
            })
            .expect(200)
        users.push(resp.body)
    }
}