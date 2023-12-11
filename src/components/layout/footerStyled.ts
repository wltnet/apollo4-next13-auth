import styled from 'styled-components';

export const StyledFooter = styled.footer`
  padding: 0.9375em 1.25em;
  background-color: ${({ theme }) => theme.colors.headerBackgroundColour};
  color: ${({ theme }) => theme.colors.headerFont};
`;
