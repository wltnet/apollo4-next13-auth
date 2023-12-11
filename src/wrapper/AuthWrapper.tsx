'use client'
import { useContext, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthProvider';

const REFRESH_TOKEN = gql`
  mutation refreshToken {
    refreshToken {
      id email username createdAt role
      accessToken
    }
  }
`;

const AuthWrapper = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const authContext = useContext(AuthContext);
  const userData = authContext.authInfo.userData;

  const [refreshToken, { data, loading, error }] = useMutation(REFRESH_TOKEN, {
    onCompleted(data) {
      authContext.setAuthInfo({ accessToken: data.refreshToken.accessToken, userData: data.refreshToken});
      sessionStorage.setItem('accessToken', data.refreshToken.accessToken);
    }
  });

  const includePaths = pathname!=='/' && pathname!=='/register';

  useEffect(() => {
    if (!userData && includePaths) {
      refreshToken();
    }
  }, []);

  return (
    <>
      {loading && includePaths ? <p>Loading...</p>: children}
    </>
  );
}

export default AuthWrapper;
