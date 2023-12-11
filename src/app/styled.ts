import styled, { css } from 'styled-components';

/*
20px = 12.5em
15px = 0.9375em;
10px = 0.625em;
5px = 0.3125em;
*/

const visuallyHidden = css`
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

export const Label = styled.label`
  display: block;
  font-size: var(--font-size-0);
`;

export const ErrorMessage = styled.span`
  display: inline-block;
  color: ${({theme}) => theme.colors.warningFont};

  &:first-letter {
    text-transform: uppercase;
  }
`;

export const Required = styled.span`
  ${visuallyHidden}
`

export const Mandatory = styled.span`
  color: ${({theme}) => theme.colors.warningFont};
  margin-right: 0.3125em;
`

export const Input = styled.input<{ $invalid: boolean }>`
  box-shadow: ${({ $invalid, theme }) => $invalid ? `0 0 0 1px ${theme.colors.warningFont}, inset 0 1px 1px rgba(0,0,0,.075)` : 'none'};
  border:  ${({ $invalid, theme }) => $invalid ? `1px solid ${theme.colors.warningFont}` : '1px solid #000000'};
  font-size:  var(--font-size-0);
  padding: 0.25rem;
  margin: 0.25rem;
  width: 18.75rem;
  // background-color: red;
`
