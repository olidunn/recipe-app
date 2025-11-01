import type { CSSProperties, ReactElement } from 'react';

export type IconType = 'menu';
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
  }
}
