import { ChangeEventHandler } from "react";
import styled from "styled-components";

type InputTextProps = {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};
export function InputText({ id, label, value, onChange }: InputTextProps) {
  return (
    <Label htmlFor={id}>
      {label}
      <input type="text" id={id} value={value} onChange={onChange} />
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;
