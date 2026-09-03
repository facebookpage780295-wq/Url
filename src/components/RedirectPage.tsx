import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, ArrowLeft, Lock } from 'lucide-react';
import { fetchLink, incrementLinkClicks, extractDomain } from '../services/linkService';
import { AdSpace } from './AdSpace';
import type { ShortLink } from '../types';

interface RedirectPageProps {
  shortCode: string;
  onNavigateHome: () => void;
}

export const RedirectPage: React.FC<RedirectPageProps> = ({ shortCode, onNavigateHome }) => {
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<ShortLink | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [hasRedirected, setHasRedirected] = useState(false);
  const clickCountedRef = useRef(false);

  // 1. Fetch link on load
  useEffect(() => {
    let isMounted = true;
    async function loadLink() {
      setLoading(true);
      const data = await fetchLink(shortCode);
      if (!isMounted) return;

      if (!data) {
        setNotFound(true);
        setLoading(false);
      } else {
        setLink(data);
        setNotFound(false);
        setLoading(false);

        // Requirement: Increment the "clicks" field on every visit to /:shortCode before redirecting
        if (!clickCountedRef.current) {
          clickCountedRef.current = true;
          incrementLinkClicks(shortCode);
        }
      }
    }

    loadLink();
    return () => {
      isMounted = false;
    };
  }, [shortCode]);

  // 2. Mandatory 5-second countdown timer. No skip, no bypass.
  useEffect(() => {
    if (loading || notFound || !link) return;

    // Strict 1-second interval
    const interval = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, notFound, link]);

  // 3. Trigger redirect only when secondsRemaining === 0
  useEffect(() => {
    if (secondsRemaining === 0 && link && !hasRedirected) {
      setHasRedirected(true);
      // Small tick delay to let the UI reflect "0" and "Redirecting..." before navigating
      const timeout = setTimeout(() => {
        try {
          window.location.href = link.originalUrl;
        } catch (err) {
          console.error('Redirect failed:', err);
        }
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [secondsRemaining, link, hasRedirected]);

  // 4. Block keyboard shortcuts that could attempt to bypass the timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'ArrowRight', 'Tab'].includes(e.key)) {
        if (secondsRemaining > 0) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [secondsRemaining]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 rounded-full border-3 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
        <p className="text-zinc-200 text-sm font-medium">Resolving short link destination...</p>
      </div>
    );
  }

  // Not found state
  if (notFound || !link) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="h-16 w-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
          <p className="text-zinc-200 text-sm mb-6 leading-relaxed">
            The short code <span className="font-mono text-amber-400 font-semibold px-2 py-0.5 bg-zinc-800 rounded">/{shortCode}</span> does not exist or may have expired.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="not-found-home-btn"
              onClick={onNavigateHome}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Create a New Link
            </button>
          </div>
        </div>

        {/* Ad space placeholder */}
        <AdSpace slotId="ad-404-placeholder" size="banner" className="mt-8" />
      </main>
    );
  }

  const destinationDomain = extractDomain(link.originalUrl);
  const totalDuration = 5;
  const progressRatio = (totalDuration - secondsRemaining) / totalDuration;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Ad Space */}
      <AdSpace slotId="ad-top-banner" size="banner" className="mb-6" />

      <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Trust header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Secure Destination</span>
          </div>

          <h1 className="text-sm uppercase tracking-wider text-zinc-300 font-semibold mb-2">
            You will be redirected to:
          </h1>

          <div className="inline-flex items-center max-w-full gap-2 px-4 py-2 rounded-xl bg-zinc-950/90 border border-zinc-700/80 text-white font-medium text-base sm:text-lg mb-6 shadow-inner">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-md font-mono text-emerald-400">
              {destinationDomain}
            </span>
          </div>

          {/* Full destination preview (clipped for safety) */}
          <p className="text-xs text-zinc-300 truncate max-w-md mx-auto mb-8">
            Target URL:{' '}
            <span className="font-mono text-zinc-200 underline decoration-zinc-700">
              {link.originalUrl}
            </span>
          </p>
        </div>

        {/* Circular Countdown Display */}
        <div className="flex flex-col items-center justify-center my-4 relative z-10">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background circle track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner countdown number or redirect status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {secondsRemaining > 0 ? (
                <>
                  <span className="font-mono text-5xl font-extrabold text-white tracking-tight">
                    {secondsRemaining}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-300 font-medium mt-0.5">
                    Seconds
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-1" />
                  <span className="text-xs font-semibold text-emerald-400 tracking-wide">
                    Redirecting...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Text status */}
          <div className="mt-5 text-center">
            <p className="text-base font-semibold text-zinc-200">
              {secondsRemaining > 0 ? (
                <>
                  Redirecting in{' '}
                  <span className="text-emerald-400 font-mono font-bold">
                    {secondsRemaining}
                  </span>{' '}
                  {secondsRemaining === 1 ? 'second' : 'seconds'}...
                </>
              ) : (
                <span className="text-emerald-400">Opening destination URL...</span>
              )}
            </p>

            {/* Linear progress bar */}
            <div className="w-48 sm:w-64 h-1.5 bg-zinc-800 rounded-full mx-auto mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Security / Mandatory Wait notice (Strictly stating no skip allowed) */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-300 font-medium mb-1">
            <Lock className="w-3.5 h-3.5 text-zinc-300" />
            <span>Mandatory Security Delay Active (5 Seconds)</span>
          </div>
          <p className="text-[11px] text-zinc-300 max-w-sm mx-auto">
            This verification buffer protects against malicious bots, automated scrapers, and phishing scams. Manual skipping is disabled.
          </p>

          {/* If the timer finished and browser didn't redirect (e.g. sandbox popup blocker) */}
          {secondsRemaining === 0 && (
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-300 mb-2">
                If redirection does not occur automatically:
              </p>
              <a
                id="manual-destination-link"
                href={link.originalUrl}
                target="_top"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
              >
                <span>Click here to continue to {destinationDomain}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Ad Space */}
      <AdSpace slotId="ad-bottom-banner" size="banner" className="mt-6" />
    </main>
  );
};
