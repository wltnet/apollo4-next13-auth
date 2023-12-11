import sanitize from 'mongo-sanitize';
import mongoose from 'mongoose';
import { graphQLErrorMessage } from './errorMessage.js';
import User from '../models/users.js';
import { User as UserType } from '../types/users.js';

export const findUser = async (username: string) => {
  // Make sure user doesnt already exist
  const user = await User.findOne({ username: sanitize(username.toLowerCase()) });

  return user;
}

export const findUserById = async (id: string) => {
  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(sanitize(id)) });

  return user;
}

export const saveUser = async (email: string, username: string, hashedPassword: string) => {
  const newUser = new User({
    email,
    username: sanitize(username.toLowerCase()),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    role: 'member',
  });

  const res = await newUser.save();
  const userInfo: UserType = {id: res.id, username: res.username, role: res.role};

  return {
    res,
    userInfo
  }
}

export const saveRefreshToken = async (refreshToken: string, id: string) => {
  try {
    const isUserExist = await findUserById(id);
    if (isUserExist) {
      const updateUser = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(sanitize(id)) },
        { refreshToken: sanitize(refreshToken), validToken: true },
        { useFindAndModify: false, new: true },
      );
      if (!updateUser) {
        graphQLErrorMessage('User not found','BAD_USER_INPUT');
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}

export const removeRefreshToken = async(id: string) => {
  try {
    const isUserExist = await findUserById(id);
    if (isUserExist) {
      const updateUser = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(sanitize(id)) },
        { refreshToken: '', validToken: false },
        { useFindAndModify: false, new: true },
      );
      if (!updateUser) {
        graphQLErrorMessage('Failed to logout','BAD_USER_INPUT');
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}
