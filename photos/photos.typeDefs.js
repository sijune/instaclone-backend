import { gql } from "apollo-server";

export default gql `
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    likes: Int! # 좋아요 갯수 - resolver로 해결
    comments: Int! # 댓글 갯수 - resolver로 해결
    hashtags: [Hashtag]
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;