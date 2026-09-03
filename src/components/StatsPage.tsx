import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  MousePointerClick, 
  ArrowLeft, 
  Search, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { fetchLink, extractDomain } from '../services/linkService';
import { AdSpace } from './AdSpace';
import type { ShortLink } from '../types';

interface StatsPageProps {
  initialShortCode: string;
  onNavigate: (path: string) => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ initialShortCode, onNavigate }) => {
  const [code, setCode] = useState(initialShortCode);
  const [searchInput, setSearchInput] = useState(initialShortCode);
  const [linkData, setLinkData] = useState<ShortLink | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) {
      setLinkData(null);
      return;
    }

    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      const data = await fetchLink(code);
      if (!isMounted) return;

      if (!data) {
        setError(`No link found for short code "${code}".`);
        setLinkData(null);
      } else {
        setLinkData(data);
      }
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().replace(/^\/+/, '').replace(/^stats\//, '');
    if (!clean) return;
    setCode(clean);
    onNavigate(`/stats/${clean}`);
  };

  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    try {
      if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header breadcrumb & back */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="stats-back-home"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shortener</span>
        </button>

        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          Link Analytics
        </span>
      </div>

      {/* Search any code */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="stats-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter short code to inspect (e.g. xY79Za)..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
            />
          </div>
          <button
            id="stats-search-btn"
            type="submit"
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition-all shrink-0 border border-zinc-700"
          >
            Inspect
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-16 text-center">
          <div className="h-10 w-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-300 text-sm">Fetching statistics from Firestore...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Code Not Found</h2>
          <p className="text-zinc-300 text-sm mb-6">{error}</p>
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all"
          >
            Create a New Link
          </button>
        </div>
      )}

      {!loading && !error && linkData && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {/* Top metrics header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-300">
                    Short Code
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                    /{linkData.shortCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-300 truncate max-w-xs sm:max-w-md">
                    {getFullShortUrl(linkData.shortCode)}
                  </span>
                  <button
                    id="stats-copy-short-btn"
                    onClick={() => handleCopy(getFullShortUrl(linkData.shortCode))}
                    className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Copy short link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="stats-test-redirect-btn"
                  onClick={() => onNavigate(`/${linkData.shortCode}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-md"
                >
                  <span>Test Countdown</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metric cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {/* Total Clicks */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between text-zinc-300 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Clicks</span>
                  <MousePointerClick className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                  {linkData.clicks}
                </div>
                <p className="text-[11px] text-zinc-300 mt-1">Verified redirections</p>
              </div>

              {/* Created At */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between text-zinc-300 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Created Date</span>
                  <Calendar className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatDate(linkData.createdAt)}
                </div>
                <p className="text-[11px] text-zinc-300 mt-1">Initial registration</p>
              </div>

              {/* Last Clicked */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between text-zinc-300 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Last Clicked</span>
                  <Clock className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatDate(linkData.lastClickedAt)}
                </div>
                <p className="text-[11px] text-zinc-300 mt-1">Most recent visit</p>
              </div>
            </div>

            {/* Destination URL preview */}
            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Original Target Destination
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {extractDomain(linkData.originalUrl)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-zinc-300 break-all select-all">
                  {linkData.originalUrl}
                </p>
                <a
                  href={linkData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                  title="Open original URL in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Ad banner placeholder */}
          <AdSpace slotId="ad-stats-banner" size="banner" />
        </div>
      )}

      {!loading && !linkData && !error && (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-10 text-center">
          <BarChart3 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white mb-1">Enter a Short Code</h2>
          <p className="text-xs text-zinc-300 max-w-sm mx-auto">
            Input any 6-character code or custom alias above to view real-time click volume and link telemetry.
          </p>
        </div>
      )}
    </main>
  );
};
