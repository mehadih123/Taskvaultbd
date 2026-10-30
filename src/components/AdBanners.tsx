import React, { useState } from 'react';
import { Sparkles, ExternalLink, Play, Gift, CheckCircle2, Clock, X } from 'lucide-react';
import { Language } from '../types';
import { playSound } from '../utils/audio';

interface AdBannerProps {
  type: 'leaderboard' | 'rewarded';
  language: Language;
  onClaimAdReward?: (amount: number) => void;
  onShowToast?: (msg: string) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  language,
  onClaimAdReward,
  onShowToast
}) => {
  const isBn = language === 'bn';
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isWatching, setIsWatching] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

  const startRewardedAd = () => {
    playSound('click');
    setAdModalOpen(true);
    setIsWatching(true);
    setCountdown(5);
    setCanClaim(false);

    let current = 5;
    const interval = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current <= 0) {
        clearInterval(interval);
        setIsWatching(false);
        setCanClaim(true);
        playSound('coin');
      }
    }, 1000);
  };

  const handleClaim = () => {
    playSound('success');
    if (onClaimAdReward) onClaimAdReward(5);
    if (onShowToast) onShowToast(isBn ? 'বিজ্ঞাপন দেখে ৳৫ বোনাস অর্জন করেছেন!' : 'Earned ৳5 Ad Bonus!');
    setAdModalOpen(false);
  };

  if (type === 'leaderboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              {isBn ? 'স্পন্সরড AdSense' : 'Sponsored Ads'}
            </span>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                {isBn ? 'হোস্টিং ও ডোমেইনে ৭০% ছাড়! আজকের সেরা অফার' : 'Get 70% Off Cloud Hosting & Domains Today!'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {isBn ? 'আপনার নতুন ই-কমার্স শপ শুরু করতে ক্লিক করুন' : 'Click to launch your online store with high speed SSD'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{isBn ? 'অফার দেখুন' : 'Visit Site'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={startRewardedAd}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{isBn ? 'বিজ্ঞাপন দেখে ৳৫ বোনাস' : 'Watch Ad for ৳5'}</span>
            </button>
          </div>
        </div>

        {/* Rewarded Ad Modal */}
        {adModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {isBn ? 'রিওয়ার্ডেড বিজ্ঞাপন' : 'Rewarded Video Ad'}
                </span>
                {!isWatching && (
                  <button onClick={() => setAdModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {isBn ? 'স্পন্সর: বিকাশ ও নগদ ক্যাশব্যাক ক্যাম্পেইন' : 'Sponsor: Digital Payment Campaign'}
                </div>
                <h3 className="text-lg font-black">
                  {isBn ? 'প্রতিদিন ফ্রি রিচার্জ ও ক্যাশব্যাক ভাউচার!' : 'Daily Free Mobile Recharge & Cashback!'}
                </h3>
                <p className="text-xs text-indigo-200">
                  {isBn ? 'বিশ্বস্ত পার্টনার থেকে অফারটি লুফে নিন' : 'Claim authentic merchant cash rewards now'}
                </p>

                {isWatching ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-xs font-bold mt-2">
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>{isBn ? `বিজ্ঞাপন চলছে: ${countdown} সেকেন্ড অপেক্ষা করুন` : `Playing Ad: ${countdown}s left`}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-xs font-bold text-white mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'বিজ্ঞাপন দেখা সম্পন্ন!' : 'Ad view completed!'}</span>
                  </div>
                )}
              </div>

              {canClaim ? (
                <button
                  onClick={handleClaim}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all animate-bounce"
                >
                  {isBn ? '৳৫ রিওয়ার্ড সংগ্রহ করুন (Claim ৳5)' : 'Claim ৳5 Reward Now'}
                </button>
              ) : (
                <div className="text-xs text-slate-400">
                  {isBn ? 'পুরো বিজ্ঞাপনটি দেখলে রিওয়ার্ড বাটনে ক্লিক করতে পারবেন' : 'Wait for countdown to claim your bonus'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
