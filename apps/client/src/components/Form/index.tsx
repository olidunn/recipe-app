import { ReactNode } from "react";
import styled from "styled-components";

type FormProps = {
  children: ReactNode;
};
export function Form({ children }: FormProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
