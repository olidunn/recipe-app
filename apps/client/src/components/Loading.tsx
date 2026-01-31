import type { ComponentProps } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from './Icon';

type LoadingProps = Pick<ComponentProps<typeof Icon>, 'size'>;
export function Loading({ size }: LoadingProps) {
  return <SpinningIcon type="loading" size={size} />;
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinningIcon = styled(Icon)`
  animation: 1s ${rotate} linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
