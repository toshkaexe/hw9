import {param} from "express-validator";

export const validateMongoId = () => [
    param('postId')
        .isMongoId()
        .withMessage('mongoId is not valid')
]