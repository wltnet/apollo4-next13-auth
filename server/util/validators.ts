interface LoginInputError {
  username?: string;
  password?: string;
}

export const validateRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const errors: string[] = [];
  if (username.trim() === '') {
    errors.push('Username must not be empty');
  }
  if (email.trim() === '') {
    errors.push('Email must not be empty');
  } else {
    const regEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regEX)) {
      errors.push('Email must be a valid email address');
    }
  }
  if (password === '') {
    errors.push('Password must not empty');
  } else if (password !== confirmPassword) {
    errors.push('Passwords must match');
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (username: string, password: string) => {
  const errors: LoginInputError = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (password === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};