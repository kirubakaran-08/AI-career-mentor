import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredBanner(true);
      const timer = setTimeout(() => setShowRestoredBanner(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredBanner(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestoredBanner && isOnline) {
    return (
      <div 
        id="banner-online-restored"
        className="bg-emerald-600/90 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span>Internet connection restored. Live AI capabilities are active.</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div 
        id="banner-offline-active"
        className="bg-amber-600/90 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg border-b border-amber-400/30"
      >
        <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
        <span>
          <strong>Offline Mode Active:</strong> You can view roadmaps, resume templates, certificates & goals. AI analysis requires internet connectivity.
        </span>
      </div>
    );
  }

  return null;
};
