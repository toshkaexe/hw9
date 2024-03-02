import {body} from "express-validator";
import {inputValidation} from "./input-validation";

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