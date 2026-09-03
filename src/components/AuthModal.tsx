import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    setAuthModalTab,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('ইমেইল এবং পাসওয়ার্ড প্রদান করুন। (Please enter email and password)');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters)');
      return;
    }

    setLoading(true);
    try {
      if (authModalTab === 'login') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('Auth error:', error);
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrorMsg('ইমেইল বা পাসওয়ার্ড সঠিক নয়। (Invalid email or password)');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('এই ইমেইলে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। লগ ইন করুন। (Email already in use)');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('পাসওয়ার্ড অত্যন্ত ছোট, কমপক্ষে ৬ অক্ষর দিন।');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('সঠিক ইমেইল ফরম্যাট প্রদান করুন।');
      } else {
        setErrorMsg(error.message || 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('Google auth error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(error.message || 'Google দিয়ে সাইন ইন সম্পন্ন হয়নি।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            id="tab-btn-login"
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              authModalTab === 'login'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>লগ ইন (Log In)</span>
          </button>
          <button
            id="tab-btn-signup"
            type="button"
            onClick={() => {
              setAuthModalTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              authModalTab === 'signup'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>সাইন আপ (Sign Up)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          id="auth-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/80 text-zinc-100 text-sm font-medium transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google দিয়ে {authModalTab === 'login' ? 'লগ ইন' : 'সাইন আপ'} করুন</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-900 px-3 text-[11px] text-zinc-400 uppercase tracking-wider relative">
            অথবা ইমেইল দিয়ে
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              ইমেইল অ্যাড্রেস
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                পাসওয়ার্ড
              </label>
              {authModalTab === 'signup' && (
                <span className="text-[11px] text-zinc-400">কমপক্ষে ৬ অক্ষর</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-password-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>অপেক্ষা করুন...</span>
              </>
            ) : authModalTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>লগ ইন করুন</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>অ্যাকাউন্ট তৈরি করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="mt-5 text-center text-xs text-zinc-400">
          {authModalTab === 'login' ? (
            <p>
              অ্যাকাউন্ট নেই?{' '}
              <button
                id="switch-to-signup-btn"
                type="button"
                onClick={() => {
                  setAuthModalTab('signup');
                  setErrorMsg(null);
                }}
                className="text-emerald-400 hover:underline font-semibold ml-1"
              >
                সাইন আপ করুন
              </button>
            </p>
          ) : (
            <p>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                id="switch-to-login-btn"
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setErrorMsg(null);
                }}
                className="text-emerald-400 hover:underline font-semibold ml-1"
              >
                লগ ইন করুন
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
