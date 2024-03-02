import {body} from "express-validator";

export const validateAuthorization = () => [
    body('loginOrEmail')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('errors in loginOrEmail'),
    body('password')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('errors in password'),
]