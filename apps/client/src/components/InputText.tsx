import type { ChangeEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type InputTextProps = {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: ReactNode;
};
export function InputText({
  id,
  label,
  value,
  onChange,
  error,
}: InputTextProps) {
  const errorMessageId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        <Input
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          aria-errormessage={errorMessageId}
          $errorOccurred={!!error}
        />
      </Label>
      {error && <ErrorMessage id={errorMessageId}>{error}</ErrorMessage>}
    </div>
  );
}

type InputProps = {
  $errorOccurred: boolean;
};
const Input = styled.input<InputProps>`
  ${({ $errorOccurred }) =>
    $errorOccurred &&
    css`
      border-color: red;
      background-color: #ffcccc;
    `}
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;
