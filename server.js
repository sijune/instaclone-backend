require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/user.utils";

const apollo = new ApolloServer({
    resolvers, //graphql-tools 가 아닌 apollo server 가 스키마를 생성하도록 함, Upload scalar를 사용하기 위해서
    typeDefs,
    context: async({ req }) => {
        return {
            //http headers에 넣는 방법
            loggedInUser: await getUser(req.headers.token),
            protectResolver,
        };
    },
});

const app = express(); //apollo server에 숨어져 있던 서버를 밖으로 노출시킨다.
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));

apollo.applyMiddleware({ app });

const PORT = process.env.PORT;

app.listen({ port: PORT }, () => {
    console.log(`Server is running on LocalHost:${PORT}`);
});