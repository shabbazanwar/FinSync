// Icon mark reuses the same glyph as the Transactions nav icon
// (react-icons' HiOutlineSwitchHorizontal) so the brand mark and the
// in-app "sync" iconography stay visually consistent.
export function LogoMark({
  className = "h-8 w-8",
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect
        width="24"
        height="24"
        rx="6"
        className={inverse ? "fill-white" : "fill-emerald-600"}
      />
      <path
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        fill="none"
        className={inverse ? "stroke-emerald-600" : "stroke-white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  iconClassName = "h-8 w-8",
  textClassName = "text-xl font-bold text-emerald-700",
  inverse = false,
}: {
  iconClassName?: string;
  textClassName?: string;
  inverse?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={iconClassName} inverse={inverse} />
      <span className={textClassName}>FinSync</span>
    </span>
  );
}
