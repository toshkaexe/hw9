import {body} from "express-validator";
import {inputValidation} from "./input-validation";


export const nameValidation = body("name")
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage("name is too long");
export const descriptionValidation = body("description")
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage("Incorrect description!");

export const websiteUrlValidation = body("websiteUrl")
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
    .withMessage("website url does not match the template!");



export const titleValidation = body("title")
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage("title is too long");

export const shortDescriptionValidation = body("shortDescription")
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage("Incorrect description!");

export const contentValidation = body("content")
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage("content is too long");

export const blogValidation = ()=>[
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation
]

export const blogValidationPostToBlog = ()=>[
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation
]