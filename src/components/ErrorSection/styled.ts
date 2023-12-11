import styled from 'styled-components';

export const Section = styled.section`
  margin: 0.625em;
  min-height: 2.5em;
  color: ${({theme}) => theme.colors.warningFont};
`;

export const ErrorLink = styled.a`
  display: block;
  &:first-letter {
    text-transform: uppercase;
  }
`
