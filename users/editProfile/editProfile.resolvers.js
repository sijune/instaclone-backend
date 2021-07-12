import client from "../../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { protectResolver } from "../user.utils";

const resolverFn = async(
        _, { firstName, lastName, username, email, password: newPassword }, { loggedInUser, protectResolver } //context에 들어가는 건 모든 resolver에서 접근이 가능하다.
    ) =>
    //resolver에서만 새롭게 변수를 정의하고 싶은 경우 --> password: newPassword
    {
        let uglyPassword = null;
        if (newPassword) {
            uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
            //업데이트는 유저를 반환한다.
            where: {
                id: loggedInUser.id, //어떤 유저인지 명시
            },
            data: {
                firstName,
                lastName,
                username,
                email,
                ...(uglyPassword && { password: uglyPassword }), // es6, 첫 번째가 true라면 다음 오브젝트 반환
            },
        });
        if (updatedUser.id) {
            return {
                ok: true,
            };
        } else {
            return {
                ok: false,
                error: "Could not update profile.",
            };
        }
    };

export default {
    Mutation: {
        editProfile: protectResolver(resolverFn),
    },
};