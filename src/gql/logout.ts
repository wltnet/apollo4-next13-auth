import { gql } from '@apollo/client';

export const LOGOUT_USER = gql`
mutation logout(
  $userId: String
) {
  logout (userId: $userId) { 
    status
  }
}
`;
