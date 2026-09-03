import React from 'react';
import { Link2, BarChart3, PlusCircle } from 'lucide-react';
import type { AppRoute } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          id="nav-logo-button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg py-1 px-1.5 -ml-1.5 transition-colors"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-950/40">
            <Link2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">
              URL Shortener
            </span>
            <span className="text-[11px] text-zinc-300 -mt-1 block">
              Safe & Protected Links
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <button
            id="nav-create-btn"
            onClick={() => onNavigate('/')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRoute.view === 'home'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/60'
                : 'text-zinc-300 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Shorten</span>
          </button>
          
          <button
            id="nav-stats-btn"
            onClick={() => {
              // If we are already on a stats page or have a shortCode, stay, else navigate to home stats section
              if (currentRoute.view !== 'stats') {
                const recent = localStorage.getItem('url_shortener_recent_codes');
                if (recent) {
                  try {
                    const parsed = JSON.parse(recent);
                    if (parsed.length > 0) {
                      onNavigate(`/stats/${parsed[0]}`);
                      return;
                    }
                  } catch {
                    // ignore
                  }
                }
                onNavigate('/stats/');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRoute.view === 'stats'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/60'
                : 'text-zinc-300 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
