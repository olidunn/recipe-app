import type { ChangeEventHandler, HTMLInputAutoCompleteAttribute } from 'react';
import { useId } from 'react';
import styled, { css } from 'styled-components';

type InputTextProps = {
  label: string;
  value: string;
  type?: 'text' | 'password' | 'email';
  onChange: ChangeEventHandler<HTMLInputElement>;
  errorMessage?: string | undefined;
  autoComplete?: HTMLInputAutoCompleteAttribute;
};
export function InputText({
  label,
  value,
  onChange,
  errorMessage,
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
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessageId}
          $errorOccurred={!!errorMessage}
          autoComplete={autoComplete}
        />
      </Label>
      {errorMessage && (
        <ErrorMessage id={errorMessageId}>{errorMessage}</ErrorMessage>
      )}
    </div>
  );
}

type InputProps = {
  $errorOccurred: boolean;
};
export const Input = styled.input<InputProps>`
  ${({ $errorOccurred }) =>
    $errorOccurred &&
    css`
      border-color: red;
      background-color: #ffcccc;
    `}
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;
