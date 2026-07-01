/** Wingstop wing mark + Lil Ranchie ranch-bottle avatar, inlined as SVG (from the design system). */

export function Wing({ size = 24, fill = "#fff" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M4 30c10-2 16-7 20-15 4 8 10 13 20 15-7 3-14 4-20 4S11 33 4 30Z"
        fill={fill}
      />
      <path
        d="M24 15c1.6 3.2 4 6 7.4 8.2-2.8.4-5.2.4-7.4.4-2.2 0-4.6 0-7.4-.4C20 21 22.4 18.2 24 15Z"
        fill={fill === "#fff" ? "#006341" : "#fff"}
      />
    </svg>
  );
}

export function Ranchie({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true">
      <rect x="30" y="8" width="36" height="12" rx="3" fill="#00B140" />
      <rect x="40" y="2" width="16" height="9" rx="2.5" fill="#006341" />
      <path
        d="M28 30c0-6 6-10 20-10s20 4 20 10v50c0 5-4 8-9 8H37c-5 0-9-3-9-8V30Z"
        fill="#fff"
        stroke="#E6EAE3"
      />
      <rect x="34" y="44" width="28" height="22" rx="4" fill="#006341" />
      <circle cx="43" cy="42" r="4.5" fill="#13180F" />
      <circle cx="59" cy="42" r="4.5" fill="#13180F" />
      <circle cx="44.5" cy="40.5" r="1.4" fill="#fff" />
      <circle cx="60.5" cy="40.5" r="1.4" fill="#fff" />
      <path d="M44 52c3 3 9 3 12 0" stroke="#00B140" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="50" r="3" fill="#FFB81C" opacity=".55" />
      <circle cx="66" cy="50" r="3" fill="#FFB81C" opacity=".55" />
    </svg>
  );
}
