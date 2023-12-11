import styled from 'styled-components';
import { Props } from '.';

type styledProps = Pick<Props, "primary" | "secoundary" | "warning">;

export const StyledButton = styled.button<styledProps>`
  display: block;
  margin-top: 0.9375rem;
  font-size: 1rem;
  padding: 0.375rem 0.9375rem;
  cursor: pointer;
  background-color: ${({theme}) => theme.colors.buttonBackground};
  color: ${({theme}) => theme.colors.buttonFont};
  border-radius: 0.25rem;
  border: none;

  &:hover {
    background-color: ${({theme}) => theme.colors.buttonBackgroundHover};
    color: ${({theme}) => theme.colors.buttonHover};
  }
`