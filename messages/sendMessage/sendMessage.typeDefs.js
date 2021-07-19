import { gql } from "apollo-server";

export default gql `
  type Mutation {
    sendMessage(payload: String!, roomId: Int, userId: Int): MutationResponse!
    # 처음 메세지를 보낸다면: userId만 이용
    # 두번째로 보낸다면, roomId을 이용
  }
`;