import React, { useState } from 'react';
import { HelpCircle, Coins, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { generateChildQuizQuestion, GeneratedQuizQuestion } from '../utils/taskGenerators';
import { playSound } from '../utils/audio';

interface QuizJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  balance: number;
  onWinQuizCoins: (coinsWon: number) => void;
  onConvertCoins: () => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const QuizJobModal: React.FC<QuizJobModalProps> = ({
  isOpen,
  onClose,
  coins,
  balance,
  onWinQuizCoins,
  onConvertCoins,
  onShowToast,
  language = 'bn'
}) => {
  const isBn = language === 'bn';
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuizQuestion>(() =>
    generateChildQuizQuestion(language)
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);

  if (!isOpen) return null;

  const canConvert = coins >= 1000;
  const progressPct = Math.min(100, Math.round((coins / 1000) * 100));

  const handleOptionSelect = (idx: number) => {
    if (idx === currentQuestion.correctIndex) {
      playSound('coin');
      onWinQuizCoins(50);
      setSolvedCount(prev => prev + 1);
      setFeedback({
        type: 'success',
        text: isBn
          ? 'অভিনন্দন! সঠিক উত্তর। +৫০ কয়েন আপনার কয়েন ওয়ালেটে যোগ হয়েছে!'
          : 'Correct! +50 Coins added to your Coin Wallet!'
      });
      onShowToast(isBn ? '+৫০ কয়েন যোগ হয়েছে!' : '+50 Coins earned!');
      setCurrentQuestion(prev => generateChildQuizQuestion(language, prev.id));
    } else {
      // WRONG ANSWER PENALTY: Do NOT allow retry on the same question — immediately skip to a brand new question!
      playSound('error');
      setCurrentQuestion(prev => generateChildQuizQuestion(language, prev.id));
      setFeedback({
        type: 'error',
        text: isBn
          ? 'ভুল উত্তর! একই প্রশ্ন পুনরায় করার সুযোগ নেই — নতুন প্রশ্ন দেওয়া হয়েছে।'
          : 'Wrong answer! Penalty: skipped immediately to a brand new question.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Modal Header with Prominent Top-Right Close (×) Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'কুইজ জব (Quiz Job)' : 'Quiz Job'}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  +৫০ কয়েন
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? '৫০,০০০+ অতি সহজ সাধারণ জ্ঞান প্রশ্ন • প্রতি সঠিক উত্তরে ৫০ কয়েন' : '50,000+ Child-Friendly Simple GK Questions'}
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
            aria-label="Close Quiz Job Modal"
            title={isBn ? 'বন্ধ করুন (×)' : 'Close (×)'}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Persistent Coin Wallet & Instant 1,000 Coin Conversion Box */}
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

          {/* Simple Child-Friendly GK Question Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {isBn ? `প্রশ্ন #${currentQuestion.id}` : `Question #${currentQuestion.id}`}
              </span>
              <span>
                {isBn ? `সঠিক উত্তর: ${solvedCount}টি` : `Correct: ${solvedCount}`}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h4>

            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={`${currentQuestion.id}-${idx}`}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  className="w-full text-left p-3.5 rounded-xl border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {idx + 1}. {option}
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
              ? 'বিজ্ঞাপনমুক্ত কুইজ জোন • শুধুমাত্র সঠিক উত্তরের জন্যই কয়েন প্রদান করা হয়'
              : 'Ad-free quiz zone • Coins are awarded strictly for accurate answers'}
          </p>

        </div>
      </div>
    </div>
  );
};
