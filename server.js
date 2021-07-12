require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser, protectResolver } from "./users/user.utils";

const server = new ApolloServer({
    schema,
    context: async({ req }) => {
        return {
            //http headers에 넣는 방법
            loggedInUser: await getUser(req.headers.token),
            protectResolver,
        };
    },
});

const PORT = process.env.PORT;

server
    .listen(PORT)
    .then(() => console.log(`Server is running on LocalHost:${PORT}`));