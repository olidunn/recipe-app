import type { ChangeEventHandler } from 'react';
import { useId } from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage } from '~/components/InputText';

type TextAreaProps = {
  label: string;
  height?: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  errorMessage?: string | undefined;
};
export function TextArea({
  label,
  height,
  onChange,
  value,
  errorMessage,
}: TextAreaProps) {
  const id = useId();
  const errorMessageId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        <StyledTextArea
          $height={height}
          onChange={onChange}
          value={value}
          id={id}
          $errorOccurred={!!errorMessage}
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessageId}
        />
      </Label>
      {errorMessage && (
        <ErrorMessage id={errorMessageId}>{errorMessage}</ErrorMessage>
      )}
    </div>
  );
}

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

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
