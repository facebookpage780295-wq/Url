import React from 'react';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { RedirectPage } from './components/RedirectPage';
import { StatsPage } from './components/StatsPage';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const { route, navigate } = useRouter();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Show header with Login / Sign up on Home and Stats, or streamlined on Redirect */}
        <Navbar currentRoute={route} onNavigate={navigate} />

        <div className="flex-1">
          {route.view === 'home' && (
            <HomePage onNavigate={navigate} />
          )}

          {route.view === 'redirect' && (
            <RedirectPage
              shortCode={route.shortCode}
              onNavigateHome={() => navigate('/')}
            />
          )}

          {route.view === 'stats' && (
            <StatsPage
              initialShortCode={route.shortCode}
              onNavigate={navigate}
            />
          )}
        </div>

        {/* Global Login / Sign up Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

