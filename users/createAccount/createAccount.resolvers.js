import client from "../../client";
import bcrypt from "bcrypt";

export default {
    Mutation: {
        createAccount: async(
            _, { firstName, lastName, username, email, password }
        ) => {
            try {
                //await를 사용한다면 try ~ catch 구문이 좋다.
                //check if username or email are already on DB
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [{
                                username, //username: username
                            },
                            {
                                email, //email: email
                            },
                        ],
                    },
                });

                if (existingUser) {
                    throw new Error("This username/password is alerady taken.");
                }

                // hash password
                const uglyPassword = await bcrypt.hash(password, 10);

                // save and return the user
                return client.user.create({
                    data: {
                        username,
                        email,
                        firstName,
                        lastName,
                        password: uglyPassword,
                    },
                });
            } catch (e) {
                return e;
            }
        },
    },
};