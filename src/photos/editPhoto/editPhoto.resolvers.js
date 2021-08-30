import client from "../../client";
import { protectResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        editPhoto: protectResolver(async(_, { id, caption }, { loggedInUser }) => {
            const oldPhoto = await client.photo.findFirst({
                where: {
                    id, //id외 다른 속성이 있는 경우 findUnique사용 불가
                    userId: loggedInUser.id,
                },
                include: {
                    // photo typeDefs에는 정의되어 있지만, 실제 DB에는 없음
                    hashtags: {
                        select: {
                            hashtag: true,
                        },
                    },
                },
            });
            if (!oldPhoto) {
                return {
                    ok: false,
                    error: "Photo not found",
                };
            }
            await client.photo.update({
                where: {
                    id,
                },
                data: {
                    caption,
                    hashtags: {
                        disconnect: oldPhoto.hashtags,
                        connectOrCreate: processHashtags(caption),
                    },
                },
            });
            return {
                ok: true,
            };
        }),
    },
};