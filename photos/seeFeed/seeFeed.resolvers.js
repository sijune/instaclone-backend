import client from "../../client";
import { protectResolver } from "../../users/user.utils";

export default {
    Query: {
        seeFeed: protectResolver((_, __, { loggedInUser }) =>
            client.photo.findMany({
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