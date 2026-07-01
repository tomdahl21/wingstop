/**
 * Brand-hand icon set for the guest order tracker — drawn in-house so the highest-emotion
 * surface isn't rendered in system emoji (design-bar: emoji-as-iconography is a tell).
 * Single-color, currentColor, 24×24, consistent 2px stroke weight.
 */

type IconProps = { size?: number; className?: string };

function svg(size: number, className: string | undefined, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconPlaced({ size = 16, className }: IconProps) {
  return svg(size, className, <><path d="M20 6 9 17l-5-5" /></>);
}

export function IconCooking({ size = 16, className }: IconProps) {
  // flame
  return svg(
    size,
    className,
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .4-1.8 1-2.5.3 1 .9 1.5 1.5 1.5-.5-2.5 .5-5 1.5-7Z" fill="currentColor" stroke="none" />,
  );
}

export function IconSauced({ size = 16, className }: IconProps) {
  // ranch bottle — the brand nod
  return svg(
    size,
    className,
    <>
      <path d="M9.5 3h5v2.2c0 .5.3 1 .8 1.4C16.5 7.5 17 8.6 17 10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8c0-1.4.5-2.5 1.7-3.4.5-.4.8-.9.8-1.4V3Z" />
      <path d="M7.5 12h9" />
    </>,
  );
}

export function IconBagged({ size = 16, className }: IconProps) {
  return svg(
    size,
    className,
    <>
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 20L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
  );
}

export function IconDriver({ size = 16, className }: IconProps) {
  return svg(
    size,
    className,
    <>
      <path d="M3 13l1.6-4.2A2 2 0 0 1 6.5 7.5h7a2 2 0 0 1 1.9 1.3L17 13h2a1 1 0 0 1 1 1v3h-2" />
      <path d="M6 17H3v-4h14v4h-3" />
      <circle cx="8" cy="17" r="1.6" />
      <circle cx="16" cy="17" r="1.6" />
    </>,
  );
}

export function IconHome({ size = 16, className }: IconProps) {
  return svg(
    size,
    className,
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
    </>,
  );
}

export function IconReceipt({ size = 16, className }: IconProps) {
  return svg(
    size,
    className,
    <>
      <path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3L6 21V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>,
  );
}

/** The six tracker steps in order. */
export const TRACK_ICONS = [IconPlaced, IconCooking, IconSauced, IconBagged, IconDriver, IconHome];
export const TRACK_LABELS = ["Placed", "Cooking", "Sauced", "Bagged", "On the way", "Delivered"];
