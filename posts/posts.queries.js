import client from "../client";

export default {
    Query: {
        posts: () => client.post.findMany(),
        post: (_, { id }) => client.post.findUnique({ where: { id } }),
    },
};