"use client";
import { useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextContent } from '@/context/AuthProvider';
import { useForm } from '@/hooks/useForm';
import { handleValidate } from '@/util/validate';
import { showErrorMessage } from '@/util/errors';
import { LOGIN_USER } from '@/gql';
import { Errors, AriaInvalid, LoginAriaInvalid } from '@/types/form';
import ErrorSection from '@/components/ErrorSection';
import Button from '@/components/Button';
import {
  Label,
  ErrorMessage,
  Required,
  Mandatory,
  Input,
} from './styled';

const initialAriaInvalid = {
  username: false,
  password: false,
}

const initialState = {
  username: '',
  password: '',
};

const LoginForm = () => {
  const [errors, setErrors] = useState<Errors[]>([]);
  const [apiErrors, setApiErrors] = useState<string>('');
  const [ariaInvalid, setAriaInvalid] = useState<AriaInvalid>(initialAriaInvalid);
  const [doSubmit, setDoSubmit] = useState<boolean>(false);
  const router = useRouter();
  const authContext = useContext<AuthContextContent>(AuthContext);

  const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      authContext.setAuthInfo({ accessToken: data.login.accessToken, userData: data.login});
      sessionStorage.setItem('accessToken', data.login.accessToken);
      router.push('/member');
    },
    onError(err) {
      setApiErrors(err.graphQLErrors[0].message);
    },
    variables: values,
  });

  function loginUserCallback() {
    setApiErrors('');
    setErrors([]);
    setAriaInvalid(initialAriaInvalid);
    setDoSubmit(false);
    if (errors.length === 0) {
      handleValidate(values, setErrors, setAriaInvalid);
      setDoSubmit((preState) => !preState);
    }
  }

  useEffect(() => {
    if (errors.length === 0 && doSubmit) {
      loginUser();
    }
  }, [errors, doSubmit, loginUser]);

  return (
  <>
    <ErrorSection errors={errors} apiErrors={apiErrors}/>
    <form onSubmit={onSubmit} noValidate>
    <Label htmlFor="username">
      Username
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
      <ErrorMessage>{showErrorMessage(errors, 'username')}</ErrorMessage>
    </Label>
    <Input id="username" name="username" aria-required="true" aria-invalid={(ariaInvalid as LoginAriaInvalid).username}
     placeholder="Username" autoComplete="username" required $invalid={(ariaInvalid as LoginAriaInvalid).username} 
     type="text" onChange={onChange} />
    <Label htmlFor="password">
      Password
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
      <ErrorMessage>{showErrorMessage(errors, 'password')}</ErrorMessage>
    </Label>
    <Input id="password" name="password" aria-required="true" aria-invalid={(ariaInvalid as LoginAriaInvalid).password} 
      placeholder="Password" type="password" autoComplete="current-password" required $invalid={(ariaInvalid as LoginAriaInvalid).password} 
      onChange={onChange} />
    <Button type="submit">Submit</Button>
  </form>
  </>
)};

export default LoginForm;
