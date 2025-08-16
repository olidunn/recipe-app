import type { ChangeEventHandler } from 'react';
import styled from 'styled-components';

type TextAreaProps = {
  id: string;
  label: string;
  height?: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
};
export function TextArea({
  id,
  label,
  height,
  onChange,
  value,
}: TextAreaProps) {
  return (
    <Label htmlFor={id}>
      {label}
      <StyledTextArea
        $height={height}
        onChange={onChange}
        value={value}
        id={id}
      />
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

type StyledTextAreaProps = {
  $height?: number;
};
const StyledTextArea = styled.textarea<StyledTextAreaProps>`
  ${({ $height }) => $height && `min-height: ${$height}px`}
`;
