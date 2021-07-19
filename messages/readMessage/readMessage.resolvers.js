import client from "../../client";
import { protectResolver } from "../../users/user.utils";

export default {
    Mutation: {
        readMessage: protectResolver(async(_, { id }, { loggedInUser }) => {
            //1. 내가 보내지 않았지만 내가 방에 포함된 메세지(id) 조회
            const message = await client.message.findFirst({
                where: {
                    id,
                    userId: {
                        not: loggedInUser.id,
                    },
                    room: {
                        users: {
                            some: {
                                id: loggedInUser.id,
                            },
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            //2. 없다면 에러
            if (!message) {
                return {
                    ok: false,
                    error: "Message not found",
                };
            }
            //3. 봤다고 없데이트
            await client.message.update({
                where: {
                    id,
                },
                data: {
                    read: true,
                },
            });
            return {
                ok: true,
            };
        }),
    },
};