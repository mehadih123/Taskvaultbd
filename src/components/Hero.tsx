import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  DollarSign,
  Lock,
  PlusCircle,
  ShoppingBag,
  Briefcase,
  HelpCircle,
  Calculator,
  MessageSquare,
  Sparkles,
  Coins,
  RefreshCw
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { Language, AppTab } from '../types';

interface HeroProps {
  coins: number;
  balance: number;
  onConvertCoins: () => void;
  onStartEarning: () => void;
  onOpenCreateJob: () => void;
  onOpenRules: () => void;
  onSelectTab: (tab: AppTab) => void;
  onOpenMathTask: () => void;
  onOpenQuizJob: () => void;
  onOpenCaptcha: () => void;
  onOpenWallet?: () => void;
  onOpenSpinWin?: () => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({
  coins,
  balance,
  onConvertCoins,
  onStartEarning,
  onOpenCreateJob,
  onOpenRules,
  onSelectTab,
  onOpenMathTask,
  onOpenQuizJob,
  onOpenCaptcha,
  onOpenWallet,
  onOpenSpinWin,
  language
}) => {
  const isBn = language === 'bn';
  const canConvert = coins >= 1000;

  return (
    <section id="hero" className="relative pt-6 pb-12 lg:py-12 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>TaskVault BD • নিরাপদ এস্ক্রো আর্নিং হাব</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-[1.2] tracking-tight">
            {isBn ? (
              <>
                <span className="text-slate-900 dark:text-white font-black">ঘরে বসে </span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent font-black">
                  রিসেলিং করুন
                </span>
                <span className="text-slate-900 dark:text-white font-black">, বিশ্বস্ত মাইক্রো-টাস্কে নিশ্চিত আয়!</span>
              </>
            ) : (
              <>
                <span className="text-slate-900 dark:text-white font-black">Earn with </span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent font-black">
                  TaskVault BD
                </span>
                <span className="text-slate-900 dark:text-white font-black"> Reselling & Micro Tasks</span>
              </>
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isBn 
              ? 'জিরো ইনভেস্টমেন্টে হোলসেল পণ্য বিক্রি করুন এবং ম্যাথ টাস্ক ও কুইজ জব সমাধান করে কয়েন আয় করুন। ১,০০০ কয়েনে তাৎক্ষণিক ৳১.০০ মূল ওয়ালেটে যোগ করুন।' 
              : 'Zero investment reselling, simple math & quiz tasks, and instant bKash Personal payouts.'}
          </p>

          {/* Persistent Coin Wallet & Instant 1,000 Coin Conversion Banner */}
          <div className="mt-7 max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {isBn ? 'কয়েন ওয়ালেট (Coin Wallet)' : 'Coin Wallet'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    ১,০০০ কয়েন = ৳১.০০ BDT
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                    {coins.toLocaleString('bn-BD')} {isBn ? 'কয়েন' : 'Coins'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    ({isBn ? 'মূল ব্যালেন্স:' : 'Wallet:'} <strong className="text-emerald-600 dark:text-emerald-400">৳{balance.toFixed(2)}</strong>)
                  </span>
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
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
                canConvert
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isBn ? 'কয়েন কনভার্ট করুন (১,০০০ = ৳১)' : 'Convert Coins (1,000 = ৳1)'}</span>
            </button>
          </div>

          {/* Primary Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                playSound('success');
                onStartEarning();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isBn ? 'রিসেলিং পণ্য দেখুন' : 'Explore Resell Store'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playSound('click');
                onOpenCreateJob();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-300/80 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>{isBn ? 'কাজ পোস্ট করুন' : 'Post a Job'}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onOpenRules();
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'এস্ক্রো পলিসি' : 'Escrow Policy'}</span>
            </button>
          </div>

          {/* Service Cards Grid — Strictly Separate Math Task & Quiz Job Buttons */}
          <div className="mt-10 max-w-6xl mx-auto text-left">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>{isBn ? 'জনপ্রিয় সার্ভিস ও আর্নিং টাস্কসমূহ' : 'Popular Services & Earning Tasks'}</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {isBn ? 'যেকোনো সার্ভিসে ক্লিক করে সরাসরি কাজ বা উত্তোলন শুরু করুন' : 'Tap any service to start working or withdraw'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
              
              {/* 1. Math Task (50,000+ ADDITION + ONLY) */}
              <div
                onClick={() => { playSound('click'); onOpenMathTask(); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-110 transition-transform mb-3">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'ম্যাথ টাস্ক' : 'Math Task'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? '৫০,০০০+ সহজ যোগ (+) অংকে +৫০ কয়েন' : '50,000+ addition (+) problems'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  <span>{isBn ? 'অংক করুন' : 'Start Math'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 2. Quiz Job (50,000+ CHILD-FRIENDLY GK) */}
              <div
                onClick={() => { playSound('click'); onOpenQuizJob(); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-500 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform mb-3">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'কুইজ জব' : 'Quiz Job'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? '৫০,০০০+ সহজ সাধারণ জ্ঞান প্রশ্নে +৫০ কয়েন' : '50,000+ simple GK questions'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <span>{isBn ? 'কুইজ খেলুন' : 'Play Quiz'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 3. Captcha Solving (50,000+ BUTTON CAPTCHAS) */}
              <div
                onClick={() => { playSound('click'); onOpenCaptcha(); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'ক্যাপচা সলভিং' : 'Captcha Solving'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? '৫০,০০০+ বাটন ক্যাপচা সলভে +৫০ কয়েন' : '50,000+ button captchas for +50 Coins'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>{isBn ? 'ক্যাপচা করুন' : 'Solve Captcha'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 3. Micro-Jobs */}
              <div
                onClick={() => { playSound('click'); onSelectTab('microjobs'); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500/60 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'মাইক্রো-জব' : 'Micro Jobs'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? 'ইউটিউব, ফেসবুক ও অ্যাপ টাস্ক' : 'Daily small tasks & micro jobs'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                  <span>{isBn ? 'কাজ দেখুন' : 'View Jobs'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 4. Reselling Hub */}
              <div
                onClick={() => { playSound('click'); onSelectTab('resell'); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'রিসেলিং হাব' : 'Resell Hub'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? 'জিরো ইনভেস্টে পাইকারি পণ্য বিক্রি' : 'Zero investment wholesale products'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{isBn ? 'স্টোর দেখুন' : 'Browse'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 5. Spin & Win */}
              <div
                onClick={() => { 
                  playSound('click'); 
                  if (onOpenSpinWin) onOpenSpinWin();
                }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-purple-500/60 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'স্পিন & উইন' : 'Spin & Win'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? 'খরচ ৳১০, জিতুন ৳৫-৳২০ নিশ্চিত প্রাইজ' : 'Cost ৳10, win ৳5-৳20'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  <span>{isBn ? 'স্পিন করুন' : 'Spin Now'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 6. Wallet & Cashout */}
              <div
                onClick={() => { 
                  playSound('click'); 
                  if (onOpenWallet) { onOpenWallet(); } else { onSelectTab('analytics'); }
                }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-pink-500/60 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-110 transition-transform mb-3">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'ওয়ালেট ও ক্যাশআউট' : 'Wallet & Cashout'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? 'পাসওয়ার্ড সুরক্ষিত বিকাশ পেআউট' : 'Password protected bKash payout'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-pink-600 dark:text-pink-400">
                  <span>{isBn ? 'উত্তোলন' : 'Withdraw'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 7. Support & Feedback */}
              <div
                onClick={() => { playSound('click'); onSelectTab('support'); }}
                className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/60 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {isBn ? 'মতামত ও অভিযোগ' : 'Support Box'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isBn ? 'যেকোনো বিষয়ে মতামত বা অভিযোগ করুন' : 'Official feedback & ticket support'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  <span>{isBn ? 'অভিযোগ জানান' : 'Contact Us'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? '০% উইথড্রয়াল ফি' : '0% Withdrawal Fee'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'ডেলিভার্ড-পেইড এস্ক্রো নিশ্চয়তা' : 'Escrow Protected'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'পাসওয়ার্ড সুরক্ষিত ক্যাশআউট' : 'Password Protected'}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
