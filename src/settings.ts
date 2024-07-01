import express, {Express, Request, Response} from 'express';
import {blogRoute} from "./routes/blog-route"
import {postRoute} from "./routes/post-route"
import {testingRoute} from "./routes/testing-route";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import {authRouter} from "./routes/auth-router";
import {userRouter} from "./routes/user-route";
import {commentsRoute} from "./routes/comments-route";
import {emailRoute} from "./routes/emailRoute";
import {cookie} from "express-validator";
import cookieParser from "cookie-parser";
import {deviceRoute} from "./routes/device-route";
import dotenv from "dotenv";

dotenv.config();
export const appConfig = {

    PORT: process.env.PORT,
    ACCESS_TOKEN_EXPIRES: '1h',
    REFRESH_TOKEN_EXPIRES: '1h',
    MONGO_URI: process.env.MONGO_URI_CLOUD,
    DB_NAME: process.env.DB_NAME,

    ADMIN_LOGIN: 'admin',
    ADMIN_PASSWORD: 'qwerty'
    }

export const RoutesList = {
    BASE: '/',
    BLOGS: '/blogs',
    POSTS: '/posts',
    USERS: '/users',
    AUTH: '/auth',
    DEVICES: '/security/devices',
    COMMENTS: '/comments',
    VERSION: '/version',
    TESTING: '/testing',
}


export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    testing: '/testing',
    users: '/users',
    comments: '/comments',
    auth: '/auth',
    email: '/email',
    security: '/security/devices',

}

export const app: Express = express();
app.use(cookieParser())
morganBody(app);
app.use(express.json())

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send("Homework 11 Likes for comments")
})
app.get('/env', (req, res) => {
    res.send({
        login: process.env.AUTH_LOGIN,
        pass: process.env.AUTH_PASSWORD,
    })
})
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/testing', testingRoute)

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/comments', commentsRoute)

app.use('/email', emailRoute)
app.use('/security/devices', deviceRoute)
