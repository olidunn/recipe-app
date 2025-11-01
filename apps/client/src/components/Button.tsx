import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import type { IconType } from './Icon';
import { Icon } from './Icon';

type ButtonProps = {
  children: ReactNode;
  icon?: IconType | undefined;
  onClick: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string | undefined;
  className?: string | undefined;
  style?: CSSProperties;
  loading?: boolean;
};
export function Button({
  children,
  icon,
  ariaLabel,
  className,
  onClick,
  style,
  loading = false,
}: ButtonProps) {
  return (
    <StyledButton
      style={style}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon && <Icon type={icon} />}
      {loading ? 'loading...' : children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  color: #e8e9eb;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  background-color: #8c8b91;
  padding: 8px 10px;
  width: fit-content;
  cursor: pointer;
  box-shadow: 2px 2px 10px 2px rgba(48, 47, 47, 0.2);
  border: none;
  font-family: "DM Sans", sans-serif;
  border-radius: 5px;
  &:hover  {
    background-color: #8383cf;
  }
`;
