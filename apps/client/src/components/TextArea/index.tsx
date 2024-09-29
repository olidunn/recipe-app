import { ChangeEventHandler } from "react";
import styled from "styled-components";

type TextAreaProps = {
  height?: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
};
export function TextArea({ height, onChange, value }: TextAreaProps) {
  return <StyledTextArea $height={height} onChange={onChange} value={value} />;
}

type StyledTextAreaProps = {
  $height?: number;
};
const StyledTextArea = styled.textarea<StyledTextAreaProps>`
  ${({ $height }) => $height && `min-height: ${$height}px`}
`;
