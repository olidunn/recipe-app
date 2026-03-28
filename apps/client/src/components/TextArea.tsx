import { kebabCase } from '@recipe-app/common';
import type { ChangeEventHandler } from 'react';
import styled, { css } from 'styled-components';
import type {
  InnerRequiredAriaLabelProps,
  RequiredAriaLabelProps,
} from '~/common/utils/component';
import { getAriaLabel } from '~/common/utils/component';
import { FormControl } from '~/components/FormControl';
import { ValidationError } from '~/components/ValidationError';

type BaseTextAreaProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  height?: number | undefined;
  errorMessage?: string | undefined;
};

type TextAreaProps = BaseTextAreaProps & RequiredAriaLabelProps;

export function TextArea({
  value,
  onChange,
  height,
  errorMessage,
  label,
  ariaLabel,
}: TextAreaProps) {
  if (label) {
    return (
      <FormControl label={label}>
        <InnerTextArea
          value={value}
          onChange={onChange}
          height={height}
          errorMessage={errorMessage}
          label={label}
          ariaLabel={ariaLabel}
        />
      </FormControl>
    );
  }

  return (
    <InnerTextArea
      value={value}
      onChange={onChange}
      height={height}
      errorMessage={errorMessage}
      label={label}
      ariaLabel={ariaLabel}
    />
  );
}

function InnerTextArea({
  value,
  onChange,
  height,
  errorMessage,
  label,
  ariaLabel: propAriaLabel,
}: InnerRequiredAriaLabelProps<BaseTextAreaProps>) {
  const ariaLabel = getAriaLabel(label, propAriaLabel);
  const id = `${kebabCase(ariaLabel)}-input-text`;
  const errorMessageId = errorMessage ? `${id}-error` : undefined;

  return (
    <>
      <StyledTextArea
        $height={height}
        onChange={onChange}
        value={value}
        id={id}
        $errorOccurred={!!errorMessage}
        aria-invalid={!!errorMessage}
        aria-errormessage={errorMessageId}
        aria-label={ariaLabel}
      />
      {errorMessageId && errorMessage && (
        <ValidationError id={errorMessageId} message={errorMessage} />
      )}
    </>
  );
}

type StyledTextAreaProps = {
  $errorOccurred: boolean;
  $height?: number | undefined;
};
const StyledTextArea = styled.textarea<StyledTextAreaProps>`
  ${({ $height }) => $height && `min-height: ${$height}px`};
  ${({ $errorOccurred }) =>
    $errorOccurred &&
    css`
      border-color: red;
      background-color: #ffcccc;
    `};
`;
