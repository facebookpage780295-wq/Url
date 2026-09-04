import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  BarChart2, 
  Sparkles, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  AlertCircle,
  QrCode,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  createShortLink, 
  fetchRecentLinks, 
  extractDomain 
} from '../services/linkService';
import { AdSpace } from './AdSpace';
import { SeoContentSection } from './SeoContentSection';
import type { ShortLink } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [urlInput, setUrlInput] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<ShortLink | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [recentLinks, setRecentLinks] = useState<ShortLink[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Load recent links on mount
  const loadRecent = async () => {
    setLoadingRecent(true);
    try {
      const list = await fetchRecentLinks();
      setRecentLinks(list);
    } catch (err) {
      console.warn('Failed to load recent links:', err);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const getFullShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`;
  };

  const handleCopy = async (code: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      setError('Please provide a destination URL to shorten.');
      return;
    }

    setSubmitting(true);
    try {
      const alias = showCustomAlias && customAlias.trim() ? customAlias.trim() : undefined;
      const result = await createShortLink(trimmedUrl, alias);
      setCreatedLink(result);
      setUrlInput('');
      setCustomAlias('');
      setShowCustomAlias(false);
      // Refresh list
      await loadRecent();
    } catch (err: any) {
      setError(err?.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Main Shortening Card (Link paste & copy box on top) */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden mb-8">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Paste &amp; Shorten URL
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main URL Input Box */}
          <div>
            <label htmlFor="long-url-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Destination URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-300">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                id="long-url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/very/long/destination/url-to-shorten"
                className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl pl-11 pr-24 py-3.5 text-sm sm:text-base text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              {/* Quick Paste or Clear */}
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                {urlInput ? (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="px-2.5 py-1 text-xs text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setUrlInput(text);
                      } catch {
                        // ignore clipboard denial
                      }
                    }}
                    className="px-2.5 py-1 text-xs text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-950/40 border border-emerald-800/40 transition-colors"
                  >
                    Paste
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Custom Alias Option */}
          <div className="pt-1">
            <button
              id="toggle-custom-alias-btn"
              type="button"
              onClick={() => setShowCustomAlias(!showCustomAlias)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showCustomAlias ? 'Hide custom alias' : 'Add custom alias (optional)'}</span>
            </button>

            {showCustomAlias && (
              <div className="mt-3 p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-150">
                <label htmlFor="custom-alias-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Custom Short Code (Alphanumeric, 3-30 chars)
                </label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-2 rounded-l-xl border border-r-0 border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono select-none">
                    {window.location.host}/
                  </span>
                  <input
                    id="custom-alias-input"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="my-cool-link"
                    maxLength={30}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-r-xl px-3 py-2 text-sm text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <button
            id="submit-shorten-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-zinc-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Shortening Link...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>Shorten URL</span>
              </>
            )}
          </button>
        </form>

        {/* Success / Result Notification Card */}
        {createdLink && (
          <div className="mt-6 pt-6 border-t border-zinc-800 animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/60">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Short link generated successfully!
                </span>
                <span className="text-[11px] font-mono text-zinc-300">
                  Code: <strong className="text-white">/{createdLink.shortCode}</strong>
                </span>
              </div>

              {/* Short Link Display and Copy Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                <div className="flex-1 bg-zinc-950/90 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between overflow-hidden">
                  <span className="font-mono text-sm sm:text-base font-semibold text-emerald-300 truncate">
                    {getFullShortUrl(createdLink.shortCode)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="copy-created-link-btn"
                    onClick={() => handleCopy(createdLink.shortCode, getFullShortUrl(createdLink.shortCode))}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-md"
                  >
                    {copiedCode === createdLink.shortCode ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    id="qr-created-link-btn"
                    onClick={() => setShowQrModal(true)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Test Countdown and View Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <p className="text-zinc-300 truncate max-w-xs sm:max-w-md">
                  Original: <span className="text-zinc-300 font-mono">{createdLink.originalUrl}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    id="created-link-stats-btn"
                    onClick={() => onNavigate(`/stats/${createdLink.shortCode}`)}
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Stats</span>
                  </button>
                  <span className="text-zinc-700">•</span>
                  <button
                    id="created-link-test-btn"
                    onClick={() => onNavigate(`/${createdLink.shortCode}`)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <span>Test 5s Countdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && createdLink && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Scan Short Link QR</h3>
            <p className="text-xs text-zinc-300 mb-4 font-mono">
              {getFullShortUrl(createdLink.shortCode)}
            </p>
            <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  getFullShortUrl(createdLink.shortCode)
                )}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Space */}
      <AdSpace slotId="ad-home-banner" size="banner" className="my-6" />

      {/* Recently Created Links Section */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Recently Created Links
            </h2>
          </div>
          <button
            id="refresh-recent-links-btn"
            onClick={loadRecent}
            disabled={loadingRecent}
            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors"
            title="Refresh links"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRecent ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loadingRecent ? (
          <div className="py-8 text-center text-zinc-300 text-xs">
            <div className="h-6 w-6 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-2" />
            Loading links...
          </div>
        ) : recentLinks.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl p-6">
            <Link2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-zinc-300 text-xs font-medium">No shortened links yet.</p>
            <p className="text-zinc-300 text-[11px] mt-0.5">
              Paste a long URL in the field above to create your first protected short link!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLinks.map((item) => {
              const fullUrl = getFullShortUrl(item.shortCode);
              const domain = extractDomain(item.originalUrl);
              const isCopied = copiedCode === item.shortCode;

              return (
                <div
                  key={item.shortCode}
                  className="bg-zinc-950/70 border border-zinc-800/70 hover:border-zinc-700/80 rounded-xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                        /{item.shortCode}
                      </span>
                      <span className="text-xs font-medium text-zinc-300 truncate">
                        {domain}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 truncate font-mono">
                      {item.originalUrl}
                    </p>
                  </div>

                  {/* Right side stats & actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800/60 shrink-0">
                    {/* Clicks badge */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono"
                      title="Total click count"
                    >
                      <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-white">{item.clicks}</span>
                      <span className="text-[10px] text-zinc-300">clicks</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item.shortCode, fullUrl)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                        title="Copy short link"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onNavigate(`/stats/${item.shortCode}`)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                        title="View click statistics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onNavigate(`/${item.shortCode}`)}
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-800/40 transition-colors"
                        title="Visit short code (5s countdown)"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hero Header (Moved to the very bottom) */}
      <div className="text-center max-w-2xl mx-auto my-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protected Countdown Redirection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
          Shorten Links with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Mandatory Countdown
          </span>
        </h1>
        <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
          Create short, memorable links backed by a mandatory 5-second waiting page and real-time click analytics.
        </p>
      </div>

      {/* SEO Informational & FAQ Section */}
      <SeoContentSection />

      {/* Footer Info */}
      <footer className="mt-12 text-center text-xs text-zinc-300 border-t border-zinc-800/80 pt-6">
        <p>
          URL Shortener with 5-Second Countdown Redirection Protection. Built with React &amp; Firebase Firestore.
        </p>
      </footer>
    </main>
  );
};
