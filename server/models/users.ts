import { model, Schema, Document } from 'mongoose';

interface DocumentResult<T> {
  _doc: T;
}

interface User extends DocumentResult<User>{
  email: string;
  username: string;
  password: string,
  createdAt: string,
  role: string,
  refreshToken: string,
  validToken: boolean,
  status: {
    type: string,
    default: string,
  },
}

const usersSchema = new Schema<User>({
  email: String,
  username: String,
  password: String,
  createdAt: String,
  role: String,
  refreshToken: String,
  validToken: Boolean,
  status: {
    type: String,
    default: 'active',
  },
});

export default model('Users', usersSchema);
