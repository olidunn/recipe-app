import { kebabCase } from '@recipe-app/common';
import type {
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  ReactElement,
} from 'react';
import styled, { css } from 'styled-components';
import type {
  InnerRequiredAriaLabelProps,
  RequiredAriaLabelProps,
} from '~/common/utils/component';
import { getAriaLabel } from '~/common/utils/component';
import { FormControl } from '~/components/FormControl';
import { ValidationError } from '~/components/ValidationError';

type BaseInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: 'text' | 'password' | 'email';
  errorMessage?: string | undefined;
  autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
};

type InputTextProps = BaseInputProps & RequiredAriaLabelProps;

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

function InnerInputText({
  ariaLabel: propAriaLabel,
  autoComplete,
  errorMessage,
  label,
  onChange,
  type,
  value,
}: InnerRequiredAriaLabelProps<BaseInputProps>): ReactElement {
  const ariaLabel = getAriaLabel(label, propAriaLabel);
  const id = `${kebabCase(ariaLabel)}-input-text`;
  const errorMessageId = errorMessage ? `${id}-error` : undefined;

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
        aria-label={ariaLabel}
      />
      {errorMessageId && errorMessage && (
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
    `};
`;
