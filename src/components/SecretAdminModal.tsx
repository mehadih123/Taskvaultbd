import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  ArrowRight, 
  Cpu
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: (token: string) => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  onAuthorized
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT MASTER PIN VERIFICATION (Default: 2026, or custom Master PIN saved by Admin)
    const masterPin = (localStorage.getItem('taskvault_admin_pin') || '2026').trim();
    const enteredPin = pin.trim();

    if (!enteredPin || enteredPin !== masterPin) {
      playSound('error');
      setErrorMessage('ভুল পিন! পুনরায় চেষ্টা করুন।');
      setPin('');
      return;
    }

    playSound('success');
    setErrorMessage('');
    setPin('');

    const timestamp = Date.now().toString(36).toUpperCase();
    const randHash = Math.random().toString(36).substring(2, 9).toUpperCase();
    const sessionToken = `ADM-SEC-${timestamp}-${randHash}`;
    onAuthorized(sessionToken);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-purple-500/40">
        
        {/* Prominent Top-Right Close (X) Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setPin('');
            setErrorMessage('');
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-800 hover:bg-rose-600 text-white border-2 border-slate-600 hover:border-rose-500 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close Secret Admin Modal"
          title="বন্ধ করুন (×)"
        >
          &times;
        </button>

        <div className="text-center space-y-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono tracking-wider text-purple-300 uppercase mb-1.5">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Admin PIN Protection</span>
            </div>
            <h3 className="text-lg font-black text-white">
              সিক্রেট অ্যাডমিন প্যানেল ভেরিফিকেশন
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              সঠিক মাস্টার পিন প্রদান করে অ্যাডমিন প্যানেলে প্রবেশ করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                autoFocus
                required
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full text-center text-3xl font-mono tracking-[0.4em] py-3 rounded-2xl bg-slate-950 border border-slate-700 text-purple-300 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-rose-300 font-bold bg-rose-950/70 p-3 rounded-xl border border-rose-700 flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>পিন যাচাই ও ড্যাশবোর্ডে প্রবেশ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
