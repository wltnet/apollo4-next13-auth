import { StyledButton } from './styled';
import { Props } from '.';

const Button = ({
  primary,
  secoundary,
  warning,
  type,
  children,
  onClick,
}: Props) => (
  <StyledButton
    type={type}
    primary={primary}
    secoundary={secoundary}
    warning={warning}
    onClick={onClick}
  >
    {children}
  </StyledButton>
);

export default Button;
