import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        login: async(_, { username, password }) => {
            // 1. 유저찾기
            const user = await client.user.findFirst({ where: { username } });
            if (!user) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            // 2. 패스워드 체크
            const passwordOk = await bcrypt.compare(password, user.password);
            if (!passwordOk) {
                return {
                    ok: false,
                    error: "Incorrect password",
                };
            }
            // 3. 토큰 발급: jsonwebtoken(jwt), 프론트와 서버가 분리된 경우 사용 / 쿠키와 세션은 같은 곳에 있을 때 사용
            const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            };
        },
    },
};