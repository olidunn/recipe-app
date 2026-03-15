import type { ChangeEventHandler } from 'react';
import { useId } from 'react';
import styled, { css } from 'styled-components';
import type { RequiredAriaLabelProps } from '~/common/types';
import { FormControl } from '~/components/FormControl';
import { ValidationError } from '~/components/ValidationError';

type TextAreaProps = RequiredAriaLabelProps & {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  height?: number;
  errorMessage?: string | undefined;
};
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

type InnerTextAreaProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  height: number | undefined;
  errorMessage: string | undefined;
  label: string | undefined;
  ariaLabel: string | undefined;
};
function InnerTextArea({
  value,
  onChange,
  height,
  errorMessage,
  label,
  ariaLabel,
}: InnerTextAreaProps) {
  const id = useId();
  const errorMessageId = `${id}-error`;

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
        aria-label={ariaLabel || label}
      />
      {errorMessage && (
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
