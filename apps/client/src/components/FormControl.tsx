import type { ReactElement, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type FormControlProps = {
  label: ReactNode;
  children: ReactNode;
  optional?: boolean;
  fitContent?: boolean;
  inputFirst?: boolean;
  loading?: boolean;
};
export function FormControl({
  label,
  children,
  optional = false,
  fitContent = false,
  inputFirst = false,
  loading = false,
}: FormControlProps): ReactElement {
  return (
    <Label fitContent={fitContent} inputFirst={inputFirst} loading={loading}>
      {inputFirst && children}
      <LabelText>
        {label}
        {optional && <Optional aria-hidden>(optional)</Optional>}
      </LabelText>
      {!inputFirst && children}
    </Label>
  );
}

type LabelProps = {
  fitContent?: boolean;
  inputFirst?: boolean;
  loading?: boolean;
};
const Label = styled.label<LabelProps>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  cursor: pointer;

  ${({ fitContent }) =>
    fitContent &&
    css`
      max-width: fit-content;
    `};

  ${({ inputFirst }) =>
    inputFirst &&
    css`
      flex-direction: row;
      align-items: center;
      gap: 8px;
    `};

  ${({ loading }) =>
    loading &&
    css`
      cursor: wait;
    `};
`;

const LabelText = styled.div`
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Optional = styled.span`
  font-size: 12px;
  font-weight: 400;
`;
