import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Next JS 13 with Apollo 4, express and mongoDB register user',
  description: 'Next JS 13 with Apollo 4, express and mongoDB register user',
}

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  )
}
