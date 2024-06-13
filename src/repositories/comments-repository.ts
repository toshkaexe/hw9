import {CommentDbModel} from "../models/comments/comment-model";
import { ObjectId} from "mongodb";
import {CommentMongoModel} from "../db/schemas";


export class CommentsRepository {

    static async saveComment(newComment: CommentDbModel) {

        const result = new CommentMongoModel(newComment)
        await result.save()
        return result;

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
        return CommentMongoModel.deleteMany({});
    }

}