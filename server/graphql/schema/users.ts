const schema = /* GraphQL */ `
  type Query {
    me: User @authenticated @permission(requires: ADMIN)
    meTest: User @authenticated
    member: User @authenticated @permission(requires: MEMBER)
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    accessToken: String!
    createdAt: String!
    role: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Token {
    accessToken: String!
  }

  type Status {
    status: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    refreshToken: User!
    logout(userId: String): Status!
  }
`;

export default schema;
