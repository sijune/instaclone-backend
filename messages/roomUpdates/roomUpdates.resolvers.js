import { withFilter } from "apollo-server-express";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
    Subscription: {
        roomUpdates: {
            subscribe: async(root, args, context, info) => {
                //room이 있는지 없는지 검증 후 실시간 이벤트 진행
                const room = await client.room.findFirst({
                    where: {
                        id: args.id,
                        users: {
                            some: {
                                id: context.loggedInUser.id,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                });
                if (!room) {
                    throw new Error("You shall not see this.");
                }
                return withFilter(
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    //asyncIterator: 비동기적으로 들어오는 데이터를 필요에 따라 처리할 수 있습니다.
                    //NEW_MESSAGE를 listening하고 있다. NEW_MESSAGE를 subscribe 하고 있다.
                    async({ roomUpdates }, { id }, { loggedInUser }) => {
                        if (roomUpdates.roomId === id) {
                            //listen중일때 user가 방을 나갈 수도 있다.
                            const room = await client.room.findFirst({
                                where: {
                                    id: id,
                                    users: {
                                        some: {
                                            id: loggedInUser.id,
                                        },
                                    },
                                },
                                select: {
                                    id: true,
                                },
                            });
                            if (!room) {
                                return false;
                            }
                            return true;
                        }
                    }
                    //두번째 함수가 true를 반환해야 user가 업데이트 받을 수 있다.
                    //roomUpdates.roomId는 readMessage에서 보낸 pub 측의 id
                    //id는 roomUpdates에서 sub중인 id
                )(root, args, context, info);
            },
        },
    },
};