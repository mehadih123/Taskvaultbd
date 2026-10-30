import React from 'react';
import { 
  X, 
  User, 
  Wallet, 
  Briefcase, 
  PlusCircle, 
  ShoppingBag, 
  HelpCircle, 
  Calculator,
  FileText, 
  MessageSquare, 
  LogOut, 
  LogIn,
  ShieldCheck, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Home,
  Coins,
  RefreshCw,
  Mail,
  Lock
} from 'lucide-react';
import { UserAccount, Language, AppTab } from '../types';
import { PolicyPageType } from './PolicyTrustModal';
import { playSound } from '../utils/audio';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  balance: number;
  coins: number;
  pendingEscrowBalance: number;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenMathTask: () => void;
  onOpenQuizJob: () => void;
  onOpenCaptcha: () => void;
  onConvertCoins: () => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenCreateJob: () => void;
  onOpenRules: () => void;
  onOpenPolicyPage: (page: PolicyPageType) => void;
  onOpenSpinWin?: () => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  language: Language;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  balance,
  coins,
  pendingEscrowBalance,
  activeTab,
  onSelectTab,
  onOpenMathTask,
  onOpenQuizJob,
  onOpenCaptcha,
  onConvertCoins,
  onOpenWallet,
  onOpenProfile,
  onOpenAuth,
  onOpenCreateJob,
  onOpenRules,
  onOpenPolicyPage,
  onOpenSpinWin,
  onLogout,
  darkMode,
  toggleDarkMode,
  isMuted,
  toggleMute,
  language
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';

  const handleNavTab = (tab: AppTab) => {
    playSound('click');
    onSelectTab(tab);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                TaskVault BD
              </div>
              <div className="text-[11px] text-slate-400">
                {isBn ? 'মেনু ও দ্রুত ন্যাভিগেশন' : 'Navigation & Settings'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Close Drawer"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* User Mini Profile & Coin Wallet Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'TV'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || (isBn ? 'লগইন করা নেই' : 'Guest Session')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {currentUser?.phone || (isBn ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to your account')}
                </div>
              </div>
            </div>

            {/* Balances Display */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">{isBn ? 'উত্তোলনযোগ্য' : 'Withdrawable'}</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                  ৳{balance.toFixed(2)}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">{isBn ? 'পেন্ডিং এস্ক্রো' : 'Pending Escrow'}</div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  ৳{pendingEscrowBalance.toLocaleString('bn-BD')}
                </div>
              </div>
            </div>

            {/* Coin Wallet Instant Convert Row */}
            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">কয়েন ওয়ালেট</div>
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {coins.toLocaleString('bn-BD')} কয়েন
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={coins < 1000}
                onClick={() => { playSound('coin'); onConvertCoins(); }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  coins >= 1000
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>কনভার্ট (৳১)</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { playSound('click'); onClose(); onOpenWallet(); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isBn ? 'টাকা তুলুন' : 'Withdraw'}</span>
              </button>
              {!currentUser && (
                <button
                  onClick={() => { playSound('click'); onClose(); onOpenAuth(); }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isBn ? 'লগইন / সাইনআপ' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs Links — Strictly Separate Math Task & Quiz Job */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              {isBn ? 'সেকশন ও আর্নিং টাস্কসমূহ' : 'Sections & Tasks'}
            </div>

            <button
              onClick={() => handleNavTab('home')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-emerald-500" />
                <span>{isBn ? 'হোমপেজ' : 'Homepage'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* SEPARATE NAV BUTTON 1: MATH TASK */}
            <button
              onClick={() => {
                playSound('click');
                onClose();
                onOpenMathTask();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-teal-500" />
                <span>{isBn ? 'ম্যাথ টাস্ক (সহজ যোগ +৫০ কয়েন)' : 'Math Task (+50 Coins)'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* SEPARATE NAV BUTTON 2: QUIZ JOB */}
            <button
              onClick={() => {
                playSound('click');
                onClose();
                onOpenQuizJob();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-bold hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'কুইজ জব (সাধারণ জ্ঞান +৫০ কয়েন)' : 'Quiz Job (+50 Coins)'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* SEPARATE NAV BUTTON 3: CAPTCHA SOLVING */}
            <button
              onClick={() => {
                playSound('click');
                onClose();
                onOpenCaptcha();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>{isBn ? 'ক্যাপচা সলভিং (+৫০ কয়েন)' : 'Captcha Solving (+50 Coins)'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavTab('resell')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'resell'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-cyan-500" />
                <span>{isBn ? 'রিসেলিং স্টোর (পণ্য ও কমিশন)' : 'Reselling Store'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavTab('microjobs')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'microjobs'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>{isBn ? 'মাইক্রো-জব তালিকা' : 'Micro Jobs List'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Spin & Win Dedicated Wheel Link */}
            <button
              onClick={() => {
                playSound('click');
                onClose();
                if (onOpenSpinWin) onOpenSpinWin();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/60 text-purple-600 dark:text-purple-400"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>{isBn ? 'স্পিন & উইন হুইল (৳১০ এ ৳৫-৳২০)' : 'Spin & Win Wheel'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavTab('analytics')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'analytics'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>{isBn ? 'ড্যাশবোর্ড ও লেনদেন' : 'Analytics & Wallet'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavTab('support')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs font-semibold ${
                activeTab === 'support'
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold border border-teal-200/60 dark:border-teal-800/60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>{isBn ? 'মতামত বা অভিযোগ বক্স' : 'Feedback & Complaints'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Quick Actions & Extras */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { playSound('click'); onClose(); onOpenCreateJob(); }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'কাজ পোস্ট করুন (Create a Job)' : 'Post a Micro Job'}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-normal">
                {isBn ? 'পাবলিক' : 'Public'}
              </span>
            </button>

            <button
              onClick={() => { playSound('click'); onClose(); onOpenProfile(); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-emerald-500" />
                <span>{isBn ? 'প্রোফাইল বিবরণী' : 'Profile Details'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { playSound('click'); onClose(); onOpenRules(); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>{isBn ? 'এস্ক্রো নিয়মাবলী' : 'Escrow Rules'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Dedicated Policy & Trust Pages (AdSense Compliance) */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              {isBn ? 'আইনি নীতিমালা ও সহায়তা' : 'Policy & Trust Pages'}
            </div>

            <button
              onClick={() => { playSound('click'); onClose(); onOpenPolicyPage('privacy'); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isBn ? 'প্রাইভেসি পলিসি (Privacy Policy)' : 'Privacy Policy'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { playSound('click'); onClose(); onOpenPolicyPage('terms'); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{isBn ? 'শর্তাবলী (Terms & Conditions)' : 'Terms & Conditions'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { playSound('click'); onClose(); onOpenPolicyPage('contact'); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{isBn ? 'যোগাযোগ ও সহায়তা (Contact Us)' : 'Contact Us / Support'}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playSound('click'); toggleDarkMode(); }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { toggleMute(); playSound('click'); }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>
          </div>

          {currentUser ? (
            <button
              onClick={() => { onClose(); onLogout(); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              onClick={() => { onClose(); onOpenAuth(); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগইন / রেজিস্ট্রেশন' : 'Sign In'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
