import { useState } from 'react';
import { User } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EEE9FF] via-[#F4F5F8] to-[#FCECF1] text-[#17243A] p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/80 border border-[#E4E6F0] flex items-center justify-center mb-3">
          <User className="w-6 h-6 text-[#7256D9]" aria-hidden="true" />
        </div>
        {fallbackLabel && (
          <span className="text-sm font-medium text-[#20243A]">{fallbackLabel}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
