import client from "../client";

export default {
    User: {
        totalFollowing: ({ id }) =>
            client.user.count({
                where: {
                    followers: {
                        some: { id },
                    },
                },
            }),
        totalFollowers: ({ id }) =>
            client.user.count({
                where: {
                    following: {
                        some: { id },
                    },
                },
            }),
        isMe: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return id === loggedInUser.id;
        },
        isFollowing: async({ id }, _, { loggedInUser }) => {
            //id: 현재 보고 있는 화면의 사용자, loggedInUser: 로그인된 사용자
            if (!loggedInUser) {
                return false;
            }
            const exists = await client.user.count({
                where: {
                    username: loggedInUser.username,
                    following: {
                        some: { id },
                    },
                },
            });
            return Boolean(exists);
        },
        photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
    },
};