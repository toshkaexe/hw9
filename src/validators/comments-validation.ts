import {body} from "express-validator";
import {inputValidation} from "./input-validation";
import {LikeStatus} from "../models/common";

export const validateComments =
          body('content')
        .isString()
        .trim()
        .notEmpty()
        .isLength({min: 20, max: 300})
        .withMessage('errors in content');

export const validateContents = ()=> [
    validateComments,
    inputValidation
]

export const validateLikeContent =
    body('likeStatus')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Content must not be empty')
        .isIn(Object.values(LikeStatus))
        .withMessage('Content must be one of "None", "Like", or "Dislike"')

export const validateLikeStatus = ()=> [
    validateLikeContent,
    inputValidation
]