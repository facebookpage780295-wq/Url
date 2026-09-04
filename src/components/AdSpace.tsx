import React, { useEffect, useRef } from 'react';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Only load the script inside banner slots (728x90)
    if (size !== 'banner') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 90px;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : 'aece64058f00df3646bc9064db883bc0',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://intermediatenormalconfederate.com/aece64058f00df3646bc9064db883bc0/invoke.js"></script>
          </body>
        </html>
      `;

      doc.open();
      doc.write(adHtml);
      doc.close();
    } catch (err) {
      console.warn('Ad iframe initialization error:', err);
    }
  }, [size]);

  if (size === 'banner') {
    return (
      <div
        id={slotId}
        className={`relative mx-auto my-6 flex flex-col items-center justify-center w-full max-w-[728px] overflow-hidden ${className}`}
        role="region"
        aria-label="Advertisement"
      >
        <div className="w-full flex justify-center items-center overflow-x-auto min-h-[90px] py-1">
          <iframe
            ref={iframeRef}
            title={`Advertisement-${slotId}`}
            width={728}
            height={90}
            style={{ border: 'none', overflow: 'hidden', display: 'block' }}
            scrolling="no"
          />
        </div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Advertisement</span>
      </div>
    );
  }

  return (
    <div
      id={slotId}
      className={`relative mx-auto my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/50 p-4 text-center transition-all w-full max-w-[300px] min-h-[250px] ${className}`}
      role="region"
      aria-label="Advertisement Placeholder"
    >
      <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-zinc-300">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/70 animate-pulse"></span>
        <span>Ad Space</span>
      </div>
      <p className="mt-1 text-xs text-zinc-300">
        300 × 250 Medium Rectangle
      </p>
    </div>
  );
};

