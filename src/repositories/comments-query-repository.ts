import {CommentDbModel, commentMapper} from "../models/comments/comment-model";

import {ObjectId, WithId} from "mongodb";
import {CommentMongoModel} from "../db/schemas";
import {CommentToLikeRepository} from "./comment-to-like-repository";


export class CommentsQueryRepository {
// тут ошибка
    static async getCommentById(id: string) {
        // if (!ObjectId.isValid(id)) return null // что с тобой не так?
        const comment: WithId<CommentDbModel> | null =
            await CommentMongoModel.findById(id)
        console.log("in CommentsQueryRepository= ", comment)
        return comment ? commentMapper(comment) : null
    }

    static async getCommentsForPostForUnautorisedUser(postId: string,
                                                      pageNumber: number,
                                                      pageSize: number,
                                                      sortBy: string,
                                                      sortDirection: string) {


        let sortOptions: { [key: string]: 1 | -1 } = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const filter = {postId: postId}
        console.log("filter: ", filter)

        const totalCount = await CommentMongoModel.countDocuments(filter)


        console.log("totalCount=", totalCount)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        console.log("pageCount=", pagesCount)
        const scip = (+pageNumber - 1) * +pageSize
        console.log("scip=", scip)

        const document = await CommentMongoModel.find(filter)
        console.log("document: ", document)

        console.log("document end")

        const comments =
            await CommentMongoModel
                .find(filter)
                .sort(sortOptions)
                .limit(+pageSize)
                .skip(scip);


        console.log("comments===", comments)

        for (const comment of comments) {
            console.log(comment._id.toString())
            comment.likesInfo.likesCount = await CommentToLikeRepository.getNumberOfLikes(comment._id.toString())
            comment.likesInfo.dislikesCount = await CommentToLikeRepository.getNumberOfDislikes(comment._id.toString())
            //Status //TODO find myStatus


            // comment.likesInfo.myStatus = await CommentToLikeRepository.getStatusForUnauthorisatedUser(comment._id.toString())


        }
        console.log("..............")
        return comments ? {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(commentMapper)
        } : null

    }


    static async getCommentsForPostForAutorisedUser(postId: string,
                                                    userId: string,
                                                    pageNumber: number,
                                                    pageSize: number,
                                                    sortBy: string,
                                                    sortDirection: string) {


        let sortOptions: { [key: string]: 1 | -1 } = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const filter = {postId: postId}
        console.log("filter: ", filter)

        const totalCount = await CommentMongoModel.countDocuments(filter)


        console.log("totalCount=", totalCount)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        console.log("pageCount=", pagesCount)
        const scip = (+pageNumber - 1) * +pageSize
        console.log("scip=", scip)

        const document = await CommentMongoModel.find(filter)
        console.log("document: ", document)

        console.log("document end")

        const comments =
            await CommentMongoModel
                .find(filter)
                .sort(sortOptions)
                .limit(+pageSize)
                .skip(scip);


        console.log("comments===", comments)

        for (const comment of comments) {
            console.log(comment._id.toString())
            comment.likesInfo.likesCount = await CommentToLikeRepository.getNumberOfLikes(comment._id.toString())
            comment.likesInfo.dislikesCount = await CommentToLikeRepository.getNumberOfDislikes(comment._id.toString())
            comment.likesInfo.myStatus = await CommentToLikeRepository.getCurrentUserStatus(comment._id.toString(), userId)
        }
        console.log("..............")
        return comments ? {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(commentMapper)
        } : null

    }
}