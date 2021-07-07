import { gql } from "apollo-server";

export default gql `
  # prisma 스키마와 일치하는 것이 중요
  type Post {
    id: Int!
    title: String!
    content: String!
    author: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    posts: [Post]
    post(id: Int!): Post
  }
  type Mutation {
    createPost(title: String!, content: String!, author: String): Post
    deletePost(id: Int!): Post
    updatePost(id: Int!, year: Int!): Post
  }
`;