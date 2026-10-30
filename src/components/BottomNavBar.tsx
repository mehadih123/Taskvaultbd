import React from 'react';
import { 
  Home, 
  Wallet, 
  Calculator,
  HelpCircle,
  ShieldCheck,
  User
} from 'lucide-react';
import { AppTab, Language } from '../types';
import { playSound } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenMathTask: () => void;
  onOpenQuizJob: () => void;
  onOpenCaptcha: () => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  language: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMathTask,
  onOpenQuizJob,
  onOpenCaptcha,
  onOpenWallet,
  onOpenProfile,
  language
}) => {
  const isBn = language === 'bn';

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-3 transition-colors duration-300"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Home Tab */}
        <button
          onClick={() => {
            playSound('click');
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* 2. Separate Math Task Button */}
        <button
          onClick={() => {
            playSound('click');
            onOpenMathTask();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-teal-600 dark:text-teal-400 font-bold transition-all cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'ম্যাথ টাস্ক' : 'Math'}
          </span>
        </button>

        {/* 3. Separate Quiz Job Button */}
        <button
          onClick={() => {
            playSound('click');
            onOpenQuizJob();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-amber-600 dark:text-amber-400 font-bold transition-all cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'কুইজ' : 'Quiz'}
          </span>
        </button>

        {/* 4. Separate Captcha Solving Button */}
        <button
          onClick={() => {
            playSound('click');
            onOpenCaptcha();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold transition-all cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'ক্যাপচা' : 'Captcha'}
          </span>
        </button>

        {/* 4. Wallet & Cashout Tab */}
        <button
          onClick={() => {
            playSound('click');
            onOpenWallet();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-pink-600 dark:text-pink-400 font-bold transition-all cursor-pointer"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'ওয়ালেট' : 'Wallet'}
          </span>
        </button>

        {/* 5. Profile Tab (Zero Team/Referral Clutter) */}
        <button
          onClick={() => {
            playSound('click');
            onOpenProfile();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-600 dark:text-slate-300 font-semibold transition-all cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">
            {isBn ? 'প্রোফাইল' : 'Profile'}
          </span>
        </button>

      </div>
    </nav>
  );
};
