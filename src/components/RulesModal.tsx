import React from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { Language } from '../types';
import { playSound } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isBn ? 'প্ল্যাটফর্ম নিয়মাবলী ও এস্ক্রো শর্তসমূহ' : 'Platform Rules & Escrow Terms'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'রিসেলার এবং ওয়ার্কারদের শতভাগ সুরক্ষা নীতি' : '100% Protection policy for resellers & workers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Close Rules Modal"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          {/* Smart Escrow Rule */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <Lock className="w-4 h-4" />
              <span>১. স্মার্ট কমিশন এস্ক্রো নীতি (Smart Escrow Protection)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              রিসেলিংয়ে অর্ডার সাবমিট করার পর কমিশন সাময়িকভাবে <strong>"পেন্ডিং এস্ক্রো"</strong> অবস্থায় থাকবে। কুরিয়ার গ্রাহকের হাতে পণ্য ডেলিভারি দিয়ে মূল্য সংগ্রহ করার পর এডমিন ভেরিফিকেশন সাপেক্ষে কমিশন স্বয়ংক্রিয়ভাবে আপনার <strong>উত্তোলনযোগ্য প্রধান ব্যালেন্সে</strong> জমা হবে। এতে কোনো ভুয়া অর্ডার বা ক্ষতির ঝুঁকি থাকে না।
            </p>
          </div>

          {/* Micro Job Rules */}
          <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-800 dark:text-cyan-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>২. মাইক্রো-জব সততা ও প্রুফ যাচাই</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              মাইক্রো-জবে কাজের নির্দেশনা অনুযায়ী সঠিক স্ক্রিনশট বা ইউজারনেম জমা দিতে হবে। কোনো ভুয়া বা ফেক প্রুফ দিলে একাউন্ট সাসপেন্ড হতে পারে।
            </p>
          </div>

          {/* Job Posting Rules */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-800 dark:text-purple-300">
              <DollarSign className="w-4 h-4" />
              <span>৩. কাজ পোস্টকারী বায়ারদের নির্দেশিকা</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              কাজ পোস্ট করার সময় নির্ধারিত অফিশিয়াল বিকাশ নম্বরে পেমেন্ট করে সঠিক TrxID সাবমিট করতে হবে। এডমিন টিম ট্রানজেকশন ম্যাচ করার পর কাজটি লাইভ করা হয়।
            </p>
          </div>

          {/* Withdrawal Guarantee */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>৪. ০% ফি তে ইনস্ট্যান্ট উইথড্রয়াল গ্যারান্টি</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              উত্তোলনের জন্য কোনো সার্ভিস চার্জ কাটা হয় না। বিকাশ, নগদ ও রকেটে সর্বনিম্ন ১০০ টাকা হলেই দিনে যেকোনো সময় ক্যাশআউট করা যায়।
            </p>
          </div>

        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
          >
            {isBn ? 'আমি শর্তাবলীতে একমত' : 'I Understand & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
};
