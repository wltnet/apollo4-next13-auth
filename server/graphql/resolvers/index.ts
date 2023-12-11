import users from './users.js';

const resolvers = {
  Query: {
    ...users.Query,
  },
  Mutation: {
    ...users.Mutation,
  },
}

export default resolvers;
