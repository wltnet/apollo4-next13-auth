import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Express from 'express';
import { User } from '../types/users.js';
import { saveRefreshToken } from './database.js';
import { setRefreshTokenCookie } from './setCookies.js';

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || '';
const SECRET_KEY = process.env.SECRET_KEY || '';

export const generateToken = (user: User, refresh: boolean) => {
  const expiresIn = refresh ? '30m' : '30s';
  // const expiresIn = refresh ? '7d' : '15m';
  const secretKey = refresh ? REFRESH_SECRET_KEY : SECRET_KEY;
  if (!secretKey) return;
  return jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
  }, secretKey, { expiresIn });
};

export const handleTokens = async (userInfo: User, res: Express.Response, userId: string) => {
  const accessToken = generateToken(userInfo, false);
  const refreshToken = generateToken(userInfo, true);

  if (refreshToken) {
    setRefreshTokenCookie(res, refreshToken);
    await saveRefreshToken(refreshToken, userId);
  }

  return { accessToken }
}

export default generateToken;
