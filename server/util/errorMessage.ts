import { GraphQLError } from 'graphql';

export const graphQLErrorMessage = (errorMessage: string, code: string) => {
  throw new GraphQLError(errorMessage, {
    extensions: {
      code,
    },
  });
}