import type { CSSProperties, ReactElement } from 'react';

export type IconType = 'menu' | 'logout' | 'password' | 'loading';
type IconProps = {
  /**
   * @default 'currentColor'
   */
  color?: CSSProperties['color'];
  /**
   * @default 24
   */
  size?: number | undefined;
  type: IconType;
  className?: string;
};

export function Icon({
  type,
  color = 'currentColor',
  size = 24,
  className,
}: IconProps): ReactElement {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: This is hidden from aria
    <svg
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
      aria-hidden
      className={className}
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

    case 'loading':
      return (
        <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
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
