import React, { useState } from 'react';
import { 
  Briefcase, 
  Youtube, 
  Facebook, 
  Send, 
  Smartphone, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles, 
  Upload, 
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { MicroJob, Language } from '../types';
import { playSound } from '../utils/audio';

interface MicroJobsSectionProps {
  jobs: MicroJob[];
  onCompleteJob: (job: MicroJob, proof: string) => void;
  onOpenCreateJob: () => void;
  onShowToast: (msg: string) => void;
  language: Language;
}

export const MicroJobsSection: React.FC<MicroJobsSectionProps> = ({
  jobs,
  onCompleteJob,
  onOpenCreateJob,
  onShowToast,
  language
}) => {
  const isBn = language === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeJob, setActiveJob] = useState<MicroJob | null>(null);
  const [proofText, setProofText] = useState('');
  const [mockScreenshotName, setMockScreenshotName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedJobIds, setCompletedJobIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: isBn ? 'সব কাজ' : 'All Tasks' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'app', label: isBn ? 'অ্যাপ ডাউনলোড' : 'App Install' },
    { id: 'review', label: isBn ? 'রিভিউ ও রেটিং' : 'Review' },
  ];

  // Only show active approved jobs to users
  const activeJobs = jobs.filter(j => j.status === 'active');
  const filteredJobs = activeJobs.filter(
    (job) => selectedCategory === 'all' || job.category === selectedCategory
  );

  const getPlatformIcon = (category: string) => {
    switch (category) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-rose-500" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-400" />;
      case 'app':
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      default:
        return <Star className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleStartJob = (job: MicroJob) => {
    playSound('click');
    setActiveJob(job);
    setProofText('');
    setMockScreenshotName(null);
  };

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMockScreenshotName(e.target.files[0].name);
      playSound('click');
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;

    if (!proofText.trim() && !mockScreenshotName) {
      playSound('error');
      alert(isBn ? 'দয়া করে আপনার কাজের প্রুফ (ইউজারনেম বা স্ক্রিনশট) জমা দিন!' : 'Please enter proof requirement!');
      return;
    }

    setIsSubmitting(true);
    playSound('cash');

    setTimeout(() => {
      const submittedJob = activeJob;
      onCompleteJob(submittedJob, proofText.trim() || mockScreenshotName || 'Proof Submitted');
      setCompletedJobIds(prev => [...prev, submittedJob.id]);
      setIsSubmitting(false);
      setActiveJob(null);
      playSound('success');
      onShowToast(isBn ? `অভিনন্দন! "${submittedJob.title}" এর প্রমাণ জমা হয়েছে। ৳${submittedJob.reward} ক্রেডিট প্রক্রিয়াধীন!` : `Proof submitted for ৳${submittedJob.reward}!`);
    }, 900);
  };

  return (
    <section id="jobs" className="py-16 sm:py-20 relative bg-slate-50/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              {isBn ? 'মাইক্রো-জব ও সহজ কাজ' : 'Micro Jobs & Instant Tasks'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'ছোট ছোট কাজ করে প্রতিদিন আয়' : 'Earn Daily with Simple Micro Tasks'}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {isBn 
                ? 'ইউটিউব, ফেসবুক ও টেলিগ্রাম টাস্ক সম্পূর্ণ করে প্রতি কাজে ১০-৫০৳ আয় করুন অথবা নিজের কাজ পোস্ট করুন।' 
                : 'Complete verified social tasks for ৳10-৳50 each, or post your own tasks!'}
            </p>
          </div>

          {/* Action: Create a Job button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playSound('click');
                onOpenCreateJob();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'কাজ পোস্ট করুন (Create Job)' : 'Post a Job'}</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const isDone = completedJobIds.includes(job.id);
            const progressPercent = Math.min(100, Math.round((job.completedSlots / job.totalSlots) * 100));

            return (
              <div
                key={job.id}
                className={`glass-card p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isDone 
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Platform & Reward Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getPlatformIcon(job.category)}
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {job.platform}
                      </span>
                      {job.isUserGenerated && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                          User Job
                        </span>
                      )}
                    </div>

                    {/* Reward Badge */}
                    <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{isBn ? `রিওয়ার্ড: ৳${job.reward}` : `Reward: ৳${job.reward}`}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {job.title}
                  </h3>

                  {/* Time & Slots Info */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{isBn ? `সময়: ${job.estimatedTime}` : `Time: ${job.estimatedTime}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.completedSlots}/{job.totalSlots} {isBn ? 'সম্পন্ন' : 'done'}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {isDone ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? 'প্রমাণ জমা হয়েছে' : 'Proof Submitted'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartJob(job)}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>{isBn ? 'কাজ শুরু করুন ও প্রমাণ দিন' : 'Start Task & Submit Proof'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Modal */}
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(activeJob.category)}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {activeJob.platform} {isBn ? 'মাইক্রো-জব' : 'Task'}
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      {isBn ? `রিওয়ার্ড: ৳${activeJob.reward} BDT` : `Reward: ৳${activeJob.reward} BDT`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { playSound('click'); setActiveJob(null); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {activeJob.title}
                </h4>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase mb-2">
                    {isBn ? 'কাজের নিয়মাবলী (Steps to follow):' : 'Instructions:'}
                  </h5>
                  <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {activeJob.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <a
                  href={activeJob.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('click')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  <span>{isBn ? 'কাজ করার পেজ বা চ্যানেল ওপেন করুন' : 'Open Target Link'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
                </a>

                {/* Proof Form */}
                <form onSubmit={handleSubmitProof} className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'কাজের প্রমাণ (Proof Submission) *' : 'Proof Submission *'}
                    </label>
                    <textarea
                      rows={2}
                      required={!mockScreenshotName}
                      placeholder={activeJob.proofPlaceholder}
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {isBn ? 'স্ক্রিনশট আপলোড (ঐচ্ছিক)' : 'Upload Screenshot (Optional)'}
                    </label>
                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 cursor-pointer text-xs text-slate-500">
                      <Upload className="w-4 h-4 text-cyan-500" />
                      <span>{mockScreenshotName ? mockScreenshotName : (isBn ? 'ক্লিক করে স্ক্রিনশট ফাইল দিন' : 'Select Screenshot')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMockUpload}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveJob(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>{isBn ? 'যাচাই হচ্ছে...' : 'Submitting...'}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isBn ? `প্রুফ জমা দিন (রিওয়ার্ড ৳${activeJob.reward})` : `Submit Proof (৳${activeJob.reward})`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
