import client from "../../client";
import { protectResolver } from "../../users/user.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(
            async(_, { file, caption }, { loggedInUser }) => {
                let hashtagObjs = [];
                if (caption) {
                    //1. parsing
                    hashtagObjs = processHashtags(caption);
                }
                //2. hasgtag 생성 또는 조회
                return client.photo.create({
                    data: {
                        file,
                        caption,
                        user: {
                            connect: {
                                //유저와 연결
                                id: loggedInUser.id,
                            },
                        },
                        ...(hashtagObjs.length > 0 && {
                            hashtags: {
                                connectOrCreate: hashtagObjs,
                                //hashtag와 연결되어 없으면 생성, 있으면 조회
                            },
                        }),
                    },
                });

                //3. 사진 저장 with hashtag

                //4. hashtag저장 with photo
            }
        ),
    },
};