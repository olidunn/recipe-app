import { describe, expect, it } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import { InputNumber } from '~/components/InputNumber';

describe('InputNumber', () => {
  it('onChange is called with an integer when input is a valid integer', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.blur(input);
    expect(value).toBe(42);
  });

  it('onChange is not called when input is invalid', () => {
    let value = 123;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42a' } });
    fireEvent.blur(input);
    expect(value).toBe(123);
  });

  it('onChange is called with 0 when input is cleared', () => {
    let value = 42;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(value).toBe(0);
  });

  it('onChange is not called when input is invalid and nullable is true', () => {
    let value = 123 as number | null;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue) => {
          value = newValue;
        }}
        nullable
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42a' } });
    fireEvent.blur(input);
    expect(value).toBe(123);
  });

  it('onChange is called with null when input is cleared and nullable is true', () => {
    let value = 42 as number | null;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue) => {
          value = newValue;
        }}
        nullable
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(value).toBe(null);
  });

  it('onChange is called with 0 when input is 0 and nullable is true', () => {
    let value = 42 as number | null;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue) => {
          value = newValue;
        }}
        nullable
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);
    expect(value).toBe(0);
  });

  it('onChange truncates to 2 decimals when maxDecimals is 2', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
        totalDecimals={2}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42.122' } });
    fireEvent.blur(input);
    expect(value).toBe(42.12);
  });

  it('onChange rounds to 3 decimals when maxDecimals is 3', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
        totalDecimals={3}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42.1229' } });
    fireEvent.blur(input);
    expect(value).toBe(42.123);
  });

  it('onChange prevents decimals when maxDecimals is 0', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '42.92' } });
    fireEvent.blur(input);
    expect(value).toBe(43);
  });

  it('throws an error when maxDecimals is less than 0', () => {
    expect(() => {
      render(
        <InputNumber
          label="Test"
          value={0}
          onChange={() => {}}
          totalDecimals={-1}
        />,
      );
    }).toThrow('maxDecimals must be 0 or greater');
  });

  it('onChange is called with a negative number when allowNegativeValues is true and input is a valid negative number', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
        allowNegativeValues
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '-42' } });
    fireEvent.blur(input);
    expect(value).toBe(-42);
  });

  it('onChange is called with a positive number when allowNegativeValues is false and input is a valid negative number', () => {
    let value = 0;

    const { getByRole } = render(
      <InputNumber
        label="Test"
        value={value}
        onChange={(newValue: number) => {
          value = newValue;
        }}
        allowNegativeValues={false}
      />,
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: '-42' } });
    fireEvent.blur(input);
    expect(value).toBe(42);
  });

  it('input element value updates when value prop changes', () => {
    let value = 0;

    function change(newValue: number) {
      value = newValue;
    }

    const { getByRole, rerender } = render(
      <InputNumber label="Test" value={value} onChange={change} />,
    );
    const input = getByRole('textbox');
    expect((input as HTMLInputElement).value).toBe('0');

    rerender(<InputNumber label="Test" value={42} onChange={change} />);
    expect((input as HTMLInputElement).value).toBe('42');
  });

  it('selects all text when focused', () => {
    const { getByRole } = render(
      <InputNumber label="Test" value={42} onChange={() => {}} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;

    fireEvent.focus(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('42'.length);
  });

  /**
   * Safari bug workaround: Safari fires mousedown → focus → click when clicking
   * an unfocused input. The click repositions the cursor, undoing select() from
   * onFocus. We skip select() in onFocus for mouse clicks and defer it to onClick.
   * This test simulates that Safari-specific event sequence.
   */
  it('selects all text on first click (Safari: mousedown fires before focus)', () => {
    const { getByRole } = render(
      <InputNumber label="Test" value={42} onChange={() => {}} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;

    fireEvent.mouseDown(input);
    fireEvent.focus(input);
    input.setSelectionRange(1, 1);
    fireEvent.click(input);

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('42'.length);
  });

  it('does not re-select text on subsequent clicks while focused', () => {
    const { getByRole } = render(
      <InputNumber label="Test" value={42} onChange={() => {}} />,
    );
    const input = getByRole('textbox') as HTMLInputElement;

    fireEvent.focus(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('42'.length);

    // Simulate user repositioning cursor then clicking again
    input.setSelectionRange(1, 1);
    fireEvent.click(input);
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
  });
});
