import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async(token) => {
    try {
        if (!token) {
            // 토큰이 없다면 null 반환
            return null;
        }
        const { id } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await client.user.findUnique({ where: { id } });
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
};

// 함수가 다른 함수를 리턴한다.
export const protectResolver = (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
        const query = info.operation.operation === "query";
        if (query) {
            //요청이 Query인 경우
            return null;
        } else {
            //요청이 Mutation인 경우
            return {
                ok: false,
                error: "Please log in to perform this action.",
            };
        }
    }

    return ourResolver(root, args, context, info);
};