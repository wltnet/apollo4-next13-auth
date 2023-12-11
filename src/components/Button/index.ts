import Button from "./Button";

export interface Props {
  primary?: boolean;
  secoundary?: boolean;
  warning?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  children: React.ReactNode;
  onClick?: () => void;
}

export default Button;
