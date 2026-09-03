import { useState, useEffect, useCallback } from 'react';
import type { AppRoute } from '../types';

function parseRoute(): AppRoute {
  // Check search params first as fallback: ?code=xyz or ?stats=xyz
  const searchParams = new URLSearchParams(window.location.search);
  const queryCode = searchParams.get('code');
  const queryStats = searchParams.get('stats');
  if (queryStats) {
    return { view: 'stats', shortCode: queryStats };
  }
  if (queryCode) {
    return { view: 'redirect', shortCode: queryCode };
  }

  // Check hash routing fallback: #/stats/xyz or #/xyz
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    const hashParts = hash.split('/').filter(Boolean);
    if (hashParts[0] === 'stats' && hashParts[1]) {
      return { view: 'stats', shortCode: hashParts[1] };
    }
    if (hashParts[0] && hashParts[0] !== 'stats') {
      return { view: 'redirect', shortCode: hashParts[0] };
    }
  }

  // Standard pathname routing: /stats/:shortCode or /:shortCode
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!pathname) {
    return { view: 'home' };
  }

  const parts = pathname.split('/');
  if (parts[0] === 'stats') {
    return { view: 'stats', shortCode: parts[1] || '' };
  }

  // Exclude system paths or static files
  if (['index.html', 'favicon.ico', 'assets', 'api'].includes(parts[0])) {
    return { view: 'home' };
  }

  return { view: 'redirect', shortCode: parts[0] };
}

export function useRouter() {
  const [route, setRoute] = useState<AppRoute>(parseRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setRoute(parseRoute());
    }
  }, []);

  return { route, navigate };
}
