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
    res.send("Homework 10")
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
