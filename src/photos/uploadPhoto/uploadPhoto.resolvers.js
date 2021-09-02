import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(
            async(_, { file, caption }, { loggedInUser }) => {
                let hashtagObjs = [];
                console.log(caption);

                if (caption) {
                    //1. parsing
                    //2. hasgtag 생성 또는 조회
                    hashtagObjs = processHashtags(caption);
                }
                const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
                console.log(fileUrl);
                //3. 사진 저장 with hashtag
                return client.photo.create({
                    data: {
                        file: fileUrl,
                        caption,
                        user: {
                            connect: {
                                //유저와 연결
                                id: loggedInUser.id,
                            },
                        }, //4. hashtag저장 with photo
                        ...(hashtagObjs.length > 0 && {
                            hashtags: {
                                connectOrCreate: hashtagObjs,
                                //hashtag와 연결되어 없으면 생성, 있으면 조회
                            },
                        }),
                    },
                });

                //4. hashtag저장 with photo
            }
        ),
    },
};