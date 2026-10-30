import React, { useState } from 'react';
import { ShieldCheck, Coins, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { generateCaptchaChallenge, GeneratedCaptchaChallenge } from '../utils/taskGenerators';
import { playSound } from '../utils/audio';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  balance: number;
  onWinCaptchaCoins: (coinsWon: number) => void;
  onConvertCoins: () => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  onClose,
  coins,
  balance,
  onWinCaptchaCoins,
  onConvertCoins,
  onShowToast,
  language = 'bn'
}) => {
  const isBn = language === 'bn';
  const [challenge, setChallenge] = useState<GeneratedCaptchaChallenge>(() => generateCaptchaChallenge());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);

  if (!isOpen) return null;

  const canConvert = coins >= 1000;
  const progressPct = Math.min(100, Math.round((coins / 1000) * 100));

  const handleOptionClick = (idx: number) => {
    if (idx === challenge.correctIndex) {
      playSound('coin');
      onWinCaptchaCoins(50);
      setSolvedCount(prev => prev + 1);
      setFeedback({
        type: 'success',
        text: isBn
          ? 'সঠিক ক্যাপচা! +৫০ কয়েন আপনার কয়েন ওয়ালেটে যোগ হয়েছে!'
          : 'Correct Captcha! +50 Coins added to your Coin Wallet!'
      });
      onShowToast(isBn ? '+৫০ কয়েন যোগ হয়েছে!' : '+50 Coins earned!');
      setChallenge(generateCaptchaChallenge());
    } else {
      // WRONG ANSWER PENALTY: Do NOT allow retry on the same captcha — immediately skip to a brand new one!
      playSound('error');
      setChallenge(generateCaptchaChallenge());
      setFeedback({
        type: 'error',
        text: isBn
          ? 'ভুল ক্যাপচা! একই ক্যাপচা পুনরায় করার সুযোগ নেই — নতুন ক্যাপচা দেওয়া হয়েছে।'
          : 'Wrong selection! Penalty: skipped immediately to a brand new captcha.'
      });
    }
  };

  const handleRefreshCaptcha = () => {
    playSound('click');
    setChallenge(generateCaptchaChallenge());
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header with Prominent Top-Right Close (×) Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'ক্যাপচা সলভিং (Captcha)' : 'Captcha Solving'}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
                  +৫০ কয়েন
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? '৫০,০০০+ ক্যাপচা পুল • সঠিক বাটন বেছে নিয়ে কয়েন আয় করুন' : '50,000+ Captchas • Tap matching code button'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Close Captcha Modal"
            title={isBn ? 'বন্ধ করুন (×)' : 'Close (×)'}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Unified Coin Wallet & Instant 1,000 Coin Conversion */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-300/70 dark:border-amber-700/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'কয়েন ওয়ালেট' : 'Coin Wallet'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      ১,০০০ কয়েন = ৳১.০০
                    </span>
                  </div>
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                    {coins.toLocaleString('bn-BD')} {isBn ? 'কয়েন' : 'Coins'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canConvert}
                onClick={() => {
                  playSound('coin');
                  onConvertCoins();
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  canConvert
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isBn ? 'কনভার্ট করুন (৳১.০০)' : 'Convert Coins (৳1.00)'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>
                  {isBn ? 'মূল ওয়ালেট ব্যালেন্স:' : 'Main Wallet:'}{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    ৳{balance.toFixed(2)} BDT
                  </strong>
                </span>
                <span>{Math.min(coins, 1000)} / 1000</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Captcha Visual Plate & Button Options */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {isBn ? `ক্যাপচা #${challenge.id}` : `Captcha #${challenge.id}`}
              </span>
              <div className="flex items-center gap-3">
                <span>{isBn ? `সমাধান: ${solvedCount}টি` : `Solved: ${solvedCount}`}</span>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                  title={isBn ? 'নতুন ক্যাপচা' : 'New Captcha'}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Unselectable SVG Captcha Plate */}
            <div className="relative rounded-2xl bg-slate-900 border-2 border-indigo-500/40 p-4 overflow-hidden select-none shadow-inner">
              <svg viewBox="0 0 280 76" className="w-full h-20">
                <defs>
                  <pattern id="captchaGrid" width="14" height="14" patternUnits="userSpaceOnUse">
                    <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="280" height="76" fill="url(#captchaGrid)" />
                <path d="M 12 22 Q 95 62, 180 20 T 268 54" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="2" />
                <path d="M 18 58 Q 110 14, 195 55 T 265 24" fill="none" stroke="rgba(20,184,166,0.3)" strokeWidth="1.5" />
                {challenge.glyphs.map((g, idx) => {
                  const x = 44 + idx * 48;
                  const y = 46 + g.dy;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y}
                      fill={g.color}
                      fontSize="32"
                      fontWeight="900"
                      fontFamily="monospace"
                      textAnchor="middle"
                      transform={`rotate(${g.rotate} ${x} ${y})`}
                    >
                      {g.char}
                    </text>
                  );
                })}
              </svg>
            </div>

            <p className="text-xs font-bold text-center text-slate-600 dark:text-slate-300">
              {isBn
                ? 'উপরের ছবির সঠিক কোডটি নিচের বাটন থেকে নির্বাচন করুন:'
                : 'Select the matching code button below:'}
            </p>

            {/* 4 Clean Button Options */}
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((opt, idx) => (
                <button
                  key={`${challenge.id}-${idx}`}
                  type="button"
                  onClick={() => handleOptionClick(idx)}
                  className="py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-900 dark:text-white font-mono font-black text-base tracking-widest transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center ${
                  feedback.type === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            {isBn
              ? 'বিজ্ঞাপনমুক্ত ক্যাপচা জোন • শুধুমাত্র সঠিক কোড নির্বাচনের জন্যই কয়েন প্রদান করা হয়'
              : 'Ad-free captcha zone • Coins are awarded strictly for accurate selections'}
          </p>

        </div>
      </div>
    </div>
  );
};
