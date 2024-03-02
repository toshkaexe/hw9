import {body} from "express-validator";

// const loginPattern = '^[a-zA-Z0-9_-]*$'
const loginPattern = /^[a-zA-Z0-9_-]*$/

// const emailPattern = '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'
const emailPattern = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/


export const validateUsers = () => [
    body('login')
        .isString()
        .trim()
        .notEmpty()
        .isLength({min: 3, max: 10})
        .matches(loginPattern)
        .withMessage('errors in login'),
    body('password')
        .isString()
        .trim()
        .notEmpty()
        .isLength({min: 6, max: 20})
        .withMessage('errors in password'),
    body('email')
        .isString()
        .trim()
        .notEmpty()
        .matches(emailPattern)
        .withMessage('errors in email'),
]