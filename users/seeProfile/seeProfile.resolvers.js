import client from "../../client";

export default {
    Query: {
        seeProfile: (_, { username }) =>
            client.user.findUnique({
                where: {
                    username,
                },
                include: {
                    //사용자 간 관계
                    following: true,
                    followers: true,
                },
            }),
    },
};