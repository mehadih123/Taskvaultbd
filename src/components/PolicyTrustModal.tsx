import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Mail,
  Send,
  Phone,
  MessageCircle,
  ExternalLink,
  Lock,
  Cookie,
  CheckCircle2,
  Globe,
  Clock
} from 'lucide-react';
import { FeedbackItem, Language, UserAccount } from '../types';
import { playSound } from '../utils/audio';

export type PolicyPageType = 'privacy' | 'terms' | 'contact';

interface PolicyTrustModalProps {
  activePage: PolicyPageType | null;
  onSelectPage: (page: PolicyPageType) => void;
  onClose: () => void;
  currentUser: UserAccount | null;
  onSubmitFeedback: (feedback: FeedbackItem) => void;
  onShowToast: (msg: string) => void;
  language: Language;
}

export const PolicyTrustModal: React.FC<PolicyTrustModalProps> = ({
  activePage,
  onSelectPage,
  onClose,
  currentUser,
  onSubmitFeedback,
  onShowToast,
  language
}) => {
  const isBn = language === 'bn';

  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhoneOrEmail, setContactPhoneOrEmail] = useState(
    currentUser?.phone || currentUser?.email || ''
  );
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setContactName(prev => prev || currentUser.name);
      setContactPhoneOrEmail(prev => prev || currentUser.phone || currentUser.email);
    }
  }, [currentUser]);

  if (!activePage) return null;

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhoneOrEmail.trim() || !contactMessage.trim()) {
      playSound('error');
      onShowToast(
        isBn
          ? 'অনুগ্রহ করে নাম, যোগাযোগ মাধ্যম এবং বার্তা পূরণ করুন!'
          : 'Please fill in your name, contact info, and message!'
      );
      return;
    }

    const newTicket: FeedbackItem = {
      id: 'SUP-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser?.id || 'GUEST-VISITOR',
      userName: contactName.trim(),
      userPhone: contactPhoneOrEmail.trim(),
      category: 'other',
      subject:
        contactSubject.trim() ||
        (isBn ? 'যোগাযোগ ও সহায়তা বার্তা' : 'Contact & Support Inquiry'),
      message: contactMessage.trim(),
      date:
        'আজ, ' +
        new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    playSound('success');
    onSubmitFeedback(newTicket);
    setContactSubmitted(true);
    setContactSubject('');
    setContactMessage('');
    onShowToast(
      isBn
        ? 'আপনার বার্তা সফলভাবে অফিশিয়াল সাপোর্ট ইনবক্সে জমা হয়েছে!'
        : 'Your inquiry has been sent to our official support team!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header with Prominent Top-Right Close (×) Button */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shrink-0">
              {activePage === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {activePage === 'terms' && <FileText className="w-5 h-5" />}
              {activePage === 'contact' && <Mail className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {activePage === 'privacy' &&
                  (isBn
                    ? 'প্রাইভেসি পলিসি (Privacy Policy)'
                    : 'Privacy Policy — TaskVault BD')}
                {activePage === 'terms' &&
                  (isBn
                    ? 'ব্যবহারের শর্তাবলী (Terms & Conditions)'
                    : 'Terms & Conditions — TaskVault BD')}
                {activePage === 'contact' &&
                  (isBn
                    ? 'যোগাযোগ ও সহায়তা (Contact Us / Support)'
                    : 'Contact Us & Official Support')}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isBn
                  ? 'TaskVault BD অফিশিয়াল নীতিমালা, গুগল অ্যাডসেন্স কমপ্লায়েন্স ও সাপোর্ট কেন্দ্র'
                  : 'Official Compliance, Publisher Transparency & User Protection'}
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
            aria-label="Close Policy Modal"
            title={isBn ? 'বন্ধ করুন (×)' : 'Close (×)'}
          >
            &times;
          </button>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="px-5 sm:px-7 py-3 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setContactSubmitted(false);
                onSelectPage('privacy');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer truncate ${
                activePage === 'privacy'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setContactSubmitted(false);
                onSelectPage('terms');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer truncate ${
                activePage === 'terms'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? 'শর্তাবলী' : 'Terms & Conditions'}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onSelectPage('contact');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer truncate ${
                activePage === 'contact'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? 'যোগাযোগ ও সহায়তা' : 'Contact & Support'}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* ============================================================== */}
          {/* PAGE 1: PRIVACY POLICY (INCLUDING ADSENSE & DART COOKIE POLICY) */}
          {/* ============================================================== */}
          {activePage === 'privacy' && (
            <article className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800">
                <span>TaskVault BD Official Privacy Disclosure</span>
                <span aria-hidden="true">·</span>
                <span>Google AdSense &amp; DART Cookie Compliant</span>
                <span aria-hidden="true">·</span>
                <span>সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</span>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>১. তথ্য সংগ্রহ ও লগ ফাইল (User Data &amp; Log Files Collection)</span>
                </h3>
                <p>
                  <strong>TaskVault BD</strong> ব্যবহারকারীদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা ও নিরাপত্তা নিশ্চিত করে। অ্যাকাউন্ট নিবন্ধনের সময় আমরা শুধুমাত্র ব্যবহারকারীর পূর্ণ নাম, সচল মোবাইল নম্বর এবং জিমেইল (Gmail) ঠিকানা সংগ্রহ করি, যা অ্যাকাউন্ট লগইন, ওটিপি (OTP) পাসওয়ার্ড রিকভারি এবং বিকাশ পার্সোনাল ক্যাশআউট যাচাইকরণের কাজে ব্যবহৃত হয়।
                </p>
                <p>
                  এছাড়াও মানসম্মত ওয়েব হোস্টিং ও নিরাপত্তার স্বার্থে স্ট্যান্ডার্ড লগ ফাইলের (Log Files) মাধ্যমে ব্যবহারকারীর ইন্টারনেট প্রোটোকল <strong>(IP Address)</strong>, ব্রাউজারের ধরন <strong>(Browser Type &amp; User-Agent)</strong>, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), ভিজিটের তারিখ ও সময় (Date/Time Stamp) এবং ডিভাইস সংক্রান্ত প্রযুক্তিগত তথ্য সংরক্ষিত হতে পারে। এসব তথ্য কোনোভাবেই ব্যক্তিগতভাবে কাউকে শনাক্ত করতে তৃতীয় পক্ষের নিকট বিক্রি করা হয় না; কেবলমাত্র স্প্যাম, বট ও ডুপ্লিকেট অ্যাকাউন্ট প্রতিরোধে ব্যবহৃত হয়।
                </p>
              </section>

              <section className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>২. কুকিজ ও ব্রাউজার স্টোরেজ ব্যবহার (Cookies &amp; LocalStorage Policy)</span>
                </h3>
                <p>
                  ব্যবহারকারীর ব্রাউজিং অভিজ্ঞতা উন্নত করতে, লগইন সেশন সচল রাখতে, থিম পছন্দ (Light/Dark Mode) সংরক্ষণ করতে এবং অর্জিত কয়েন ও ওয়ালেট ব্যালেন্স নিরবচ্ছিন্নভাবে সিঙ্ক রাখতে <strong>TaskVault BD</strong> ফার্স্ট-পার্টি কুকিজ (Cookies) এবং ব্রাউজার স্টোরেজ ব্যবহার করে। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিষ্ক্রিয় করতে পারেন, তবে এতে প্ল্যাটফর্মের কিছু সেশন ফিচার সীমিত হতে পারে।
                </p>
              </section>

              <section className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>
                    ৩. থার্ড-পার্টি বিজ্ঞাপন ও Google AdSense / DART Cookie নীতিমালা
                  </span>
                </h3>
                <p>
                  গুগল <strong>(Google)</strong>-সহ তৃতীয় পক্ষের বিজ্ঞাপনদাতা ভেন্ডররা <strong>(Third-party vendors)</strong> কুকিজ ব্যবহার করে ব্যবহারকারীর এই ওয়েবসাইটে কিংবা ইন্টারনেটের অন্যান্য ওয়েবসাইটে পূর্ববর্তী ভিজিটের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে। গুগল তার বিজ্ঞাপনী কুকিজ <strong>(Google DoubleClick DART Cookie)</strong> ব্যবহারের মাধ্যমে আমাদের সাইট ও ইন্টারনেটের অন্যান্য সাইটে আপনার ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন পরিবেশন করতে পারে।
                </p>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Standard Google AdSense Disclosure:
                  </div>
                  <p>
                    Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies (including the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visit to TaskVault BD and/or other sites on the Internet.
                  </p>
                  <p>
                    Users may opt out of personalized advertising at any time by visiting{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold underline hover:opacity-80"
                    >
                      Google Ads Settings
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold underline hover:opacity-80"
                    >
                      Google Advertising Privacy &amp; Terms
                    </a>
                    .
                  </p>
                </div>
              </section>

              <section className="space-y-2 pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    ৪. অবৈধ ক্লিক প্রতিরোধ ও বিজ্ঞাপন পৃথকীকরণ (Non-Incentivized Ad Policy)
                  </span>
                </h3>
                <p>
                  <strong>TaskVault BD</strong> গুগল অ্যাডসেন্সের প্রোগ্রাম পলিসি কঠোরভাবে অনুসরণ করে। কোনো বিজ্ঞাপনে ক্লিক করার বিনিময়ে আমরা কখনোই কয়েন, টাকা বা কোনো পুরস্কার প্রদান করি না (Zero Incentivized Clicks)। দুর্ঘটনাবশত ক্লিক এড়াতে আমাদের সকল টাস্ক সাবমিট বাটন এবং কুইজ/ম্যাথ/ক্যাপচা অপশন বিজ্ঞাপন স্থান থেকে সম্পূর্ণ আলাদা ও নিরাপদ দূরত্বে রাখা হয়েছে।
                </p>
              </section>
            </article>
          )}

          {/* ============================================================== */}
          {/* PAGE 2: TERMS & CONDITIONS                                      */}
          {/* ============================================================== */}
          {activePage === 'terms' && (
            <article className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800">
                <span>TaskVault BD User Agreement</span>
                <span aria-hidden="true">·</span>
                <span>Micro-Jobs, Reselling &amp; Coin Policy</span>
                <span aria-hidden="true">·</span>
                <span>কার্যকর: ২০২৬</span>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ০১. অ্যাকাউন্ট নিবন্ধন ও নিরাপত্তা শর্তাবলী
                </h3>
                <p>
                  প্ল্যাটফর্ম ব্যবহারের জন্য প্রত্যেক ব্যবহারকারীকে নিজস্ব বৈধ বাংলাদেশি মোবাইল নম্বর ও সচল জিমেইল দিয়ে একটিমাত্র অ্যাকাউন্ট নিবন্ধন করতে হবে। একাধিক ভুয়া অ্যাকাউন্ট খোলা, ভিপিএন/প্রক্সি ব্যবহার করা অথবা অটোমেটেড স্ক্রিপ্ট/বট ব্যবহার করা প্রমাণিত হলে অ্যাকাউন্ট তাৎক্ষণিকভাবে স্থগিত (Blocked) করা হবে।
                </p>
              </section>

              <section className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ০২. মাইক্রো-জব ও টাস্ক সম্পাদনের নিয়মাবলী
                </h3>
                <p>
                  মাইক্রো-জব সেকশনে কাজ করার সময় বায়ার প্রদত্ত নির্দেশনা শতভাগ অনুসরণ করে সঠিক প্রমাণ (স্ক্রিনশট লিংক বা ইউজারনেম) জমা দিতে হবে। ভুয়া বা অসম্পূর্ণ প্রুফ জমা দিলে রিওয়ার্ড বাতিল হবে। যারা নতুন কাজ পোস্ট করবেন, তাদের অফিশিয়াল বিকাশ পার্সোনাল নম্বরে নির্ধারিত বাজেট পরিশোধ করে সঠিক TrxID প্রদান করতে হবে, যা এডমিন ভেরিফিকেশনের পর লাইভ হবে।
                </p>
              </section>

              <section className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ০৩. জিরো-মূলধন রিসেলিং ও স্মার্ট এস্ক্রো (Smart Escrow) নীতি
                </h3>
                <p>
                  রিসেলারগণ কোনো অগ্রিম মূলধন ছাড়াই ক্যাটালগের পণ্য গ্রাহকের নিকট ক্যাশ অন ডেলিভারিতে অর্ডার বুক করতে পারবেন। অর্ডারের সময় সঠিক এরিয়া অনুযায়ী ডেলিভারি চার্জ (ঢাকার ভেতরে অথবা ঢাকার বাইরে) প্রযোজ্য হবে। অর্ডার সাবমিট হলে রিসেলারের লাভ সাময়িকভাবে <strong>পেন্ডিং এস্ক্রো</strong> ব্যালেন্সে জমা থাকবে এবং কুরিয়ার সফলভাবে পণ্য ডেলিভারি ও মূল্য সংগ্রহ করলে কমিশন মূল উত্তোলনযোগ্য ওয়ালেটে যুক্ত হবে।
                </p>
              </section>

              <section className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ০৪. ম্যাথ, কুইজ, ক্যাপচা ও ১,০০০ কয়েন কনভার্ট নীতিমালা
                </h3>
                <p>
                  ম্যাথ টাস্ক (সহজ যোগ অংক), কুইজ জব এবং ক্যাপচা সলভিংয়ে প্রতিটি সঠিক উত্তরের জন্য <strong>+৫০ কয়েন</strong> কয়েন ওয়ালেটে জমা হয়। ভুল উত্তর দিলে সেই প্রশ্ন পুনরায় চেষ্টা করা যায় না এবং স্বয়ংক্রিয়ভাবে নতুন প্রশ্ন প্রদর্শিত হয়। কয়েন ওয়ালেটে কমপক্ষে <strong>১,০০০ কয়েন</strong> জমা হলেই ব্যবহারকারী তাৎক্ষণিক কনভার্ট বাটনে ক্লিক করে <strong>১,০০০ কয়েন = ৳১.০০ BDT</strong> হিসেবে মূল ওয়ালেটে রূপান্তর করতে পারবেন।
                </p>
              </section>

              <section className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ০৫. ক্যাশআউট ও বিজ্ঞাপন নৈতিকতা নীতি
                </h3>
                <p>
                  মূল ওয়ালেটে সর্বনিম্ন <strong>৳১০০ BDT</strong> জমা হলে ০% সার্ভিস ফি-তে বিকাশ পার্সোনাল নম্বরে ক্যাশআউট আবেদন করা যাবে। নিরাপত্তার স্বার্থে ক্যাশআউটের চূড়ান্ত ধাপে অ্যাকাউন্টের পাসওয়ার্ড যাচাই বাধ্যতামূলক। প্ল্যাটফর্মে প্রদর্শিত কোনো বিজ্ঞাপনে অহেতুক বা কৃত্রিমভাবে ক্লিক করা সম্পূর্ণ নিষিদ্ধ।
                </p>
              </section>
            </article>
          )}

          {/* ============================================================== */}
          {/* PAGE 3: CONTACT US / SUPPORT (CHANNELS + DIRECT SUPPORT FORM)   */}
          {/* ============================================================== */}
          {activePage === 'contact' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800">
                <span>Official Helpdesk &amp; Verification Support</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>প্রতিদিন সকাল ১০:০০টা – রাত ১০:০০টা</span>
                </span>
              </div>

              {/* Official Support Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <a
                  href="https://t.me/TaskVaultBD"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('click')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800/70 dark:hover:bg-sky-950/30 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all flex flex-col justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      অফিসিয়াল টেলিগ্রাম
                    </div>
                    <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">
                      @TaskVaultBD
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      তাৎক্ষণিক আপডেট ও কমিউনিটি সাপোর্ট
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/8801312839525"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('click')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/70 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all flex flex-col justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      হোয়াটসঅ্যাপ হেল্পলাইন
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      +880 1312-839525
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      সরাসরি পেআউট ও রিসেলার সহায়তা
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@taskvaultbd.com"
                  onClick={() => playSound('click')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/70 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all flex flex-col justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      সাপোর্ট ইমেইল
                    </div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 break-all">
                      support@taskvaultbd.com
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      অফিশিয়াল ও ব্যবসায়িক যোগাযোগ (১২-২৪ ঘণ্টা)
                    </p>
                  </div>
                </a>
              </div>

              {/* Direct Support Contact Form */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {isBn
                      ? 'সরাসরি সাপোর্ট মেসেজ পাঠান (Direct Support Form)'
                      : 'Send a Direct Support Message'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn
                      ? 'আপনার যেকোনো প্রশ্ন, কারিগরি সমস্যা বা পেমেন্ট সংক্রান্ত জিজ্ঞাসা নিচে লিখে পাঠান।'
                      : 'Submit your question or account inquiry directly to our support team.'}
                  </p>
                </div>

                {contactSubmitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      ধন্যবাদ! আপনার বার্তাটি আমাদের অফিশিয়াল সাপোর্ট ইনবক্সে জমা হয়েছে। দ্রুত সমাধান দেওয়া হবে।
                    </span>
                  </div>
                )}

                <form onSubmit={handleContactFormSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার পূর্ণ নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        মোবাইল নম্বর অথবা ইমেইল *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPhoneOrEmail}
                        onChange={e => setContactPhoneOrEmail(e.target.value)}
                        placeholder="01XXXXXXXXX / email@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      বিষয়ের শিরোনাম (Subject)
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={e => setContactSubject(e.target.value)}
                      placeholder="যেমন: অ্যাকাউন্ট সহায়তা / ক্যাশআউট তথ্য / ব্যবসায়িক যোগাযোগ"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      আপনার বিস্তারিত বার্তা *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="আপনার প্রশ্ন বা সমস্যার বিবরণ স্পষ্টভাবে লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isBn ? 'সাপোর্টে বার্তা পাঠান' : 'Submit Support Request'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} TaskVault BD • AdSense Publisher Policy Compliant
          </span>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
