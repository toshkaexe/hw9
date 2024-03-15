import {ObjectId} from "mongodb";
import {ResultCode} from "./resultCode";

export const NewsService = {

    async createNews(title: string, category: string, description: string, userId: string) {

        const news = {
            _id: new ObjectId(),
            title,
            category,
            description,
            userId,
            crratedAt: new Date(),
            updatedAt: new Date()
        }
    },


   /* async updatedNews(id: string,title: string, category: string,description: string, userId: string){
        const news: any = await repo.findNewsById(id);

        if (!news) return {
            code: ResultCode.NotFound,
            errorMessage:`News with ${id} not found`
        }; //404

        if(!news.userId===userId) return {
            code: ResultCode.Forbindden,
            errorMessage:`News with ${userId} have not news with id ${id}`
        }; //404  ; //403
    }

    */
}