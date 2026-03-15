import type {
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  ReactElement,
} from 'react';
import { useId } from 'react';
import styled, { css } from 'styled-components';
import type { RequiredAriaLabelProps } from '~/common/types';
import { FormControl } from '~/components/FormControl';
import { ValidationError } from '~/components/ValidationError';

type InputTextProps = RequiredAriaLabelProps & {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: 'text' | 'password' | 'email';
  errorMessage?: string | undefined;
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
};
export function InputText({
  value,
  onChange,
  type = 'text',
  errorMessage,
  autoComplete,
  label,
  ariaLabel,
}: InputTextProps): ReactElement {
  if (label) {
    return (
      <FormControl label={label}>
        <InnerInputText
          value={value}
          onChange={onChange}
          type={type}
          errorMessage={errorMessage}
          autoComplete={autoComplete}
          label={label}
          ariaLabel={ariaLabel}
        />
      </FormControl>
    );
  }

  return (
    <InnerInputText
      value={value}
      onChange={onChange}
      type={type}
      errorMessage={errorMessage}
      autoComplete={autoComplete}
      label={label}
      ariaLabel={ariaLabel}
    />
  );
}

type InnerInputTextProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: 'text' | 'password' | 'email';
  errorMessage: string | undefined;
  autoComplete: HTMLInputAutoCompleteAttribute | undefined;
  label: string | undefined;
  ariaLabel: string | undefined;
};

function InnerInputText({
  ariaLabel,
  autoComplete,
  errorMessage,
  label,
  onChange,
  type,
  value,
}: InnerInputTextProps): ReactElement {
  const id = useId();
  const errorMessageId = `${id}-error`;

  return (
    <>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={!!errorMessage}
        aria-errormessage={errorMessageId}
        $errorOccurred={!!errorMessage}
        autoComplete={autoComplete}
        aria-label={ariaLabel || label}
      />
      {errorMessage && (
        <ValidationError id={errorMessageId} message={errorMessage} />
      )}
    </>
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
