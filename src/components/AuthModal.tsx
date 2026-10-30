import React, { useState } from 'react';
import { 
  X,
  Phone, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Globe,
  AlertCircle
} from 'lucide-react';
import { UserAccount, Language } from '../types';
import { playSound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount, isNewSignup?: boolean) => void;
  onPasswordReset?: (userId: string, newPassword: string) => void;
  users: UserAccount[];
  language: Language;
  onToggleLanguage: () => void;
  blockedNoticeUser?: { name: string; phone: string; reason?: string } | null;
  onClearBlockedNotice?: () => void;
  onSubmitBlockedComplaint?: (name: string, phone: string, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onPasswordReset,
  users,
  language,
  onToggleLanguage,
  blockedNoticeUser = null,
  onClearBlockedNotice,
  onSubmitBlockedComplaint
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password / OTP Recovery States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [recoveryTargetUser, setRecoveryTargetUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  // 5-Failed-Login 5-Hour Lockout State
  const [lockoutMsg, setLockoutMsg] = useState('');

  // Blocked User Appeal Form State
  const [detectedBlockedUser, setDetectedBlockedUser] = useState<UserAccount | null>(null);
  const [appealName, setAppealName] = useState('');
  const [appealPhone, setAppealPhone] = useState('');
  const [appealMessage, setAppealMessage] = useState('');
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  const isBn = language === 'bn';

  React.useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 11) {
      try {
        const storedLockouts = JSON.parse(localStorage.getItem('tv_lockouts') || '{}');
        const userLockout = storedLockouts[cleanPhone];
        if (userLockout && userLockout.lockedUntil && Date.now() < userLockout.lockedUntil) {
          const hoursLeft = Math.ceil((userLockout.lockedUntil - Date.now()) / (1000 * 60 * 60));
          setLockoutMsg(isBn 
            ? `ভুল পাসওয়ার্ড ৫ বার দেওয়ার কারণে আপনার অ্যাকাউন্ট ${hoursLeft} ঘণ্টার জন্য লক করা হয়েছে!` 
            : `Account locked for ${hoursLeft} hours due to 5 failed login attempts!`);
        } else {
          setLockoutMsg('');
        }
      } catch {}
    } else {
      setLockoutMsg('');
    }
  }, [phone, isBn]);

  React.useEffect(() => {
    if (blockedNoticeUser) {
      setAppealName(blockedNoticeUser.name);
      setAppealPhone(blockedNoticeUser.phone);
      setAppealMessage('');
      setAppealSubmitted(false);
      const matched = users.find(u => u.phone.replace(/\D/g, '') === blockedNoticeUser.phone.replace(/\D/g, ''));
      if (matched) setDetectedBlockedUser(matched);
    }
  }, [blockedNoticeUser, users]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setError(isBn ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Enter a valid 11-digit phone number');
      playSound('error');
      return;
    }

    if (!password) {
      setError(isBn ? 'পাসওয়ার্ড প্রদান করুন' : 'Enter your password');
      playSound('error');
      return;
    }

    let storedLockouts: Record<string, { count: number; lockedUntil: number }> = {};
    try {
      storedLockouts = JSON.parse(localStorage.getItem('tv_lockouts') || '{}');
    } catch {}

    const userLockout = storedLockouts[cleanPhone] || { count: 0, lockedUntil: 0 };
    if (userLockout.lockedUntil && Date.now() < userLockout.lockedUntil) {
      const hoursLeft = Math.ceil((userLockout.lockedUntil - Date.now()) / (1000 * 60 * 60));
      setError(isBn 
        ? `অ্যাকাউন্ট লকড! অনুগ্রহ করে ${hoursLeft} ঘণ্টা পর পুনরায় চেষ্টা করুন।` 
        : `Account locked! Try again in ${hoursLeft} hours.`);
      playSound('error');
      return;
    }

    // Always read latest registered accounts from both props and localStorage
    let allRegisteredUsers: UserAccount[] = users;
    try {
      const savedUsersRaw = localStorage.getItem('taskvault_users');
      if (savedUsersRaw) {
        const parsed: UserAccount[] = JSON.parse(savedUsersRaw);
        if (Array.isArray(parsed) && parsed.length > allRegisteredUsers.length) {
          allRegisteredUsers = parsed;
        }
      }
    } catch {}

    const existingUser = allRegisteredUsers.find(u => u.phone.replace(/\D/g, '') === cleanPhone);
    if (existingUser && existingUser.isBlocked) {
      playSound('error');
      setDetectedBlockedUser(existingUser);
      setAppealName(existingUser.name);
      setAppealPhone(existingUser.phone);
      setAppealSubmitted(false);
      return;
    }

    // STRICT AUTHENTICATION: NO UNREGISTERED LOGINS & EXACT MATCHING PASSWORD REQUIRED
    if (mode === 'login') {
      if (!existingUser || !existingUser.password || existingUser.password !== password) {
        userLockout.count = (userLockout.count || 0) + 1;
        if (userLockout.count >= 5) {
          userLockout.lockedUntil = Date.now() + (5 * 60 * 60 * 1000);
          storedLockouts[cleanPhone] = userLockout;
          localStorage.setItem('tv_lockouts', JSON.stringify(storedLockouts));
          setError(isBn 
            ? 'ভুল পাসওয়ার্ড ৫ বার দেওয়ার কারণে আপনার অ্যাকাউন্ট ৫ ঘণ্টার জন্য লক করা হয়েছে!' 
            : '5 failed login attempts! Account is locked for 5 hours.');
          setLockoutMsg(isBn 
            ? 'অ্যাকাউন্ট ৫ ঘণ্টার জন্য লকড!' 
            : 'Account is locked for 5 hours!');
        } else {
          storedLockouts[cleanPhone] = userLockout;
          localStorage.setItem('tv_lockouts', JSON.stringify(storedLockouts));
          setError('অ্যাকাউন্ট পাওয়া যায়নি বা পাসওয়ার্ড ভুল হয়েছে!');
        }
        playSound('error');
        return;
      }
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError(isBn ? 'আপনার পূর্ণ নাম প্রদান করুন' : 'Please enter your full name');
        playSound('error');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError(isBn ? 'সঠিক জিমেইল / ইমেইল ঠিকানা দিন (নিরাপত্তা ও রিকভারির জন্য আবশ্যক)' : 'Enter a valid Gmail / email address');
        playSound('error');
        return;
      }
      if (password.length < 4) {
        setError(isBn ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষর বা সংখ্যার হতে হবে' : 'Password must be at least 4 characters');
        playSound('error');
        return;
      }
      if (existingUser) {
        setError(isBn ? 'এই নম্বরে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। লগইন করুন।' : 'Account already exists. Please login.');
        playSound('error');
        return;
      }
    }

    storedLockouts[cleanPhone] = { count: 0, lockedUntil: 0 };
    localStorage.setItem('tv_lockouts', JSON.stringify(storedLockouts));

    setIsLoading(true);
    playSound('coin');

    setTimeout(() => {
      setIsLoading(false);
      
      let loggedUser: UserAccount;
      if (mode === 'signup') {
        loggedUser = {
          id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
          name: name.trim(),
          phone: cleanPhone,
          password: password,
          email: email.trim(),
          role: 'user',
          balance: 0,
          pendingEscrowBalance: 0,
          coins: 0,
          memberTier: 'ভেরিফাইড মেম্বার',
          isBlocked: false,
          joinedDate: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        };
        onSuccess(loggedUser, true);
      } else {
        loggedUser = existingUser!;
        onSuccess(loggedUser, false);
      }

      playSound('success');
    }, 450);
  };

  // OTP Password Recovery Handler
  const handleSendRecoveryOtp = () => {
    setError('');
    const clean = forgotIdentifier.trim();
    if (!clean) {
      setError(isBn ? 'নিবন্ধিত মোবাইল নম্বর বা জিমেইল লিখুন' : 'Enter registered phone or Gmail');
      playSound('error');
      return;
    }

    const cleanDigits = clean.replace(/\D/g, '');
    const matched = users.find(u => 
      (cleanDigits.length === 11 && u.phone.replace(/\D/g, '') === cleanDigits) ||
      (u.email && u.email.toLowerCase() === clean.toLowerCase())
    );

    if (!matched) {
      setError('অ্যাকাউন্ট পাওয়া যায়নি বা পাসওয়ার্ড ভুল হয়েছে!');
      playSound('error');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setRecoveryTargetUser(matched);
    setForgotStep(2);
    playSound('coin');
  };

  const handleVerifyAndResetPassword = () => {
    setError('');
    if (!recoveryTargetUser) return;

    if (forgotOtp.trim() !== generatedOtp) {
      setError(isBn ? 'ভুল ওটিপি (OTP) কোড দিয়েছেন! সঠিক কোড দিন।' : 'Incorrect OTP code! Please try again.');
      playSound('error');
      return;
    }

    if (newPassword.length < 4) {
      setError(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ ডিজিটের হতে হবে' : 'Password must be at least 4 digits');
      playSound('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isBn ? 'উভয় পাসওয়ার্ড একই হতে হবে' : 'Passwords do not match');
      playSound('error');
      return;
    }

    if (onPasswordReset) {
      onPasswordReset(recoveryTargetUser.id, newPassword);
    }

    setRecoverySuccess(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' : 'Password reset successful! Please log in.');
    playSound('success');
    setTimeout(() => {
      setIsForgotPassword(false);
      setForgotStep(1);
      setRecoverySuccess('');
      setPhone(recoveryTargetUser.phone);
      setPassword('');
    }, 1400);
  };

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealMessage.trim()) return;

    if (onSubmitBlockedComplaint) {
      onSubmitBlockedComplaint(appealName || 'ইউজার', appealPhone || phone, appealMessage.trim());
    }

    playSound('success');
    setAppealSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Top Header Banner with Language & Prominent Close (X) Button */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative">
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-rose-600 text-rose-600 hover:text-white border-2 border-white/60 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
              aria-label="Close Auth Modal"
              title="বন্ধ করুন (×)"
            >
              &times;
            </button>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            TaskVault BD
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            {isBn 
              ? 'নিবন্ধিত মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে নিরাপদে প্রবেশ করুন' 
              : 'Sign in securely with your registered phone & password'}
          </p>
        </div>

        {detectedBlockedUser ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-300">
                  {isBn ? 'অ্যাকাউন্ট স্থগিত / ব্লক নোটিশ' : 'Account Blocked Notice'}
                </h4>
              </div>

              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-semibold">
                {isBn 
                  ? 'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। এ বিষয়ে কোনো মতামত বা অভিযোগ থাকলে এখানে জানান।' 
                  : 'Your account has been blocked. Submit an appeal below.'}
              </p>

              {detectedBlockedUser.blockReason && (
                <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 text-[11px] font-mono text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  <span className="font-bold">ব্লক করার কারণ:</span> {detectedBlockedUser.blockReason}
                </div>
              )}
            </div>

            {appealSubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-200">
                    {isBn ? 'অভিযোগ সফলভাবে পাঠানো হয়েছে!' : 'Complaint Submitted Successfully!'}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    {isBn 
                      ? 'আপনার আবেদনটি অ্যাডমিন প্যানেলের ইনবক্সে জমা হয়েছে।'
                      : 'Your appeal has been routed to the Admin Inbox.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetectedBlockedUser(null);
                    setAppealSubmitted(false);
                    if (onClearBlockedNotice) onClearBlockedNotice();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isBn ? 'লগইন স্ক্রিনে ফিরে যান' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAppealSubmit} className="space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isBn ? 'অ্যাডমিনের কাছে অভিযোগ / আপিল ফর্ম:' : 'Complaint / Appeal Form:'}
                </div>

                <input
                  type="text"
                  required
                  value={appealName}
                  onChange={(e) => setAppealName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />

                <input
                  type="tel"
                  required
                  value={appealPhone}
                  onChange={(e) => setAppealPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />

                <textarea
                  rows={3}
                  required
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  placeholder={isBn ? 'আপনার অ্যাকাউন্ট আনব্লক করার অনুরোধ লিখুন...' : 'Write your appeal message...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBn ? 'অভিযোগ জমা দিন' : 'Submit Complaint'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDetectedBlockedUser(null);
                      if (onClearBlockedNotice) onClearBlockedNotice();
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    {isBn ? 'অন্য নম্বর' : 'Switch'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Tab switch */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('login'); setError(''); }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isBn ? 'লগইন করুন (Sign In)' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { playSound('click'); setMode('signup'); setError(''); }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isBn ? 'নতুন রেজিস্ট্রেশন (Sign Up)' : 'Sign Up'}
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {lockoutMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{lockoutMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder={isBn ? 'যেমন: মেহেদী হাসান' : 'Full Name'}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'জিমেইল / ইমেইল * (Gmail Address)' : 'Gmail / Email *'}
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="example@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'মোবাইল নম্বর (Phone Number) *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setError(''); }}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? (isBn ? 'লগইন করুন' : 'Sign In Now') : (isBn ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Complete Registration')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {isForgotPassword && (
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-200 dark:border-teal-800">
                    <h5 className="font-bold text-xs text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isBn ? 'নিরাপদ পাসওয়ার্ড রিকভারি (OTP)' : 'Password Recovery (OTP)'}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(false); setForgotStep(1); setError(''); }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {recoverySuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 text-xs font-bold text-center">
                      {recoverySuccess}
                    </div>
                  ) : forgotStep === 1 ? (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-teal-700 dark:text-teal-300">
                        {isBn ? 'নিবন্ধিত মোবাইল নম্বর বা জিমেইল লিখুন:' : 'Enter registered phone or Gmail:'}
                      </p>
                      <input
                        type="text"
                        placeholder="01XXXXXXXXX বা example@gmail.com"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSendRecoveryOtp}
                        className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow cursor-pointer transition-all"
                      >
                        {isBn ? 'ওটিপি (OTP) পাঠান →' : 'Send OTP →'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between font-bold">
                        <span>{isBn ? 'ওটিপি কোড:' : 'OTP Code:'}</span>
                        <span className="font-mono bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded text-sm tracking-widest">{generatedOtp}</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="৬ ডিজিটের ওটিপি কোড দিন"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold tracking-widest text-center rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                      <input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৪ সংখ্যা)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                      <input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAndResetPassword}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition-all"
                      >
                        {isBn ? 'পাসওয়ার্ড সেভ করুন' : 'Save New Password'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? '১০০% সুরক্ষিত নিবন্ধিত অ্যাকাউন্ট যাচাই সিস্টেম' : '100% Registered Account Verification'}</span>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
