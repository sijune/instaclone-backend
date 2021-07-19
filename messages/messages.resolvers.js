import client from "../client";

export default {
    Room: {
        //첫번째 인자는 Room내 속성이다
        users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
        messages: ({ id }) =>
            client.message.findMany({
                where: {
                    roomId: id,
                },
            }),
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0;
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: {
                        id: {
                            not: loggedInUser.id, // 나에 의해 생성된 메시지 제외
                        },
                    },
                },
            });
        },
    },
    Message: {
        user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
    },
};