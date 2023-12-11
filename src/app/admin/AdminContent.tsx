'use client'
import { useContext } from 'react';
import { gql, useQuery, TypedDocumentNode } from '@apollo/client';
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { AuthContext } from '@/context/AuthProvider';
import { User } from '@/types/user';

const ME: TypedDocumentNode<{me: User}> = gql`
  query getMe{
    me {
      id
      username
    }
  }
`;

const AdminContent = () => {
  const authContext = useContext(AuthContext);
  const userData = authContext.authInfo.userData;

  const { error, data } = useQuery(ME);

  if (!userData) return null;
  if (error) return <div>Not authorized.</div>

  return (
    <>
      <h1>Admin</h1>
      <div>{ data?.me?.username }</div>
    </>
  )
};

export default AdminContent;
