import { useState } from 'react';
import { LoginInput, RegisterInput } from '@/types/form';

interface FromCallback {
  (): void;
}

export const useForm = (callback: FromCallback, initialState = {}) => {
  const [values, setValues] = useState(initialState);
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement> & (LoginInput | RegisterInput)) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    callback();
  }

  return {
    onChange,
    onSubmit,
    values
  }
}
