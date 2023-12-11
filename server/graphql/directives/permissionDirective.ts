import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { graphQLErrorMessage } from '../../util/errorMessage.js';

const hasRole = (role: string, requires: string) => {
  const roles = ['MEMBER', 'ADMIN'];
  const tokenRolwIndex = roles.indexOf(role.toUpperCase());
  const requiresRoleIndex = roles.indexOf(requires);

  return requiresRoleIndex >= 0 && tokenRolwIndex >= requiresRoleIndex;
}

const permissionDirective = (directiveName: string) => {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return { 
    permissionDirectiveTypeDefs: `directive @${directiveName}(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION
    enum Role {
      ADMIN
      MEMBER
    }`,
    permissionDirectiveTransformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.TYPE]: type => {
          const permissionDirective = getDirective(schema, type, directiveName)?.[0]
          if (permissionDirective) {
            typeDirectiveArgumentMaps[type.name] = permissionDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const permissionDirective = getDirective(schema, fieldConfig, directiveName)?.[0] ??
          typeDirectiveArgumentMaps[typeName];
          if (permissionDirective) {
            const { requires } = permissionDirective;
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async (source, args, context, info) => {
                const user = context.user;
                if (user.role === '') {
                  graphQLErrorMessage('Unauthenticated','UNAUTHENTICATED');
                }
                if (!hasRole(user.role, requires)) {
                  graphQLErrorMessage('Not authorized','FORBIDDEN');
                }
                // get result of the query
                const result = await resolve(source, args, context, info);
                return result;
              }
              return fieldConfig;
            }
          }
        }
      })
    }    
  }
}

export default permissionDirective;
