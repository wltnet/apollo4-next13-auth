import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { graphQLErrorMessage } from '../../util/errorMessage.js';

const authDirective = (directiveName: string) => {
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(format: String) on FIELD_DEFINITION`,
    authDirectiveTransformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
          if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async (source, args, context, info) => {
              const user = context.user;
              if (user.role === '') {
                graphQLErrorMessage('Unauthenticated','UNAUTHENTICATED');
              }
              // get result of the query
              const result = await resolve(source, args, context, info);
              return result;
            }
            return fieldConfig;
          }
        }
      })
    }    
  }
}

export default authDirective;
