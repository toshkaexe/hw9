import {CommentDbModel, commentMapper} from "../models/comments/comment-model";

import {ObjectId, WithId} from "mongodb";
import {CommentMongoModel} from "../db/schemas";


export const commentsQueryRepository = {
// тут ошибка
    async getCommentById(id: string) {
        // if (!ObjectId.isValid(id)) return null // что с тобой не так?
        const comment: WithId<CommentDbModel> | null =
            await CommentMongoModel.findOne(
            {_id: new ObjectId(id)})
        return comment ? commentMapper(comment) : null
    },

    async getCommentsForPost(id: string,
                             pageNumber: number,
                             pageSize: number,
                             sortBy: string,
                             sortDirection: string) {
        let sortOptions: { [key: string]: 1 | -1}  = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const filter = {postId: id}
        console.log("filer: ", filter)

        const totalCount = await CommentMongoModel.countDocuments(filter) // откуда он берет дополнительную единицу?
        const pagesCount = Math.ceil(totalCount / +pageSize)
        const scip = (+pageNumber - 1) * +pageSize
        const comments = await CommentMongoModel
            .find(filter)
            .sort(sortOptions)
            .limit(+pageSize)
            .skip(scip);
console.log(comments)
        return comments ? {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(commentMapper)
        } : null

    },
}