import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DownloadPage } from './pages/DownloadPage';
import { DocsPage } from './pages/DocsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { LegalPage } from './pages/LegalPage';
import { SupportPage } from './pages/SupportPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AboutAppModal } from '@knowthemd/ui';
import { WifiOff } from 'lucide-react';
import { FloatingSupportWidget } from './components/support/FloatingSupportWidget';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isAboutOpen, setIsAboutOpen] = useState(false);


  // Parse path and hash to determine current page
  const resolveRoute = (): string => {
    // 1. Check hash first for backward compatibility
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && ['home', 'download', 'docs', 'changelog', 'legal', 'support'].includes(hash)) {
      return hash;
    }

    // 2. Check pathname
    const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    if (!path || path === '' || path === 'home') return 'home';
    if (path === 'download' || path === 'downloads' || path === 'details' || path === 'app-info' || path === 'info') return 'download';
    if (path === 'docs' || path === 'documentation') return 'docs';
    if (path === 'changelog' || path === 'releases') return 'changelog';
    if (path === 'legal' || path === 'privacy' || path === 'terms' || path === 'cookies' || path === 'security' || path === 'accessibility') {
      return 'legal';
    }
    if (path === 'support' || path === 'help') return 'support';

    // 3. Unknown route -> 404
    return '404';
  };

  useEffect(() => {
    const handleRoute = () => {
      setCurrentPage(resolveRoute());
    };

    handleRoute();

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-600/90 text-amber-50 text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4" />
          <span>You are currently offline. KnowTheMD operates completely offline without internet connectivity.</span>
        </div>
      )}

      <Navbar activePage={currentPage} onNavigate={navigateTo} />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'download' && <DownloadPage />}
        {currentPage === 'docs' && <DocsPage />}
        {currentPage === 'changelog' && <ChangelogPage />}
        {currentPage === 'legal' && <LegalPage />}
        {currentPage === 'support' && <SupportPage />}
        {currentPage === '404' && <NotFoundPage onNavigate={navigateTo} />}
      </main>
      <Footer onNavigate={navigateTo} onOpenAbout={() => setIsAboutOpen(true)} />

      <AboutAppModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      
      <FloatingSupportWidget />
    </div>
  );
};

