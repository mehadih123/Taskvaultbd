import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Award, 
  ShieldCheck, 
  Coins, 
  RefreshCw
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { UserAccount } from '../types';

interface UserProfileModalProps {
  balance: number;
  coins: number;
  currentUser?: UserAccount | null;
  onConvertCoins: () => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  balance,
  coins,
  currentUser,
  onConvertCoins,
  onClose
}) => {
  const userName = currentUser?.name || 'সম্মানিত সদস্য';
  const userEmail = currentUser?.email || 'লগইন করা নেই';
  const userPhone = currentUser?.phone || 'লগইন করা নেই';
  const memberTier = currentUser?.memberTier || 'ভেরিফাইড মেম্বার';

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Banner with Prominent Close (X) Button */}
        <div className="h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative">
          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="absolute top-3.5 right-3.5 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/95 hover:bg-rose-600 text-rose-600 hover:text-white border-2 border-white/60 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Close Profile Modal"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Profile Card Header with Avatar */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-white text-3xl font-black">
                {getInitials(userName)}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="সক্রিয়">
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {memberTier}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {userName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>সদস্য আইডি: {currentUser?.id ? `#${currentUser.id}` : 'N/A'}</span>
              {currentUser?.joinedDate && (
                <>
                  <span>•</span>
                  <span>যোগদান: {currentUser.joinedDate}</span>
                </>
              )}
            </p>
          </div>

          {/* Quick Balance & Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-5">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-center">
              <div className="text-[10px] text-slate-400">ওয়ালেট ব্যালেন্স</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                ৳{balance.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800 text-center">
              <div className="text-[10px] text-slate-400">এস্ক্রো পেন্ডিং</div>
              <div className="text-base font-black text-cyan-600 dark:text-cyan-400 mt-0.5 font-mono">
                ৳{(currentUser?.pendingEscrowBalance || 0).toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-center">
              <div className="text-[10px] text-slate-400">কয়েন ওয়ালেট</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {coins.toLocaleString('bn-BD')}
              </div>
            </div>
          </div>

          {/* Instant 1,000 Coin Conversion Action */}
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">কয়েন কনভার্ট (১,০০০ কয়েন = ৳১.০০)</span>
                <span className="text-[11px] text-slate-500">তাৎক্ষণিক মূল ওয়ালেটে টাকা যোগ করুন</span>
              </div>
            </div>
            <button
              type="button"
              disabled={coins < 1000}
              onClick={() => { playSound('coin'); onConvertCoins(); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                coins >= 1000
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>কনভার্ট করুন</span>
            </button>
          </div>

          {/* User Details (Zero Referral Clutter) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                ইমেইল:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{userEmail}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                ফোন নাম্বার:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{userPhone}</span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                প্রোফাইল স্ট্যাটাস:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {currentUser ? 'নিবন্ধিত ও সুরক্ষিত' : 'লগইন আবশ্যক'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
