import {Router, Response, Request} from "express";
import {getPageOptions} from "../types/type";
import {HTTP_STATUSES} from "../models/common";
import {authMiddleware} from "../middleware/auth-middlewares";
import {UsersQueryRepository} from "../repositories/user-query-repository";
import {UsersService} from "../domain/users-service";
import {validateUsers} from "../validators/user-validation";
import {inputValidation} from "../validators/input-validation";

export const usersRouter = Router({})

usersRouter.get('/',
    authMiddleware,
    async (req: Request, res: Response) => {
        const {pageNumber, pageSize, sortBy, sortDirection} = getPageOptions(req.query);
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null


        const foundUsers = await UsersQueryRepository.findUsers(pageNumber, pageSize,
            sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        return res.send(foundUsers)
    })

usersRouter.post('/',
    authMiddleware,
    validateUsers(),
    inputValidation,

    async (req: Request, res: Response): Promise<void> => {
        const newUser = await UsersService.createUser(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    })

usersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await UsersService.deleteUser(req.params.id)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
