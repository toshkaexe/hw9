import {CommentDbModel, commentMapper, CommentView} from "../models/comments/comment-model";
import {InsertOneResult, ObjectId} from "mongodb";
import {BlogMongoModel, CommentMongoModel} from "../db/schemas";


export class commentsRepository  {

    static async createComment(newComment: CommentDbModel) {

        const result = new CommentMongoModel(newComment)
        await result.save()
        return result._id;
        // const result: InsertOneResult<CommentDbModel> =
        //     await CommentModel.insertOne({...newComment})
        // return commentMapper({_id: result.insertedId, ...newComment})
    }

    static async updateComment(id: string, body: any): Promise<any> {
        if(!ObjectId.isValid(id)) return false
        const result = await CommentMongoModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: body.content
            }
        })
        return result.matchedCount === 1
    }

    static async deleteComment(id: string): Promise<boolean> {
       if(!ObjectId.isValid(id)) return false
        const result = await CommentMongoModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }

    static async deleteAll() {
        return  await CommentMongoModel.deleteMany({})
    }

}