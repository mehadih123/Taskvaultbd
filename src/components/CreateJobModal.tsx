import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  Clock,
  Users
} from 'lucide-react';
import { MicroJob, Language } from '../types';
import { playSound } from '../utils/audio';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJob: (job: MicroJob) => void;
  language: Language;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
  language
}) => {
  const isBn = language === 'bn';

  // Category minimum reward configuration
  const CATEGORY_MIN_REWARDS: Record<string, { min: number; label: string; labelEn: string }> = {
    youtube: { min: 3.5, label: 'ইউটিউব (ভিডিও ওয়াচ, সাবস্ক্রাইব) - ন্যূনতম ৳৩.৫০', labelEn: 'YouTube (Watch, Sub) - Min ৳3.50' },
    facebook: { min: 2, label: 'ফেসবুক (পেজ লাইক, ফলো, শেয়ার) - ন্যূনতম ৳২.০০', labelEn: 'Facebook (Like, Follow) - Min ৳2.00' },
    telegram: { min: 2, label: 'টেলিগ্রাম (চ্যানেল/গ্রুপ জয়েন) - ন্যূনতম ৳২.০০', labelEn: 'Telegram (Join Group) - Min ৳2.00' },
    app: { min: 15, label: 'অ্যাপ ইন্সটল ও রেজিস্ট্রেশন - ন্যূনতম ৳১৫.০০', labelEn: 'App Install & Signup - Min ৳15.00' },
    review: { min: 10, label: 'গুগল ম্যাপ ও প্লে-স্টোর রিভিউ - ন্যূনতম ৳১০.০০', labelEn: 'Map & Store Review - Min ৳10.00' }
  };

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [category, setCategory] = useState<'youtube' | 'facebook' | 'telegram' | 'app' | 'review'>('youtube');
  const [targetUrl, setTargetUrl] = useState('');
  
  // Custom instructions start completely empty with clean placeholders
  const [instructionsText, setInstructionsText] = useState('');
  
  // Dynamic proof requirements selection
  const [reqScreenshot, setReqScreenshot] = useState(true);
  const [reqUsername, setReqUsername] = useState(true);
  const [reqTrxId, setReqTrxId] = useState(false);
  const [reqComment, setReqComment] = useState(false);
  const [customProofNote, setCustomProofNote] = useState('');
  
  // Budget & Worker calculations (Minimum enforced based on category)
  const [rewardPerWorker, setRewardPerWorker] = useState<number>(3.5);
  const [workerCount, setWorkerCount] = useState<number>(50);
  const [estimatedTime, setEstimatedTime] = useState('২ মিনিট');

  // Payment Verification (Empty initial state)
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Calculations: Strictly 8% Platform Verification Fee
  const workerTotal = Math.round(rewardPerWorker * workerCount * 100) / 100;
  const platformFee = Math.ceil(workerTotal * 0.08); // Strictly 8% fee
  const totalPayable = Math.round((workerTotal + platformFee) * 100) / 100;

  const currentMinReward = CATEGORY_MIN_REWARDS[category]?.min || 2;

  const handleCategoryChange = (newCat: 'youtube' | 'facebook' | 'telegram' | 'app' | 'review') => {
    setCategory(newCat);
    setPlatform(newCat.toUpperCase());
    const minForCat = CATEGORY_MIN_REWARDS[newCat]?.min || 2;
    if (rewardPerWorker < minForCat) {
      setRewardPerWorker(minForCat);
    }
  };

  // Compile full proof instructions from dynamic checkboxes + custom notes
  const buildProofRequirementString = () => {
    const parts: string[] = [];
    if (reqScreenshot) parts.push(isBn ? 'কাজের চূড়ান্ত স্ক্রিনশট' : 'Task screenshot');
    if (reqUsername) parts.push(isBn ? 'ইউজারনেম/চ্যানেল নাম' : 'Username / profile name');
    if (reqTrxId) parts.push(isBn ? 'লেনদেন TrxID' : 'Transaction ID');
    if (reqComment) parts.push(isBn ? 'করা কমেন্ট/মন্তব্য' : 'Comment text');
    if (customProofNote.trim()) parts.push(customProofNote.trim());
    return parts.length > 0 ? parts.join(' + ') : (isBn ? 'কাজের যথার্থ প্রমাণ' : 'Valid proof of work');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(isBn ? 'কাজের শিরোনাম লিখুন' : 'Enter job title');
      playSound('error');
      return;
    }

    if (!instructionsText.trim()) {
      setError(isBn ? 'কাজের সঠিক নিয়মাবলী (Instructions) লিখুন' : 'Please provide detailed instructions');
      playSound('error');
      return;
    }

    if (rewardPerWorker < currentMinReward) {
      setError(isBn 
        ? `এই ক্যাটাগরির জন্য ন্যূনতম রিওয়ার্ড ৳${currentMinReward} BDT হতে হবে` 
        : `Minimum reward for this category is ৳${currentMinReward} BDT`);
      playSound('error');
      return;
    }

    const cleanPhone = senderPhone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      setError(isBn ? 'সঠিক ১১ ডিজিটের বিকাশ নম্বর দিন' : 'Enter a valid 11-digit bKash number');
      playSound('error');
      return;
    }

    if (!trxId.trim() || trxId.length < 6) {
      setError(isBn ? 'সঠিক বিকাশ Transaction ID (TrxID) প্রদান করুন' : 'Provide a valid bKash Transaction ID');
      playSound('error');
      return;
    }

    setIsSubmitting(true);
    playSound('coin');

    setTimeout(() => {
      const instructions = instructionsText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      const generatedProof = buildProofRequirementString();

      const newJob: MicroJob = {
        id: 'user-job-' + Date.now(),
        title: title.trim(),
        titleEn: title.trim(),
        category,
        platform,
        reward: Number(rewardPerWorker),
        estimatedTime,
        completedSlots: 0,
        totalSlots: Number(workerCount),
        instructions: instructions.length > 0 ? instructions : [instructionsText.trim()],
        proofPlaceholder: generatedProof,
        targetUrl: targetUrl || 'https://youtube.com',
        isUserGenerated: true,
        postedBy: senderPhone,
        senderPhone: senderPhone.trim(),
        paymentTrxId: trxId.trim().toUpperCase(),
        totalBudget: totalPayable,
        status: 'pending_admin_approval',
        createdAt: isBn ? 'আজ, এইমাত্র' : 'Just now'
      };

      onSubmitJob(newJob);
      setIsSubmitting(false);
      setIsSuccess(true);
      playSound('success');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isBn ? 'নতুন মাইক্রো-জব পোস্ট করুন' : 'Post a New Micro Job'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'হাজার হাজার দক্ষ ওয়ার্কার দিয়ে আপনার চ্যানেল ও পেজ প্রমোট করুন' : 'Promote your channel or page with active workers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Close Create Job Modal"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
              {isBn ? 'এডমিন যাচাইয়ের অপেক্ষায় (Pending Admin Approval)' : 'Pending Admin Verification'}
            </span>

            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              {isBn ? 'আপনার জব পোস্ট সফলভাবে গৃহীত হয়েছে!' : 'Job Submitted Successfully!'}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {isBn 
                ? 'আপনার দেওয়া bKash TrxID এবং পেমেন্ট এডমিন টিম যাচাই করার পর কাজটি স্বয়ংক্রিয়ভাবে লাইভ বোর্ডে প্রকাশিত হবে।'
                : 'Our admin team is verifying your payment TrxID. The task will go live immediately after approval.'}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left max-w-sm mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">কাজের নাম:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">মোট ওয়ার্কার:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{workerCount} জন</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিশোধিত বাজেট:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">৳{totalPayable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{trxId.toUpperCase()}</span>
              </div>
            </div>

            <button
              onClick={() => { playSound('click'); onClose(); }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              {isBn ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        ) : (
          /* Job Creation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Job Title & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'কাজের শিরোনাম (Job Title) *' : 'Job Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isBn ? 'যেমন: ইউটিউব চ্যানেল সাবস্ক্রাইব ও লাইক' : 'e.g. Subscribe to YouTube Channel'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'প্ল্যাটফর্ম ও ক্যাটাগরি *' : 'Platform & Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
                >
                  <option value="youtube">YouTube (ভিডিও ওয়াচ, লাইক, সাবস্ক্রাইব - নূন্যতম ৳৩.৫০)</option>
                  <option value="facebook">Facebook (পেজ ফলো, শেয়ার, লাইক - নূন্যতম ৳২.০০)</option>
                  <option value="telegram">Telegram (গ্রুপ বা চ্যানেল জয়েন - নূন্যতম ৳২.০০)</option>
                  <option value="app">App Install (প্লে-স্টোর অ্যাপ ইন্সটল - নূন্যতম ৳১৫.০০)</option>
                  <option value="review">Reviews & Rating (গুগল ম্যাপ/রিভিউ - নূন্যতম ৳১০.০০)</option>
                </select>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                  {isBn ? `ন্যূনতম অনুমোদিত রিওয়ার্ড: ৳${currentMinReward} BDT` : `Minimum allowed reward: ৳${currentMinReward} BDT`}
                </p>
              </div>
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'টার্গেট লিংক (Target URL) *' : 'Target URL *'}
              </label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/@yourchannel..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Custom Instructions */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'কাজের নিয়মাবলী (Custom Instructions) *' : 'Custom Instructions *'}
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isBn ? 'ওয়ার্কারদের যা করতে হবে তা লিখুন' : 'Write steps workers must follow'}
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                placeholder={isBn ? "১. উপরের লিংকে ক্লিক করে চ্যানেলে যান\n২. যেকোনো একটি ভিডিও ২ মিনিট দেখুন\n৩. সাবস্ক্রাইব করে বেল বাজান" : "1. Visit the link\n2. Watch video for 2 minutes\n3. Subscribe and like"}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
              />
            </div>

            {/* Dynamic Proof Requirements Selection */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isBn ? 'প্রয়োজনীয় প্রমাণের তালিকা (Proof Requirements) *' : 'Proof Requirements *'}
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {isBn ? 'স্বয়ংক্রিয় প্রুফ ফিল্ড যুক্ত হবে' : 'Auto appends proof fields'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqScreenshot}
                    onChange={(e) => setReqScreenshot(e.target.checked)}
                    className="accent-emerald-600 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{isBn ? 'স্ক্রিনশট প্রমাণ' : 'Screenshot'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqUsername}
                    onChange={(e) => setReqUsername(e.target.checked)}
                    className="accent-emerald-600 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{isBn ? 'ইউজারনেম / আইডি' : 'Username/ID'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqTrxId}
                    onChange={(e) => setReqTrxId(e.target.checked)}
                    className="accent-emerald-600 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{isBn ? 'লেনদেন TrxID' : 'Transaction ID'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqComment}
                    onChange={(e) => setReqComment(e.target.checked)}
                    className="accent-emerald-600 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{isBn ? 'মন্তব্য / রিভিউ টেক্সট' : 'Comment/Review'}</span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={customProofNote}
                  onChange={(e) => setCustomProofNote(e.target.value)}
                  placeholder={isBn ? 'অতিরিক্ত কোনো প্রমাণ চাইলে লিখুন (ঐচ্ছিক)...' : 'Additional proof note (optional)...'}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">{isBn ? 'ওয়ার্কারের জমা দিতে হবে: ' : 'Worker must submit: '}</span>
                <span>{buildProofRequirementString()}</span>
              </div>
            </div>

            {/* Reward & Worker Calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                  {isBn ? `ওয়ার্কার রিওয়ার্ড (প্রতি কাজে ৳, নূন্যতম ৳${currentMinReward})` : `Worker Reward (Min ৳${currentMinReward})`}
                </label>
                <input
                  type="number"
                  min={currentMinReward}
                  step={0.5}
                  value={rewardPerWorker}
                  onChange={(e) => setRewardPerWorker(Math.max(currentMinReward, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-sm font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                  {isBn ? 'কতজন ওয়ার্কার প্রয়োজন?' : 'Workers Needed'}
                </label>
                <input
                  type="number"
                  min={10}
                  step={5}
                  value={workerCount}
                  onChange={(e) => setWorkerCount(Math.max(10, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-sm font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Total Budget Breakdown (8% Verification Fee) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>ওয়ার্কার খরচ ({workerCount} × ৳{rewardPerWorker}):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">৳{workerTotal} BDT</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>প্ল্যাটফর্ম ভেরিফিকেশন ফি (৮%):</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">৳{platformFee} BDT</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700 text-sm">
                <span>সর্বমোট প্রদেয় বাজেট (Total Payable):</span>
                <span className="text-emerald-600 dark:text-emerald-400">৳{totalPayable} BDT</span>
              </div>
            </div>

            {/* Payment Instructions Section */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/20 border border-pink-200/80 dark:border-pink-800/60 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-pink-600" />
                <span className="font-bold text-xs text-pink-900 dark:text-pink-300 uppercase">
                  {isBn ? 'পেমেন্ট নির্দেশিকা (Payment Instructions)' : 'Payment Instructions'}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-pink-100 dark:border-pink-900/40">
                <p>
                  ১. আপনার বিকাশ অ্যাপ থেকে <strong>Send Money</strong> করুন:
                </p>
                <div className="p-2.5 rounded-xl bg-pink-100/90 dark:bg-pink-950/70 font-mono font-bold text-pink-700 dark:text-pink-300 text-sm flex items-center justify-between border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black tracking-wide">01312839525</span>
                    <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">(পার্সোনাল)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-pink-600 text-white px-2 py-0.5 rounded-full">বিকাশ পার্সোনাল</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  ২. পরিমাণ: <strong>৳{totalPayable} BDT</strong> পাঠান এবং ফিরতি এসএমএসের <strong>TrxID</strong> নিচে লিখুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'প্রেরক মোবাইল নম্বর *' : 'Sender Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'Transaction ID (TrxID) *' : 'Transaction ID (TrxID) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. BK7X90124M"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { playSound('click'); onClose(); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isBn ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>{isBn ? `পেমেন্ট সম্পন্ন ও সাবমিট (৳${totalPayable})` : `Submit Job (৳${totalPayable})`}</span>
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
