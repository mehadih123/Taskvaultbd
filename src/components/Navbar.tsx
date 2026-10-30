import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Bell, 
  Menu, 
  Globe, 
  Lock, 
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  HelpCircle,
  Calculator,
  BarChart3,
  MessageSquare,
  Coins,
  User
} from 'lucide-react';
import { NotificationItem, UserAccount, Language, AppTab } from '../types';
import { playSound } from '../utils/audio';

interface NavbarProps {
  balance: number;
  coins: number;
  pendingEscrowBalance: number;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenMathTask: () => void;
  onOpenQuizJob: () => void;
  onOpenCaptcha: () => void;
  onOpenWallet: () => void;
  onOpenAuth: () => void;
  onOpenSideDrawer: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  currentUser: UserAccount | null;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  balance,
  coins,
  pendingEscrowBalance,
  activeTab,
  onSelectTab,
  onOpenMathTask,
  onOpenQuizJob,
  onOpenCaptcha,
  onOpenWallet,
  onOpenAuth,
  onOpenSideDrawer,
  notifications,
  onMarkNotificationsRead,
  currentUser,
  language,
  onToggleLanguage
}) => {
  const isBn = language === 'bn';
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTabClick = (tab: AppTab) => {
    playSound('click');
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-4 sm:pr-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo ("TaskVault BD") */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink min-w-0" 
            onClick={() => handleTabClick('home')}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent truncate">
                  TaskVault BD
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hidden sm:inline-flex shrink-0">
                  Verified
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block truncate">
                {isBn ? 'নিরাপদ অনলাইন আর্নিং ও রিসেলিং হাব' : 'Secure Online Reselling & Tasks Hub'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs — Strictly Separate Math Task & Quiz Job Buttons */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <button 
              onClick={() => handleTabClick('home')} 
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? 'হোম' : 'Home'}
            </button>
            <button 
              onClick={() => handleTabClick('resell')} 
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'resell'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিসেলিং শপ' : 'Resell Store'}</span>
            </button>
            <button 
              onClick={() => handleTabClick('microjobs')} 
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'microjobs'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isBn ? 'মাইক্রো-জব' : 'Micro Jobs'}</span>
            </button>

            {/* SEPARATE BUTTON 1: MATH TASK */}
            <button 
              onClick={() => { playSound('click'); onOpenMathTask(); }} 
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-teal-700 dark:text-teal-300 hover:bg-white dark:hover:bg-slate-900"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isBn ? 'ম্যাথ টাস্ক' : 'Math Task'}</span>
            </button>

            {/* SEPARATE BUTTON 2: QUIZ JOB */}
            <button 
              onClick={() => { playSound('click'); onOpenQuizJob(); }} 
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-amber-700 dark:text-amber-300 hover:bg-white dark:hover:bg-slate-900"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'কুইজ জব' : 'Quiz Job'}</span>
            </button>

            {/* SEPARATE BUTTON 3: CAPTCHA SOLVING */}
            <button 
              onClick={() => { playSound('click'); onOpenCaptcha(); }} 
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-slate-900"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isBn ? 'ক্যাপচা' : 'Captcha'}</span>
            </button>

            <button 
              onClick={() => handleTabClick('analytics')} 
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isBn ? 'ড্যাশবোর্ড' : 'Analytics'}</span>
            </button>
            <button 
              onClick={() => handleTabClick('support')} 
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'support'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isBn ? 'সাপোর্ট' : 'Support'}</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pr-1 sm:pr-0">
            
            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title="Change Language"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Notifications Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  playSound('click');
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) onMarkNotificationsRead();
                }}
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      নোটিফিকেশন
                    </span>
                    <span className="text-[10px] text-slate-400">
                      সর্বশেষ আপডেট
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persistent Coin Badge (Desktop/Tablet) */}
            <button
              onClick={() => { playSound('click'); onOpenMathTask(); }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-black cursor-pointer"
              title="কয়েন ওয়ালেট"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{coins.toLocaleString('bn-BD')}</span>
            </button>

            {/* Balance & Cashout Box */}
            <div className="flex items-center gap-1 sm:gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm shrink-0">
              <div className="px-1 sm:px-2">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">উত্তোলনযোগ্য</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 leading-tight whitespace-nowrap font-mono">
                  ৳{balance.toFixed(2)}
                </div>
              </div>

              {pendingEscrowBalance > 0 && (
                <div className="hidden md:block pl-2 border-l border-slate-200 dark:border-slate-700 text-left">
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 dark:text-amber-400">
                    <Lock className="w-2.5 h-2.5" />
                    <span>এস্ক্রো</span>
                  </div>
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 leading-tight whitespace-nowrap">
                    ৳{pendingEscrowBalance.toLocaleString('bn-BD')}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  playSound('click');
                  onOpenWallet();
                }}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[10px] sm:text-xs shadow-sm sm:shadow-md shadow-emerald-600/20 flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>ক্যাশআউট</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {!currentUser && (
              <button
                onClick={() => { playSound('click'); onOpenAuth(); }}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন' : 'Login'}</span>
              </button>
            )}

            {/* 3-Line Hamburger Menu Icon */}
            <button
              onClick={() => {
                playSound('click');
                onOpenSideDrawer();
              }}
              className="shrink-0 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer border border-emerald-200 dark:border-slate-700 shadow-sm active:scale-95"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
