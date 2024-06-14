import {LikeStatus} from "../models/common";

export const db = {
    users: [
        {
            id: 1,
            login: 'admin',
            password: 'qwerty',
        }
    ],
    blogs: [
        {
            id: "123",
            name: "blog1",
            description: "blog description",
            websiteUrl: "https://mail.ru",
            isMembership: true,
            createdAt: new Date().toISOString()
        }
    ],

    posts: [
        {
            id: "456",
            title: "title",
            shortDescription: "short description",
            content: "content",
            blogId: "123",
            blogName: "blog1",
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.NONE,
                newestLikes: [],
            }
        }
    ]
};