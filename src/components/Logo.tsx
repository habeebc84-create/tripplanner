interface LogoProps {
  size?: number;
}

/** Karnataka Yatra AI mark: a stepped temple gopuram under the sun. */
export default function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yatra-logo-grad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#yatra-logo-grad)" />
      <circle cx="47" cy="17" r="6" fill="#fff" opacity="0.9" />
      <path
        d="M18 52V36h6v-6h5v-6h6v6h5v6h6v16H18Z"
        fill="#fff"
      />
      <rect x="14" y="52" width="36" height="3.5" rx="1.75" fill="#fff" opacity="0.85" />
      <circle cx="32" cy="43" r="2.4" fill="#ea580c" />
    </svg>
  );
}
