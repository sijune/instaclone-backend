import client from "../../client";
import { protectResolver } from "../../users/user.utils";

export default {
    Query: {
        seeFeed: protectResolver((_, { offset }, { loggedInUser }) =>
            client.photo.findMany({
                take: 2,
                skip: offset,
                where: {
                    OR: [{
                            user: {
                                followers: {
                                    some: {
                                        id: loggedInUser.id,
                                    },
                                },
                            },
                        },
                        {
                            userId: loggedInUser.id, //자기자신의 feed 조회
                        },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
            })
        ),
    },
};