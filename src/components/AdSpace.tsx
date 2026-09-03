import React from 'react';

interface AdSpaceProps {
  slotId?: string;
  size?: 'banner' | 'medium-rectangle';
  className?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({
  slotId = 'ad-banner-placeholder',
  size = 'banner',
  className = '',
}) => {
  return (
    <div
      id={slotId}
      className={`relative mx-auto my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/50 p-4 text-center transition-all ${
        size === 'banner'
          ? 'w-full max-w-[728px] min-h-[90px]'
          : 'w-full max-w-[300px] min-h-[250px]'
      } ${className}`}
      role="region"
      aria-label="Advertisement Placeholder"
    >
      <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-zinc-300">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/70 animate-pulse"></span>
        <span>Ad Space</span>
      </div>
      <p className="mt-1 text-xs text-zinc-300">
        Reserved for AdSense / Sponsor Network banner
      </p>
      <span className="mt-1 font-mono text-[10px] text-zinc-300">
        {size === 'banner' ? '728 × 90 Leaderboard / Responsive' : '300 × 250 Medium Rectangle'}
      </span>
    </div>
  );
};
