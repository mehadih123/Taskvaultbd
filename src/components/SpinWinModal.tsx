import React, { useState } from 'react';
import { X, Sparkles, Trophy, Coins, RotateCw, AlertCircle, ShieldCheck, Plus, Minus, ShoppingCart } from 'lucide-react';
import { playSound } from '../utils/audio';
import { Language } from '../types';

interface SpinWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSpinWin: (entryCost: number, prizeWon: number) => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const SpinWinModal: React.FC<SpinWinModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSpinWin,
  onShowToast,
  language = 'bn'
}) => {
  const isBn = language === 'bn';
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Available spins state
  const [availableSpins, setAvailableSpins] = useState<number>(() => {
    const saved = localStorage.getItem('taskvault_spins');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Spin Purchase Modal State
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseError, setPurchaseError] = useState('');

  // 4 distinct winning slots (৳5, ৳10, ৳15, ৳20) with upright centered SVG labels
  const segments = [
    { prize: 5, label: '৳5', color: '#ec4899' },   // top-right (0° to 90°)
    { prize: 10, label: '৳10', color: '#06b6d4' }, // bottom-right (90° to 180°)
    { prize: 15, label: '৳15', color: '#10b981' }, // bottom-left (180° to 270°)
    { prize: 20, label: '৳20', color: '#f59e0b' }  // top-left (270° to 360°)
  ];

  const handlePurchaseSpins = () => {
    setPurchaseError('');
    const totalCost = purchaseQty * 10;
    if (balance < totalCost) {
      playSound('error');
      setPurchaseError(`অপর্যাপ্ত ব্যালেন্স! আপনার ব্যালেন্স ৳${balance} BDT। ${purchaseQty}টি স্পিন কিনতে ৳${totalCost} প্রয়োজন।`);
      return;
    }

    // Deduct cost from main wallet
    onSpinWin(totalCost, 0);
    const newSpins = availableSpins + purchaseQty;
    setAvailableSpins(newSpins);
    localStorage.setItem('taskvault_spins', newSpins.toString());
    playSound('coin');
    setShowPurchaseModal(false);
    onShowToast(`সফল! ৳${totalCost} দিয়ে ${purchaseQty}টি স্পিন ক্রয় সম্পন্ন হয়েছে।`);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setErrorMessage('');

    if (availableSpins <= 0) {
      playSound('click');
      setShowPurchaseModal(true);
      return;
    }

    setIsSpinning(true);
    setLastWin(null);
    playSound('click');

    // Deduct 1 spin
    const remainingSpins = availableSpins - 1;
    setAvailableSpins(remainingSpins);
    localStorage.setItem('taskvault_spins', remainingSpins.toString());

    // Pick a winning index (0 to 3)
    const winIndex = Math.floor(Math.random() * segments.length);
    const winSlot = segments[winIndex];

    // Segment angle is 360 / 4 = 90 deg; align exact winning slice center to top pointer (0 deg)
    const segAngle = 360 / segments.length;
    const sliceCenter = winIndex * segAngle + segAngle / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const targetMod = (360 - sliceCenter) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const finalRot = rotation + 5 * 360 + delta;

    setRotation(finalRot);

    // 4 seconds animation duration
    setTimeout(() => {
      setIsSpinning(false);
      setLastWin(winSlot.prize);
      playSound('coin');
      // Credit prize directly to wallet
      onSpinWin(0, winSlot.prize);
      onShowToast(isBn ? `অভিনন্দন! আপনি জিতেছেন ৳${winSlot.prize}!` : `Congratulations! You won ৳${winSlot.prize}!`);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isBn ? 'স্পিন & উইন হুইল' : 'Spin & Win Wheel'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'প্রতি স্পিন ৳১০ • জিতুন ৳৫ থেকে ৳২০ সরাসরি ওয়ালেটে' : 'Cost ৳10 • Win ৳5 to ৳20 directly to wallet'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isSpinning) return;
              playSound('click');
              onClose();
            }}
            disabled={isSpinning}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all shadow-sm cursor-pointer disabled:opacity-40 shrink-0"
            aria-label="Close Spin Modal"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Current Wallet Balance & Available Spins Banner */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px]">ওয়ালেট ব্যালেন্স:</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              ৳{balance.toFixed(2)} BDT
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px]">অবশিষ্ট স্পিন:</span>
              <button 
                onClick={() => { playSound('click'); setShowPurchaseModal(true); }}
                className="text-[10px] text-purple-600 dark:text-purple-400 font-bold underline cursor-pointer"
              >
                + স্পিন কিনুন
              </button>
            </div>
            <span className="font-black text-purple-600 dark:text-purple-400 text-sm">
              {availableSpins} টি স্পিন
            </span>
          </div>
        </div>

        {/* Wheel Container */}
        <div className="my-6 flex flex-col items-center justify-center relative">
          
          {/* Top Indicator Arrow */}
          <div className="relative z-20 -mb-4 text-rose-600 drop-shadow-xl animate-bounce">
            <svg className="w-9 h-9 fill-current filter drop-shadow-md" viewBox="0 0 24 24">
              <path d="M12 22l-8-12h16l-8 12z"/>
            </svg>
          </div>

          {/* Rotating Wheel Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 shadow-2xl shadow-purple-500/40">
            <div 
              className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
              }}
            >
              {/* Perfectly Aligned 4-Slice SVG Wheel with Upright, Centered Text Labels (৳5, ৳10, ৳15, ৳20) */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 4 Equal 90° Slices starting from 12 o'clock */}
                <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="#ec4899" />
                <path d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z" fill="#06b6d4" />
                <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill="#10b981" />
                <path d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z" fill="#f59e0b" />

                {/* Clean White Divider Lines */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

                {/* Upright, Strictly Centered Reward Labels inside each slice */}
                <text
                  x="69.5"
                  y="30.5"
                  transform="rotate(45 69.5 30.5)"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  className="select-none pointer-events-none"
                >
                  ৳5
                </text>
                <text
                  x="69.5"
                  y="69.5"
                  transform="rotate(135 69.5 69.5)"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  className="select-none pointer-events-none"
                >
                  ৳10
                </text>
                <text
                  x="30.5"
                  y="69.5"
                  transform="rotate(225 30.5 69.5)"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  className="select-none pointer-events-none"
                >
                  ৳15
                </text>
                <text
                  x="30.5"
                  y="30.5"
                  transform="rotate(315 30.5 30.5)"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  className="select-none pointer-events-none"
                >
                  ৳20
                </text>
              </svg>

              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-slate-900 rounded-full shadow-2xl border-4 border-purple-500 flex flex-col items-center justify-center z-10">
                <RotateCw className={`w-4 h-4 text-purple-600 ${isSpinning ? 'animate-spin' : ''}`} />
                <span className="text-[9px] font-black text-purple-600">SPIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Win Alert or Error */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {lastWin !== null && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-center animate-in zoom-in-95 duration-200">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">অভিনন্দন!</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>৳{lastWin} BDT জিতেছেন!</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-semibold">
              পুরস্কারটি সরাসরি আপনার মূল ওয়ালেটে জমা হয়েছে
            </p>
          </div>
        )}

        {/* Action Controls: Spin Button or Buy Spins */}
        <div className="space-y-2">
          {availableSpins > 0 ? (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>হুইল ঘুরছে... (অপেক্ষা করুন)</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>🎡 স্পিন ঘোরান (১টি স্পিন খরচ)</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => { playSound('click'); setShowPurchaseModal(true); }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>স্পিন ক্রয় করুন (প্রতি স্পিন ৳১০)</span>
            </button>
          )}

          <button
            onClick={() => { playSound('click'); setShowPurchaseModal(true); }}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>+ অতিরিক্ত স্পিন প্যাক কিনুন (+ / -)</span>
          </button>
        </div>

        <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>ফেয়ার এলগরিদম • সরাসরি ওয়ালেট থেকে ১০ টাকা কর্তন ও ইনস্ট্যান্ট পেআউট</span>
        </div>

      </div>

      {/* ৳10 PER SPIN PURCHASE MODAL WITH +/- INCREMENT/DECREMENT SELECTOR */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-purple-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  🎡
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  স্পিন ক্রয় করুন (প্রতি স্পিন ৳১০)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPurchaseModal(false)}
                className="w-9 h-9 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-xl leading-none flex items-center justify-center transition-all cursor-pointer shrink-0"
                aria-label="Close Spin Purchase Modal"
                title="বন্ধ করুন (×)"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500">
              আপনার মূল ওয়ালেট ব্যালেন্স থেকে সরাসরি টাকা কর্তন হবে এবং স্পিন জমা হবে।
            </p>

            {/* +/- Quantity Selector */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                স্পিনের সংখ্যা নির্বাচন করুন:
              </span>
              
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => { playSound('click'); setPurchaseQty(prev => Math.max(1, prev - 1)); }}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-purple-600 hover:text-white text-lg font-black flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono w-12 text-center">
                  {purchaseQty}
                </span>

                <button
                  type="button"
                  onClick={() => { playSound('click'); setPurchaseQty(prev => prev + 1); }}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-purple-600 hover:text-white text-lg font-black flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-purple-200 dark:border-purple-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">মোট খরচ:</span>
                <span className="text-base font-black text-rose-500">
                  ৳{purchaseQty * 10} BDT
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] px-2 text-slate-500 dark:text-slate-400">
              <span>ওয়ালেট ব্যালেন্স:</span>
              <strong className="text-emerald-500 font-mono">৳{balance.toFixed(2)} BDT</strong>
            </div>

            {purchaseError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold">
                {purchaseError}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handlePurchaseSpins}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                ৳{purchaseQty * 10} দিয়ে ক্রয় নিশ্চিত করুন
              </button>
              <button
                type="button"
                onClick={() => setShowPurchaseModal(false)}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                বাতিল
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
