import request from "supertest";
import {app, appConfig} from "../src/settings";
import {testSeeder} from "./test.seeder";
import {runDBMongoose} from "../src/db/db";
import {HTTP_STATUSES} from "../src/models/common";
import jwt from "jsonwebtoken";


describe('USERS_TEST', () => {
        beforeAll(async () => {
            await runDBMongoose()
            let userDto: any
        })
        let token01;
        let token02;
        let token03;
        let token04;
        let token05;

        let postId1;
        let postId2;
        let postId3;
        let postId4;
        let postId5;


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


        it('create user1', async () => {
            const newUser = await request(app)
                .post("/auth/registration")
                .send({
                    login: "user1",
                    password: "1234567891",
                    email: "user123@mail.ru"
                })
                .expect(400)
        })
        it('create user2', async () => {
            const newUser = await request(app)
                .post("/auth/registration")
                .send({
                    login: "user2",
                    password: "1234567891",
                    email: "user2@mail.ru"
                })
                .expect(400)
        })

        it('create user3', async () => {
            const newUser = await request(app)
                .post("/auth/registration")
                .send({
                    login: "user3",
                    password: "1234567891",
                    email: "user3@mail.ru"
                })
                .expect(400)
        })

        it('create user4', async () => {
            const newUser = await request(app)
                .post("/auth/registration")
                .send({
                    login: "user4",
                    password: "1234567891",
                    email: "user4@mail.ru"
                })
                .expect(400)
        })


        it('login with user4', async () => {

        })

        it('get all users', async () => {
            const users = await request(app)
                .get("/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .expect(200)
            console.log("***-->", users.body.items)
            expect(users.body.items).toHaveLength(4)
        })


        // test
        it('get all posts', async () => {
            await request(app)
                .get("/posts")
                //    .auth("admin", "qwerty")
                //  .set("Authorization", "Basic "+ btoa("admin:qwerty"))
                .expect(200)
        })


        it('create 6 to posts to blogId', async () => {

            const user01 = await request(app)
                .post("/auth/login")
                .send({
                    loginOrEmail: "user4",
                    password: "1234567891",
                }).expect(200)

            const user02 = await request(app)
                .post("/auth/login")
                .send({
                    loginOrEmail: "user4",
                    password: "1234567891",
                }).expect(200)

            const user03 = await request(app)
                .post("/auth/login")
                .send({
                    loginOrEmail: "user4",
                    password: "1234567891",
                }).expect(200)

            const user04 = await request(app)
                .post("/auth/login")
                .send({
                    loginOrEmail: "user4",
                    password: "1234567891",
                }).expect(200)


            // create blog
            const response = await request(app)
                .post("/blogs")
                .auth("admin", "qwerty")
                .send({
                    name: "new blog",
                    websiteUrl: "https://someurl.com",
                    description: "description"
                })
                .expect(201)

            const blogId = response.body.id

            //create post for blogId
            const responsePost1 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 1",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)

            const responsePost2 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 2",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)

            const responsePost3 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 3",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)


            const responsePost4 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 4",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)

            const responsePost5 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 5",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)

            const responsePost6 = await request(app)
                .post("/posts")
                .auth("admin", "qwerty")
                .send({
                    title: "new blog 6",
                    shortDescription: "https://someurl.com",
                    content: "blablalba",
                    blogId: blogId
                })
                .expect(201)


            console.log(responsePost6)
            console.log("id=", responsePost6.body.id)

            token01 = user01.body.accessToken;
            token02 = user02.body.accessToken;
            token03 = user03.body.accessToken;
            token04 = user04.body.accessToken;

            postId1 = responsePost1.body.id
            postId2 = responsePost2.body.id
            postId3 = responsePost3.body.id
            postId4 = responsePost4.body.id
            postId5 = responsePost5.body.id

            console.log("postId1==", postId1)
            console.log("postId2==", postId2)
            console.log("postId3==", postId3)
            console.log("postId4==", postId4)
            console.log("postId5==", postId5)


            const post1 = "/posts/" + postId1 + "/like-status";

            console.log("oooooo= ", post1);
            //set like
            const like1 = await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token01)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)

            //like post1 by user2
            const like2 = await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token02)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)

            // like post 2 by user 2, user 3;
            const post2 = "/posts/" + postId2 + "/like-status";

            const like3 = await request(app)
                .put(post2)
                .set("authorization", "Bearer " + token02)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)


            const like4 = await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token03)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)



            //dislike post 3 by user 1;
            const post3 = "/posts/" + postId3 + "/like-status";
            const like5 = await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token01)
                .send({
                    likeStatus: "Dislike"
                })
                .expect(204)

            //like post 4 by user 1, user 4, user 2, user 3;
            const post4 = "/posts/" + postId4 + "/like-status";
       await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token01)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)

         await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token04)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)


            await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token02)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)


            await request(app)
                .put(post1)
                .set("authorization", "Bearer " + token03)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)





            await request(app)
                .get("/posts")
                .set("authorization", "Bearer " + token01)
                .expect(200)
        })


    }
)