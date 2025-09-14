import type {
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  ReactNode,
} from 'react';
import { useId } from 'react';
import styled, { css } from 'styled-components';

type InputTextProps = {
  label: string;
  value: string;
  type?: 'text' | 'password' | 'email';
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: ReactNode;
  autoComplete?: HTMLInputAutoCompleteAttribute;
};
export function InputText({
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: InputTextProps) {
  const id = useId();
  const errorMessageId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        <Input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          aria-errormessage={errorMessageId}
          $errorOccurred={!!error}
          autoComplete={autoComplete}
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
