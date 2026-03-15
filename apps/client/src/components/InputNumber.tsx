import type { CSSProperties, FocusEvent, ReactElement } from 'react';
import { useEffect, useId, useRef } from 'react';
import type { RequiredAriaLabelProps } from '~/common/types';
import type { FormControlProps } from '~/components/FormControl';
import { FormControl } from '~/components/FormControl';
import { Input } from '~/components/InputText';
import { ValidationError } from '~/components/ValidationError';

type BaseInputNumberProps = RequiredAriaLabelProps &
  Pick<FormControlProps, 'inputFirst' | 'optional'> & {
    errorMessage?: string | undefined;
    disabled?: boolean;
    /**
     * @default 0
     */
    totalDecimals?: number;
    /**
     * @default false
     */
    allowNegative?: boolean;
    minValue?: number | undefined;
    maxValue?: number | undefined;
    style?: CSSProperties | undefined;
  };

type NullableInputNumberProps = BaseInputNumberProps & {
  value: number | null;
  onChange: (value: number | null) => void;
  /**
   * send null when the input is empty instead of 0
   */
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
  ariaLabel,
  onChange,
  value,
  errorMessage,
  optional = false,
  nullable = false,
  disabled = false,
  totalDecimals = 0,
  allowNegative = false,
  minValue,
  maxValue,
  inputFirst = false,
  style,
}: InputNumberProps): ReactElement {
  if (label) {
    return (
      <FormControl optional={optional} label={label} inputFirst={inputFirst}>
        <InnerInputNumber
          label={label}
          ariaLabel={ariaLabel}
          value={value}
          onChange={onChange}
          optional={optional}
          nullable={nullable}
          errorMessage={errorMessage}
          disabled={disabled}
          totalDecimals={totalDecimals}
          allowNegative={allowNegative}
          minValue={minValue}
          maxValue={maxValue}
          style={style}
        />
      </FormControl>
    );
  }

  return (
    <InnerInputNumber
      label={label}
      ariaLabel={ariaLabel}
      value={value}
      onChange={onChange}
      optional={optional}
      nullable={nullable}
      errorMessage={errorMessage}
      disabled={disabled}
      totalDecimals={totalDecimals}
      allowNegative={allowNegative}
      minValue={minValue}
      maxValue={maxValue}
      style={style}
    />
  );
}

type InnerInputNumberProps = {
  value: number | null;
  onChange: ((value: number | null) => void) | ((value: number) => void);
  errorMessage: string | undefined;
  optional: boolean;
  nullable: boolean;
  disabled: boolean;
  totalDecimals: number;
  allowNegative: boolean;
  minValue: number | undefined;
  maxValue: number | undefined;
  label: string | undefined;
  ariaLabel: string | undefined;
  style: CSSProperties | undefined;
};

function InnerInputNumber({
  value,
  onChange,
  errorMessage,
  optional,
  nullable,
  disabled,
  totalDecimals,
  allowNegative,
  minValue,
  maxValue,
  label,
  ariaLabel,
  style,
}: InnerInputNumberProps): ReactElement {
  const id = useId();
  const errorMessageId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);

  // HACK: Unlike other browsers, Safari fires `focus` then `click`
  // when clicking an unfocused input, so the cursor position set by the subsequent
  // `click` event overwrites the `select()` call in `onFocus`. We work around this
  // by deferring `select()` to `onClick` when focus originates from a mouse click.
  // See the test for more details.
  const isMouseClickFocusRef = useRef(false);

  useEffect(() => {
    if (inputRef.current && prevValueRef.current !== value) {
      inputRef.current.value = normalizeValue(value);
    }

    prevValueRef.current = value;
  }, [value]);

  if (totalDecimals < 0) {
    throw new Error('maxDecimals must be 0 or greater');
  }

  function blur(event: FocusEvent<HTMLInputElement>): void {
    if (nullable && event.target.value === '') {
      (onChange as (_value: number | null) => void)(null);
      return;
    }

    const numericValue = allowNegative
      ? Number(event.target.value)
      : Math.abs(Number(event.target.value));

    if (Number.isNaN(numericValue)) {
      // Reset to the previous valid value
      event.target.value = normalizeValue(value);
      return;
    }

    let roundedNumber = Number(numericValue.toFixed(totalDecimals));

    if (maxValue && roundedNumber > maxValue) {
      roundedNumber = maxValue;
    } else if (minValue && roundedNumber < minValue) {
      roundedNumber = minValue;
    }

    event.target.value = String(roundedNumber);
    onChange(Number(roundedNumber));
  }

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        inputMode={totalDecimals === 0 ? 'numeric' : 'decimal'}
        onMouseDown={(event) => {
          if (document.activeElement !== event.currentTarget) {
            isMouseClickFocusRef.current = true;
          }
        }}
        onFocus={(event) => {
          if (!isMouseClickFocusRef.current) {
            event.currentTarget.select(); // If safari fixes the bug, then this line is all that's needed
          }
        }}
        onClick={(event) => {
          if (isMouseClickFocusRef.current) {
            isMouseClickFocusRef.current = false;
            event.currentTarget.select();
          }
        }}
        onBlur={(event) => {
          isMouseClickFocusRef.current = false;
          blur(event); // If safari fixes the bug, then this line is all that's needed
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
            event.currentTarget.focus();
            event.currentTarget.select();
          }
        }}
        defaultValue={normalizeValue(value)}
        required={!optional}
        aria-invalid={!!errorMessageId}
        aria-errormessage={errorMessageId}
        disabled={disabled}
        aria-label={ariaLabel || label}
        style={style}
        $errorOccurred={!!errorMessage}
      />
      {errorMessageId && errorMessage && (
        <ValidationError id={errorMessageId} message={errorMessage} />
      )}
    </>
  );
}

function normalizeValue(value: number | null): string {
  return value !== null ? String(value) : '';
}
