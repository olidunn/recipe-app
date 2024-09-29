import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

type ButtonProps = {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
};
export function Button({ children, className, onClick, style }: ButtonProps) {
  return (
    <StyledButton style={style} className={className} onClick={onClick}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  color: #e8e9eb;
  background-color: #8c8b91;
  padding: 8px 10px;
  width: fit-content;
  cursor: pointer;
  box-shadow: 2px 2px 10px 2px rgba(48, 47, 47, 0.2);
  border: none;
  font-family: "DM Sans", sans-serif;
`;
