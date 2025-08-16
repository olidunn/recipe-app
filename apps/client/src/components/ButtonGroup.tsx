import type { ReactNode } from 'react';
import styled from 'styled-components';

type ButtonGroupProps = {
  children: ReactNode;
};
export function ButtonGroup({ children }: ButtonGroupProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  padding-top: 10px;
`;
