import type { CSSProperties, ReactElement } from 'react';

export type IconType = 'menu' | 'logout' | 'password';
type IconProps = {
  /**
   * @default 'currentColor'
   */
  color?: CSSProperties['color'];
  /**
   * @default 24
   */
  size?: number;
  type: IconType;
};

export function Icon({
  type,
  color = 'currentColor',
  size = 24,
}: IconProps): ReactElement {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: This is hidden from aria
    <svg
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
      aria-hidden
    >
      <IconPath type={type} />
    </svg>
  );
}

type IconPathProps = Pick<IconProps, 'type'>;

function IconPath({ type }: IconPathProps): ReactElement {
  switch (type) {
    case 'menu':
      return (
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      );

    case 'logout':
      return (
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
      );

    case 'password':
      return (
        <path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z" />
      );
  }
}
