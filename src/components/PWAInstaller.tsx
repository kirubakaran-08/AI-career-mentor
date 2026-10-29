import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X } from 'lucide-react';

interface PWAInstallerProps {
  onDismiss: () => void;
}

export const PWAInstaller: React.FC<PWAInstallerProps> = ({ onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User installed PWA');
    }
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 p-4 rounded-2xl bg-[#0d121f]/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Install AI Career Mentor</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Install for quick home-screen access, fast offline workspace loading, and responsive mobile layout.
            </p>
          </div>
        </div>
        <button onClick={() => { setVisible(false); onDismiss(); }} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
        >
          Not Now
        </button>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
      </div>
    </div>
  );
};
