import type { CSSProperties } from 'styled-components';
import styled from 'styled-components';
import type { LinkProps as WouterLinkProps } from 'wouter';
import { Link as WouterLink } from 'wouter';
import type { IconType } from './Icon';
import { Icon } from './Icon';

type LinkProps = Omit<WouterLinkProps, 'asChild' | 'href' | 'to' | 'style'> & {
  icon?: IconType;
  to: string;
  style?: CSSProperties;
};

export function Link({ children, icon, ...restProps }: LinkProps) {
  return (
    <StyledLink {...restProps}>
      {icon && <Icon type={icon} />}
      {children}
    </StyledLink>
  );
}

const StyledLink = styled(WouterLink)`
  color: #e8e9eb;
  background-color: #8c8b91;
  padding: 8px 10px;
  width: fit-content;
  cursor: pointer;
  box-shadow: 2px 2px 10px 2px rgba(48, 47, 47, 0.2);
  border: none;
  font-family: "DM Sans", sans-serif;
  text-decoration: none;

  &:hover  {
    background-color: #8383cf;
  }
  
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  line-height: 1.2;
  min-height: 44px;
  `;
