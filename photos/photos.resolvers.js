import client from "../client";

export default {
    Photo: {
        user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
        hashtags: ({ id }) =>
            client.hashtag.findMany({
                where: {
                    photos: {
                        some: {
                            id,
                        },
                    },
                },
            }),
        likes: ({ id }) =>
            client.like.count({
                where: {
                    photoId: id,
                },
            }),
        comments: ({ id }) =>
            client.comment.count({
                where: {
                    photoId: id,
                },
            }),
        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return userId === loggedInUser.id;
        },
    },
    Hashtag: {
        //parent, args, context
        photos: ({ id }, { page }, { loggedInUser }) => {
            return client.hashtag
                .findUnique({
                    where: {
                        id,
                    },
                })
                .photos(); //photo들을 가져온다.
        },
        totalPhotos: ({ id }) =>
            client.photo.count({
                where: {
                    hashtags: {
                        some: {
                            id,
                        },
                    },
                },
            }),
    },
};