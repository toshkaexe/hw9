import {CommentDbModel, commentMapper, CommentView} from "../models/comments/comment-model";
import {InsertOneResult, ObjectId} from "mongodb";
import {CommentModel} from "../db/schemas";


export class commentsRepository  {

    static async createComment(newComment: CommentDbModel): Promise<CommentView> {
        const result: InsertOneResult<CommentDbModel> =
            await CommentModel.insertOne({...newComment})
        return commentMapper({_id: result.insertedId, ...newComment})
    }

    static async updateComment(id: string, body: any): Promise<any> {
        if(!ObjectId.isValid(id)) return false
        const result = await CommentModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: body.content
            }
        })
        return result.matchedCount === 1
    }

    static async deleteComment(id: string): Promise<boolean> {
       if(!ObjectId.isValid(id)) return false
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }

    static async deleteAll() {
        return  await CommentModel.deleteMany({})
    }

}