import {LikeStatus} from "../common";

export type LikesDBModel = {
    createAt: Date,
    status: LikeStatus,
    authorId: string,
    parentId: string
}