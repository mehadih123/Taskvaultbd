import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface ContactSectionProps {
  onShowToast: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'টাকা তুলতে কি কোনো ইনভেস্টমেন্ট বা ডিপোজিট প্রয়োজন?',
      a: 'না, মেহাদী আর্ন / রিসেলহাব সম্পূর্ণ ফ্রি প্ল্যাটফর্ম। কোনো মেম্বারশিপ ফি বা ডিপোজিট ছাড়াই আপনি কাজ করে বা রিসেল করে টাকা তুলতে পারবেন।'
    },
    {
      q: 'উইথড্র রিকোয়েস্ট দেওয়ার পর কতক্ষণে বিকাশ/নগদে টাকা আসে?',
      a: 'আমাদের অটোমেটেড পেআউট সিস্টেমের মাধ্যমে উইথড্র রিকোয়েস্ট পাওয়ার সাধারণত ১৫ মিনিট থেকে সর্বোচ্চ ৩ ঘণ্টার মধ্যে আপনার বিকাশ, নগদ বা রকেট একাউন্টে টাকা পৌঁছে যায়।'
    },
    {
      q: 'রিসেলিংয়ে কাস্টমারের কাছে ডেলিভারি কে করে?',
      a: 'কাস্টমারের ঠিকানায় পণ্য পাঠানোর যাবতীয় দায়িত্ব আমাদের ভেরিফাইড সাপ্লায়ার ও নির্ভরযোগ্য কুরিয়ার পার্টনারদের (Steadfast/RedX/Pathao)। কাস্টমার পণ্য হাতে পেয়ে মূল্য পরিশোধ করার সাথে সাথে আপনার কমিশন ব্যালেন্সে নিশ্চিত হয়ে যায়।'
    },
    {
      q: 'মাইক্রো-জবের পেমেন্ট কীভাবে অ্যাপ্রুভ হয়?',
      a: 'কাজের নির্দেশনা অনুযায়ী সঠিক ইউজারনেম বা স্ক্রিনশট সাবমিট করার সাথে সাথেই স্বয়ংক্রিয়ভাবে ও দ্রুত রিওয়ার্ড আপনার একাউন্ট ব্যালেন্সে যুক্ত হয়ে যায়।'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    playSound('success');
    setSubmitted(true);
    onShowToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম দ্রুত রিপ্লাই দেবে।');
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            সাহায্য ও যোগাযোগ
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            যেকোনো প্রয়োজনে আমরা পাশে আছি
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            প্ল্যাটফর্ম ব্যবহার, রিসেলিং বা পেমেন্ট সংক্রান্ত যেকোনো প্রশ্নে আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Contact Information & Message Form */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              সরাসরি মেসেজ পাঠান
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  বার্তা সফলভাবে পাঠানো হয়েছে!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ধন্যবাদ, আমাদের কাস্টমার সাপোর্ট এক্সিকিউটিভ দ্রুত আপনার সাথে যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর বা ইমেইল *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX বা your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার বার্তা বা সমস্যা *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>বার্তা পাঠান</span>
                </button>
              </form>
            )}

            {/* Quick Contact Channels */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">হেল্পলাইন</div>
                  <div className="font-bold">+৮৮০ ১৭০০-০০০০০০</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">সাপোর্ট ইমেইল</div>
                  <div className="font-bold">support@resellhub.app</div>
                </div>
              </div>
            </div>

          </div>

          {/* Frequently Asked Questions (FAQ) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              সাধারণ জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h3>

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => {
                      playSound('click');
                      setOpenFaq(isOpen ? null : index);
                    }}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
