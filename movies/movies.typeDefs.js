import { gql } from "apollo-server";

export default gql `
  # prisma 스키마와 일치하는 것이 중요
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String!): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, year: Int!): Movie
  }
`;