import Express from 'express';

export interface RegisterInput {
  registerInput: Input;
}

export interface Input {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface GraphQLContext {
  user: User;
  refreshToken: string;
  res: Express.Response;
}

export interface User {
  id: string;
  username: string;
}
