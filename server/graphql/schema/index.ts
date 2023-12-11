import users from './users.js';
import { mergeTypeDefs } from '@graphql-tools/merge';
// import gql from 'graphql-tag';  // check if needed
import { makeExecutableSchema } from '@graphql-tools/schema';
import authDirective from '../directives/authDirective.js';
import permissionDirective from '../directives/permissionDirective.js';
import resolvers from '../resolvers/index.js';

const types = [users];

const schema = mergeTypeDefs(types);

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('authenticated');
const { permissionDirectiveTypeDefs, permissionDirectiveTransformer } = permissionDirective('permission');

const directiveTransformers = [
  authDirectiveTransformer,
  permissionDirectiveTransformer
]

let newSchema: any = makeExecutableSchema({
  typeDefs: [authDirectiveTypeDefs, permissionDirectiveTypeDefs, schema],
  resolvers,
});

newSchema = directiveTransformers.reduce((curSchema, transformer) => transformer(curSchema), newSchema);

// newSchema = authDirectiveTransformer(newSchema);

export default newSchema;
