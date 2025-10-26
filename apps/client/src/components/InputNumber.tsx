import type { ChangeEvent, FocusEvent, ReactElement } from 'react';
import { useId, useState } from 'react';
import { ErrorMessage, Input, Label } from '~/components/InputText';

type BaseInputNumberProps = {
  label: string;
  errorMessage?: string | undefined;
  optional?: boolean;
  /**
   * send null when the input is empty instead of 0
   */
  nullable?: boolean;
  disabled?: boolean;
  /**
   * @default 0
   */
  totalDecimals?: number;
  /**
   * @default false
   */
  allowNegatives?: boolean;
};

type NullableInputNumberProps = BaseInputNumberProps & {
  value: number | null;
  onChange: (value: number | null) => void;
  nullable: true;
};

type NonNullableInputNumberProps = BaseInputNumberProps & {
  value: number;
  onChange: (value: number) => void;
  nullable?: false;
};

type InputNumberProps = NullableInputNumberProps | NonNullableInputNumberProps;

export function InputNumber({
  label,
  onChange,
  value,
  errorMessage,
  optional = false,
  nullable = false,
  disabled = false,
  totalDecimals = 0,
  allowNegatives = false,
}: InputNumberProps): ReactElement {
  const id = useId();
  const errorMessageId = `${id}-error`;

  if (totalDecimals < 0) {
    throw new Error('maxDecimals must be 0 or greater');
  }

  const [localValue, setLocalValue] = useState(
    value === null ? '' : `${value}`,
  );

  function change(event: ChangeEvent<HTMLInputElement>): void {
    setLocalValue(event.target.value);
  }

  function blur(event: FocusEvent<HTMLInputElement>): void {
    if (nullable && event.target.value === '') {
      (onChange as (_value: number | null) => void)(null);
      return;
    }

    const numericValue = allowNegatives
      ? Number(event.target.value)
      : Math.abs(Number(event.target.value));

    if (Number.isNaN(numericValue)) {
      setLocalValue(value === null ? '' : `${value}`);
    } else {
      const roundedNumber = Number(numericValue.toFixed(totalDecimals));
      onChange(Number(roundedNumber));
      setLocalValue(`${roundedNumber}`);
    }
  }

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        <Input
          className="InputNumber"
          type="text"
          inputMode={totalDecimals === 0 ? 'numeric' : 'decimal'}
          value={localValue}
          onChange={change}
          onBlur={blur}
          required={!optional}
          aria-invalid={!!errorMessageId}
          $errorOccurred={!!errorMessage}
          aria-errormessage={errorMessageId}
          disabled={disabled}
        />
      </Label>
      {errorMessage && (
        <ErrorMessage id={errorMessageId}>{errorMessage}</ErrorMessage>
      )}
    </div>
  );
}
