require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/user.utils";

const apollo = new ApolloServer({
    resolvers, //graphql-tools 가 아닌 apollo server 가 스키마를 생성하도록 함, Upload scalar를 사용하기 위해서
    typeDefs,
    playground: true, //production 모드에서 playground 사용
    introspection: true, //production 모드에서 playground 사용, docs
    context: async(ctx) => {
        if (ctx.req) {
            //http
            return {
                //http headers에 넣는 방법
                loggedInUser: await getUser(ctx.req.headers.token),
                protectResolver,
            };
        } else {
            //ws
            const {
                connection: { context },
            } = ctx;
            return {
                loggedInUser: context.loggedInUser,
            };
        }
    },
    subscriptions: {
        //onConnect: connection이 이루어지는 순간 딱 한번 호출된다. connection param으로는 http header정보가 기본적으로 들어간다.
        onConnect: async({ token }) => {
            if (!token) {
                throw new Error("You can't listen");
            }
            const loggedInUser = await getUser(token);
            return {
                //return값이 다시 context로 들어간다.
                loggedInUser,
            };
        },
    },
});

const PORT = process.env.PORT;

const app = express(); //apollo server에 숨어져 있던 서버를 밖으로 노출시킨다.
app.use(logger("tiny"));

apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app); //app상에서 listen하는 것이 아닌, http server 상에서 listen하도록 한다.
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is running on LocalHost:${PORT}`);
});