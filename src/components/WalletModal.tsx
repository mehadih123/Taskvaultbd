import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { Transaction, WithdrawalRequest, UserAccount, Language } from '../types';
import { playSound } from '../utils/audio';

interface WalletModalProps {
  balance: number;
  currentUser: UserAccount | null;
  onClose: () => void;
  onWithdrawSuccess: (transaction: Transaction, request: WithdrawalRequest) => void;
  language?: Language;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  balance,
  currentUser,
  onClose,
  onWithdrawSuccess,
  language = 'bn'
}) => {
  const isBn = language === 'bn';
  const selectedGateway = 'bKash Personal';
  const accountType = 'personal';

  // TWO-STEP WITHDRAWAL STATE (Step 1: Number & Amount ONLY; Step 2: Secure Password/PIN Confirmation)
  const [step, setStep] = useState<1 | 2>(1);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalReceipt, setWithdrawalReceipt] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const quickAmounts = [100, 250, 500, 1000, 2000];

  const handleQuickAmount = (val: number) => {
    playSound('click');
    setAmount(String(val));
    setErrorMessage('');
  };

  // STEP 1 VALIDATION: bKash Personal Number & Amount ONLY (NO Password Upfront)
  const handleContinueToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser || !currentUser.password) {
      playSound('error');
      setErrorMessage(
        isBn
          ? 'টাকা উত্তোলন করতে আগে আপনার রেজিস্টার্ড অ্যাকাউন্টে লগইন করুন!'
          : 'Please log in to your registered account before withdrawing.'
      );
      return;
    }

    if (currentUser.isBlocked) {
      playSound('error');
      setErrorMessage(
        isBn
          ? 'আপনার একাউন্টটি বর্তমানে স্থগিত (Blocked) রয়েছে। উইথড্রয়াল সম্ভব নয়।'
          : 'Account is currently blocked by Admin.'
      );
      return;
    }

    const cleanNum = accountNumber.replace(/\D/g, '');
    if (!/^01\d{9}$/.test(cleanNum)) {
      playSound('error');
      setErrorMessage(
        isBn
          ? 'সঠিক ১১ ডিজিটের বিকাশ পার্সোনাল নম্বর দিন (যেমন: 01XXXXXXXXX)'
          : 'Enter a valid 11-digit bKash Personal number'
      );
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < 100) {
      playSound('error');
      setErrorMessage(isBn ? 'সর্বনিম্ন উত্তোলনের পরিমাণ ১০০ টাকা' : 'Minimum withdrawal amount is ৳100');
      return;
    }

    if (numAmount > balance) {
      playSound('error');
      setErrorMessage(
        isBn
          ? `অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${balance.toFixed(2)}`
          : `Insufficient balance! Your balance is ৳${balance.toFixed(2)}`
      );
      return;
    }

    playSound('click');
    setSecurityPassword('');
    setStep(2);
  };

  // STEP 2 CONFIRMATION: Strict Account Password / PIN Verification
  const handleFinalConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser || !currentUser.password) {
      playSound('error');
      setErrorMessage(
        isBn
          ? 'টাকা উত্তোলন করতে আগে আপনার রেজিস্টার্ড অ্যাকাউন্টে লগইন করুন!'
          : 'Please log in to your registered account.'
      );
      return;
    }

    if (!securityPassword || securityPassword !== currentUser.password) {
      playSound('error');
      setErrorMessage(
        isBn
          ? 'ভুল পাসওয়ার্ড / পিন! নিরাপত্তার স্বার্থে টাকা উত্তোলন প্রত্যাখ্যান করা হয়েছে। সঠিক পাসওয়ার্ড দিন।'
          : 'Incorrect Password/PIN! Withdrawal strictly rejected.'
      );
      return;
    }

    const cleanNum = accountNumber.replace(/\D/g, '');
    const numAmount = parseInt(amount, 10);

    setIsProcessing(true);
    playSound('coin');

    setTimeout(() => {
      const generatedTrxId = 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase();

      const newTx: Transaction = {
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        type: 'withdrawal',
        title: `${selectedGateway} ক্যাশ আউট (ব্যক্তিগত)`,
        amount: numAmount,
        date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        method: selectedGateway,
        account: cleanNum.slice(0, 5) + '***' + cleanNum.slice(-3),
        trxId: generatedTrxId
      };

      const newReq: WithdrawalRequest = {
        id: 'WDR-' + Math.floor(1000 + Math.random() * 9000),
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: cleanNum,
        method: selectedGateway,
        accountType,
        accountNumber: cleanNum,
        amount: numAmount,
        date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        trxId: generatedTrxId
      };

      onWithdrawSuccess(newTx, newReq);
      setIsProcessing(false);
      setWithdrawalReceipt(newTx);
      playSound('success');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header with Prominent Top-Right Close (×) Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isBn ? 'নিরাপদ টাকা উত্তোলন' : 'Secure Cashout'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
                  {withdrawalReceipt ? 'সফল' : `ধাপ ${step}/২`}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'অফিশিয়াল বিকাশ পার্সোনাল (01312839525) পেআউট' : 'Official bKash Personal Payout'}
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
            aria-label="উইথড্রয়াল উইন্ডো বন্ধ করুন"
            title={isBn ? 'বন্ধ করুন (×)' : 'Close (×)'}
          >
            &times;
          </button>
        </div>

        {/* Two-Step Progress Bar */}
        {!withdrawalReceipt && (
          <div className="grid grid-cols-2 gap-2 px-6 pt-3">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          </div>
        )}

        {withdrawalReceipt ? (
          /* Receipt Screen */
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
                পেন্ডিং এডমিন রিভিউ (Processing)
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                উত্তোলন রিকোয়েস্ট সফল!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার পাসওয়ার্ড যাচাই সম্পন্ন হয়েছে। অল্প সময়ের মধ্যে বিকাশ একাউন্টে টাকা পৌঁছাবে।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">পেমেন্ট গেটওয়ে:</span>
                <span className="font-bold text-slate-900 dark:text-white">{withdrawalReceipt.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">প্রাপক একাউন্ট:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{withdrawalReceipt.account}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">পরিমাণ:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">৳{withdrawalReceipt.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500">সার্ভিস ফি:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳০ (সম্পূর্ণ ফ্রি)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">ট্র্যাকিং TrxID:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{withdrawalReceipt.trxId}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        ) : step === 1 ? (
          /* STEP 1: Enter bKash Personal Number & Amount ONLY (NO Password Field Upfront) */
          <form onSubmit={handleContinueToStep2} className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">আপনার উত্তোলনযোগ্য ব্যালেন্স</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ৳{balance.toFixed(2)} BDT
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ০% চার্জ
                </span>
                <p className="text-[10px] text-slate-400 mt-1">মিনিমাম ৳১০০</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border-2 border-pink-500 bg-gradient-to-r from-pink-50/90 to-rose-50/60 dark:from-pink-950/40 dark:to-rose-950/30 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-pink-600/30">
                  BK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">বিকাশ পার্সোনাল</span>
                    <span className="text-[10px] bg-pink-600 text-white font-bold px-1.5 py-0.5 rounded">Official</span>
                  </div>
                  <p className="text-[11px] text-pink-700 dark:text-pink-300 font-semibold mt-0.5">
                    অফিশিয়াল নম্বর: 01312839525 (Personal)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">০% চার্জ</span>
                <p className="text-[10px] text-slate-400">ইনস্ট্যান্ট</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'আপনার বিকাশ পার্সোনাল নম্বর (01XXXXXXXXX) *' : 'Your bKash Personal Number (01XXXXXXXXX) *'}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3.5 top-3 text-pink-500" />
                <input
                  type="tel"
                  required
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs sm:text-sm tracking-wider outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'উত্তোলনের পরিমাণ (টাকা) *' : 'Withdrawal Amount (BDT) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  required
                  min={100}
                  placeholder="উত্তোলনের পরিমাণ লিখুন (যেমন: 500)"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickAmount(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      amount === String(q)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    ৳{q}
                  </button>
                ))}
                {balance >= 100 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(Math.floor(balance))}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-300 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 cursor-pointer"
                  >
                    সব (৳{Math.floor(balance)})
                  </button>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isBn ? 'পরবর্তী ধাপ (এগিয়ে যান)' : 'Continue to Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: Final Security Confirmation with Account Password / PIN */
          <form onSubmit={handleFinalConfirmWithdraw} className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-extrabold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                {isBn ? 'চূড়ান্ত ক্যাশআউট বিবরণী যাচাই:' : 'Verify Cashout Summary:'}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">বিকাশ পার্সোনাল নম্বর:</span>
                <strong className="font-mono text-slate-900 dark:text-white">{accountNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">উত্তোলনের পরিমাণ:</span>
                <strong className="text-base font-black text-pink-600 dark:text-pink-400">৳{amount} BDT</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সার্ভিস চার্জ:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">৳০.০০ (ফ্রি)</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/70 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>{isBn ? 'একাউন্ট পাসওয়ার্ড / পিন দিন *' : 'Enter Account Password / PIN *'}</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                  নিরাপত্তা যাচাই
                </span>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder={isBn ? 'আপনার একাউন্টের পাসওয়ার্ড / পিন লিখুন...' : 'Enter your account password...'}
                  value={securityPassword}
                  onChange={(e) => {
                    setSecurityPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-400 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>সঠিক পাসওয়ার্ড ছাড়া ক্যাশআউট কঠোরভাবে প্রত্যাখ্যান করা হবে</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  playSound('click');
                  setErrorMessage('');
                  setStep(1);
                }}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>যাচাই ও প্রসেসিং হচ্ছে...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isBn ? `নিশ্চিত করুন (৳${amount})` : `Confirm Cashout (৳${amount})`}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
