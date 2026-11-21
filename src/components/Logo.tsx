interface LogoProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
}

export function Logo({ variant = 'dark', compact = false }: LogoProps) {
  const textColor = variant === 'light' ? 'text-[#FCFBFF]' : 'text-[#17243A]';

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${textColor}`}>
      <svg
        width={compact ? 26 : 30}
        height={compact ? 26 : 30}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M12.5 7.5C7.80558 7.5 4 11.3056 4 16C4 20.6944 7.80558 24.5 12.5 24.5C15.106 24.5 17.4384 23.3271 19 21.481"
          stroke="#7256D9"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M19.5 24.5C24.1944 24.5 28 20.6944 28 16C28 11.3056 24.1944 7.5 19.5 7.5C16.894 7.5 14.5616 8.67292 13 10.519"
          stroke={variant === 'light' ? '#F18AA8' : '#17243A'}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2.6" fill="#F18AA8" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight">Connectora</span>
    </span>
  );
}
