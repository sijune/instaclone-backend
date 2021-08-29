import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectResolver } from "../../users/user.utils";

export default {
    Mutation: {
        sendMessage: protectResolver(
            async(_, { payload, roomId, userId }, { loggedInUser }) => {
                let room = null;

                if (userId) {
                    // 1. userId가 있다면 처음 대화하는 것
                    const user = await client.user.findUnique({
                        where: {
                            id: userId,
                        },
                        select: {
                            id: true,
                        },
                    });

                    if (!user) {
                        return {
                            ok: false,
                            error: "This user does not exist",
                        };
                    }
                    // 방을 생성
                    room = await client.room.create({
                        data: {
                            users: {
                                // 로그인한 유저와 메세지를 전달한 유저를 같이 room에 넣는다
                                connect: [{
                                        id: userId,
                                    },
                                    {
                                        id: loggedInUser.id,
                                    },
                                ],
                            },
                        },
                    });
                } else if (roomId) {
                    // 2. userId없이 roomId만 들어온다면 기존 방이 있다는 것
                    // 기존 방 검색
                    room = await client.room.findUnique({
                        where: {
                            id: roomId,
                        },
                        select: {
                            id: true,
                        },
                    });
                    if (!roomId) {
                        return {
                            ok: false,
                            error: "Room not found",
                        };
                    }
                }
                // 메세지 생성
                const message = await client.message.create({
                    data: {
                        payload,
                        room: {
                            connect: {
                                id: room.id,
                            },
                        },
                        user: {
                            connect: {
                                id: loggedInUser.id,
                            },
                        },
                    },
                });
                pubsub.publish(NEW_MESSAGE, { roomUpdates: {...message } });
                // ...: message 오브젝트가 아닌, message안의 payload나 id 같은 값이 들어온다.
                // 반드시 roomUpdates의 반환값과 동일하게 두번째 인자 값으로 들어가야 한다.
                return {
                    ok: true,
                    id: message.id,
                };
            }
        ),
    },
};