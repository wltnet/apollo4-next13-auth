'use client'
import { useContext } from "react";
import { gql, useQuery, TypedDocumentNode } from '@apollo/client';
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { AuthContext } from "@/context/AuthProvider";
import Button from '@/components/Button';
import { User } from '@/types/user';

const MEMBER: TypedDocumentNode<{member: User}> = gql`
  query member{
    member {
      id
      username
    }
  }
`;

const MemberContent = () => {
  const authContext = useContext(AuthContext);
  const userData = authContext.authInfo.userData;

  const { error, data, refetch } = useQuery(MEMBER);

  if (!userData) {
    return null;
  }

  return (
    <>
      <div>{ data?.member?.username }</div>
      { error && <div>{ error.message }</div>}
      <div><Button onClick={() => refetch()}>Refetch</Button></div>
    </>
  )
}

export default MemberContent;
