import { gql } from "apollo-server";

export default gql `
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): Photo
  }
`;
//playground로 테스트 이후 Upload로 변경 예정