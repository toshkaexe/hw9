import e, {NextFunction, Response, Request} from "express";
import {validationResult, ValidationError} from "express-validator";
import { body } from 'express-validator'
export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const formattedError = validationResult(req)
        .formatWith((error: ValidationError) => {

                switch (error.type) {
                    case "field":
                        return {
                            message: error.msg,
                            field: error.path
                        }
                    default:
                        return {
                            message: error.msg,
                            field: 'Unknown'

                        }

                }
            }
        )
    if (!formattedError.isEmpty()) {
        const errorMessage =
            formattedError.array({onlyFirstError: true})
        const errors = {
            errorsMessages: errorMessage
        }
        res.status(400).send(errors)
        return
    }
    return next();
}


const emailValidation = body('email')
    .isString()
    .notEmpty()
    .isEmail().withMessage('Should be a valid email')

export const stringWithLengthValidation = (field: string, options: { max: number, min: number }) => {
    const { min, max } = options

    return body(field)
        .isString().withMessage('Must be string').trim()
        .isLength({min, max}).withMessage(`Not more than ${max} symbols, not less that ${min}`)
}

export const notEmptyString = (field: string, message?: string) => {
    return body(field)
        .isString()
        .trim()
        .notEmpty()
        .withMessage(message ?? 'Should not be an empty string')
}

const recoveryCodeValidation = notEmptyString('recoveryCode');
const passwordValidationWithLength = stringWithLengthValidation('newPassword', { min: 6, max: 20 })

export const isEmailValidation = () => [
    emailValidation,
inputValidation ];


export const passwordRecoveryValidation = () => [ recoveryCodeValidation, passwordValidationWithLength, inputValidation ]
