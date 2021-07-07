import client from "../client";

export default {
    Mutation: {
        createPost: (_, { title, content, author }) =>
            client.post.create({
                data: {
                    title,
                    content,
                    author,
                },
            }),
        deletePost: (_, { id }) => client.post.delete({ where: { id } }),
        updatePost: (_, { id, year }) =>
            client.post.update({ where: { id }, data: { year } }),
    },
};