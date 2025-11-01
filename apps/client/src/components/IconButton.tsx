import type { ComponentProps, ReactElement } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import type { IconType } from './Icon';
import { Icon } from './Icon';

type IconButtonProps = Pick<
  ComponentProps<typeof Button>,
  'className' | 'loading' | 'onClick'
> & { ariaLabel: string; type: IconType };
export function IconButton({
  ariaLabel,
  onClick,
  type,
  className,
  loading = false,
}: IconButtonProps): ReactElement {
  return (
    <StyledButton
      onClick={onClick}
      className={className}
      loading={loading}
      ariaLabel={ariaLabel}
    >
      <Icon type={type} size={32} />
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
    border-radius: 50%;
    padding: 4px;
`;
