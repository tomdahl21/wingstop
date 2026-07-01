/**
 * The actual Wingstop wordmark (img/wingstop-logo-green.svg, served from /public).
 * The asset is brand green; on dark/hunter surfaces pass `variant="white"` to render it
 * white via filter so it reads against the green.
 */

export function Logo({
  height = 24,
  variant = "green",
  className,
}: {
  height?: number;
  variant?: "green" | "white";
  className?: string;
}) {
  return (
    // Plain <img> (not next/image) — a single static SVG; no optimization needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/wingstop-logo-green.svg"
      alt="Wingstop"
      height={height}
      style={{
        height,
        width: "auto",
        filter: variant === "white" ? "brightness(0) invert(1)" : undefined,
      }}
      className={className}
    />
  );
}
