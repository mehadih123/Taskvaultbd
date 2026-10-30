import React from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Youtube, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Users
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface OfficialChannelModalProps {
  onClose: () => void;
}

export const OfficialChannelModal: React.FC<OfficialChannelModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                অফিসিয়াল আর্নিং কমিউনিটি
              </h3>
              <p className="text-xs text-slate-400">
                প্রতিদিনের নতুন পণ্য ও মাইক্রো-জব আপডেট পান সবার আগে
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="বন্ধ করুন"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-950/40 dark:to-teal-950/30 border border-sky-200/80 dark:border-sky-800/60">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500" />
              কেন আমাদের অফিশিয়াল গ্রুপে যুক্ত হবেন?
            </div>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>প্রতিদিনের নতুন ট্রিক্স ও সেলস গাইডলাইন</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>দৈনিক এক্সক্লুসিভ হাই-কমিশন প্রোডাক্ট অ্যালার্ট</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>২৪/৭ এডমিন সাপোর্ট ও পেমেন্ট হেল্পলাইন</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-2.5">
            
            {/* Telegram Channel */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div>অফিসিয়াল টেলিগ্রাম চ্যানেল</div>
                  <div className="text-[10px] font-normal opacity-90">নতুন পণ্য ও কাজের নিয়মিত আপডেট</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            {/* WhatsApp Community */}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div>অফিসিয়াল হোয়াটসঅ্যাপ গ্রুপ</div>
                  <div className="text-[10px] font-normal opacity-90">সরাসরি রিসেলিং সাপোর্ট ও আলোচনা</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            {/* YouTube Channel */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click')}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div>ইউটিউব টিউটোরিয়াল চ্যানেল</div>
                  <div className="text-[10px] font-normal opacity-90">রিসেলিং ও কাজের ভিডিও প্রশিক্ষণ</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            জরুরি হেল্পলাইন: <strong className="text-slate-700 dark:text-slate-300">01700-000000</strong> (সকাল ১০টা - রাত ১০টা)
          </div>
        </div>

      </div>
    </div>
  );
};
