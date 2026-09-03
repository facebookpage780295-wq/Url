import React from 'react';
import { Link2, BarChart3, PlusCircle, LogIn, UserPlus, LogOut, User as UserIcon } from 'lucide-react';
import type { AppRoute } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo Section */}
        <button
          id="nav-logo-button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg py-1 px-1 transition-colors shrink-0"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-950/40 shrink-0">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-base tracking-tight text-white leading-tight whitespace-nowrap">
              URL Shortener
            </span>
            <span className="hidden sm:block text-[11px] text-zinc-400 leading-tight">
              Safe & Protected Links
            </span>
          </div>
        </button>

        {/* Right Nav & Auth Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <nav className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              id="nav-create-btn"
              onClick={() => onNavigate('/')}
              title="Shorten URL"
              className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRoute.view === 'home'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Shorten</span>
            </button>
            
            <button
              id="nav-stats-btn"
              onClick={() => {
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
              title="Analytics & Stats"
              className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRoute.view === 'stats'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          </nav>

          <div className="h-4 w-px bg-zinc-800/90 mx-0.5" />

          {/* User Auth Section at the top */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                id="nav-user-profile"
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-200 text-xs"
                title={user.email || 'User Profile'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {user.email ? user.email[0].toUpperCase() : <UserIcon className="w-3 h-3" />}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[130px] truncate hidden sm:inline text-zinc-300 font-medium">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                id="nav-logout-btn"
                onClick={() => logout()}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-800/40 transition-all flex items-center gap-1"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">লগ আউট</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>লগ ইন</span>
              </button>

              <button
                id="nav-signup-btn"
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                <span>সাইন আপ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

