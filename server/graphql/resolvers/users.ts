import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { validateRegisterInput, validateLoginInput} from '../../util/validators.js';
import { handleTokens } from '../../util/generateToken.js';
import { User as UserType } from '../../types/users.js';
import { findUser, saveUser, removeRefreshToken } from '../../util/database.js';
import { graphQLErrorMessage } from '../../util/errorMessage.js';
import { removeRefreshTokenCookie } from '../../util/setCookies.js';
import { RegisterInput, Login, GraphQLContext } from './types.js';

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || '';

const users = {
  Query: {
    me: () => {
      return {
        id: '1',
        username: 'Robin Wieruch Admin',
        email: 'test',
        accessToken: 'test',
        createdAt: 'test',
      };
    },
    meTest: () => {
      return {
        id: '2',
        username: 'David William',
        email: 'test',
        accessToken: 'test',
        createdAt: 'test',
      };
    },
    member: () => {
      return {
        id: '2',
        username: 'Member David William',
        email: 'test',
        accessToken: 'test',
        createdAt: 'test',
      };
    },
  },
  Mutation: {
    async register(
      _: any,
      {
        registerInput: {
          username,
          email,
          password,
          confirmPassword,
        },
      }: RegisterInput,
      context: GraphQLContext,
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(username.toLowerCase(), email.toLowerCase(), password, confirmPassword);
      if (!valid) {
        graphQLErrorMessage(errors.toString(),'BAD_USER_INPUT');
      }

      const user = await findUser(username);
      if (user) {
        graphQLErrorMessage('This username is taken','BAD_USER_INPUT')
      };

      // Hash password and create an auth accessToken
      const hashedPassword = await bcrypt.hash(password, 12);

      const { res, userInfo } = await saveUser(email, username, hashedPassword);

      const { accessToken } = await handleTokens(userInfo, context.res, res.id);

      return {
        id: res._id,
        username: res._doc.username,
        email: res._doc.email,
        createdAt: res._doc.createdAt,
        role: res._doc.role,
        accessToken,
      };
    },
    async login(_: any, { username, password }: Login, { res }: GraphQLContext) {
      const { valid } = validateLoginInput(username.toLowerCase(), password);

      if (!valid) {
        graphQLErrorMessage('Login invalid','BAD_USER_INPUT');
      }

      const user = await findUser(username);
      if (!user) {
        graphQLErrorMessage('User not found','BAD_USER_INPUT');
      };

      if (user?.password) {
        const match = await bcrypt.compare(password, user.password);  // check
        if (!match) {
          graphQLErrorMessage('Wrong crendetials','BAD_USER_INPUT');
        }
      }

      const userInfo: UserType = {id: user?.id, username: user?.username, role: user?.role};

      const { accessToken } = await handleTokens(userInfo, res, user?.id);

      return {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
        role: user?.role,
        accessToken,
      };
    },
    async refreshToken(_: any, __:any, { refreshToken, res }: GraphQLContext) {
      const userFromToken: any = jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
          graphQLErrorMessage('Token invalid','BAD_USER_INPUT');
        }
        return decoded;
      });

      const user = await findUser(userFromToken.username);
      if (!user) {
        graphQLErrorMessage('User not found','BAD_USER_INPUT');
      };

      const userInfo: UserType = {id: user?.id, username: user?.username, role: user?.role};

      const { accessToken } = await handleTokens(userInfo, res, user?.id);

      return {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
        role: user?.role,
        accessToken,
      };
    },
    async logout(_: any, { userId }: any, { user: { id }, res }: GraphQLContext) {
      removeRefreshTokenCookie(res);
      await removeRefreshToken(id || userId);
      // res.end();
      return { status: 'ok' };
    },
  }
}

export default users;
