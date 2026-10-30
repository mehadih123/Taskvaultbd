import { Product, MicroJob, QuizQuestion, Transaction, NotificationItem, Order, TaskProofSubmission, UserAccount, WithdrawalRequest, FeedbackItem } from '../types';

// Clean production state: NO pre-seeded demo accounts
export const INITIAL_USERS: UserAccount[] = [];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [];

export const INITIAL_FEEDBACK_ITEMS: FeedbackItem[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_MICRO_JOBS: MicroJob[] = [
  {
    id: 'job-1',
    title: 'ইউটিউব ভিডিও ৩ মিনিট দেখে লাইক ও সাবস্ক্রাইব করুন',
    category: 'youtube',
    platform: 'YouTube',
    reward: 18,
    estimatedTime: '৩ মিনিট',
    completedSlots: 0,
    totalSlots: 500,
    instructions: [
      'নিচের বাটনে ক্লিক করে অফিশিয়াল চ্যানেলটি খুলুন।',
      'সর্বশেষ ভিডিওটি কমপক্ষে ৩ মিনিট দেখুন এবং লাইক দিন।',
      'চ্যানেল সাবস্ক্রাইব করে বেল আইকন অল (All) করে দিন।',
      'আপনার সাবস্ক্রাইব করা অবস্থার স্ক্রিনশট বা ইউটিউব হ্যান্ডেল জমা দিন।'
    ],
    proofPlaceholder: 'আপনার YouTube ইউজারনেম অথবা স্ক্রিনশট লিঙ্ক লিখুন...',
    targetUrl: 'https://youtube.com',
    status: 'active'
  },
  {
    id: 'job-2',
    title: 'ফেসবুক পেজে লাইক, ফলো ও পিন পোস্টে কমেন্ট করুন',
    category: 'facebook',
    platform: 'Facebook',
    reward: 12,
    estimatedTime: '১ মিনিট',
    completedSlots: 0,
    totalSlots: 1000,
    instructions: [
      'পেজ লিংকে গিয়ে লাইক ও ফলো বাটনে ক্লিক করুন।',
      'পেজের পিন করা পোস্টে গঠনমূলক একটি পজিটিভ কমেন্ট করুন।',
      'আপনার ফেসবুক প্রোফাইল নাম প্রমাণ হিসেবে দিন।'
    ],
    proofPlaceholder: 'আপনার ফেসবুক প্রোফাইল নাম লিখুন...',
    targetUrl: 'https://facebook.com',
    status: 'active'
  },
  {
    id: 'job-3',
    title: 'অফিসিয়াল টেলিগ্রাম আর্নিং চ্যানেলে জয়েন করুন',
    category: 'telegram',
    platform: 'Telegram',
    reward: 15,
    estimatedTime: '১ মিনিট',
    completedSlots: 0,
    totalSlots: 1500,
    instructions: [
      'টেলিগ্রাম গ্রুপ লিংকে ক্লিক করে জয়েন করুন।',
      'গ্রুপের নোটিফিকেশন আনমিউট রাখুন।',
      'আপনার টেলিগ্রাম ইউজারনেম (@username) সাবমিট করুন।'
    ],
    proofPlaceholder: 'আপনার টেলিগ্রাম @username লিখুন...',
    targetUrl: 'https://t.me',
    status: 'active'
  }
];

export const INITIAL_PROOF_SUBMISSIONS: TaskProofSubmission[] = [];

export const INITIAL_ORDERS: Order[] = [];

// Extremely simple General Knowledge MCQ questions (+50 Coins each)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'বাংলাদেশের রাজধানীর নাম কি?',
    options: ['ঢাকা', 'চট্টগ্রাম', 'খুলনা', 'রাজশাহী'],
    correctIndex: 0,
    explanation: 'বাংলাদেশের রাজধানী হলো ঢাকা।',
    reward: 50
  },
  {
    id: 'q-2',
    question: 'বাংলাদেশের জাতীয় ফুল কোনটি?',
    options: ['গোলাপ', 'শাপলা', 'জবা', 'সূর্যমুখী'],
    correctIndex: 1,
    explanation: 'সাদা শাপলা বাংলাদেশের জাতীয় ফুল।',
    reward: 50
  },
  {
    id: 'q-3',
    question: 'বাংলাদেশের জাতীয় ফল কোনটি?',
    options: ['আম', 'কাঁঠাল', 'কলা', 'লিচু'],
    correctIndex: 1,
    explanation: 'কাঁঠাল বাংলাদেশের জাতীয় ফল।',
    reward: 50
  },
  {
    id: 'q-4',
    question: '১ সপ্তাহে কত দিন?',
    options: ['৫ দিন', '৬ দিন', '৭ দিন', '৮ দিন'],
    correctIndex: 2,
    explanation: '১ সপ্তাহে ৭ দিন।',
    reward: 50
  },
  {
    id: 'q-5',
    question: 'বাংলাদেশের জাতীয় পাখি কোনটি?',
    options: ['টিয়া', 'দোয়েল', 'ময়না', 'কবুতর'],
    correctIndex: 1,
    explanation: 'দোয়েল বাংলাদেশের জাতীয় পাখি।',
    reward: 50
  },
  {
    id: 'q-6',
    question: 'বাংলাদেশের মুদ্রার নাম কি?',
    options: ['রুপি', 'টাকা', 'ডলার', 'রিয়াল'],
    correctIndex: 1,
    explanation: 'বাংলাদেশের মুদ্রার নাম টাকা (BDT)।',
    reward: 50
  },
  {
    id: 'q-7',
    question: 'সূর্য কোন দিকে ওঠে?',
    options: ['পূর্ব দিকে', 'পশ্চিম দিকে', 'উত্তর দিকে', 'দক্ষিণ দিকে'],
    correctIndex: 0,
    explanation: 'সূর্য পূর্ব দিকে উদিত হয়।',
    reward: 50
  },
  {
    id: 'q-8',
    question: 'বাংলাদেশের জাতীয় মাছ কোনটি?',
    options: ['রুই', 'ইলিশ', 'কাতলা', 'পাঙ্গাশ'],
    correctIndex: 1,
    explanation: 'ইলিশ বাংলাদেশের জাতীয় মাছ।',
    reward: 50
  },
  {
    id: 'q-9',
    question: '১ বছরে কত মাস?',
    options: ['১০ মাস', '১১ মাস', '১২ মাস', '১৪ মাস'],
    correctIndex: 2,
    explanation: '১ বছরে মোট ১২ মাস।',
    reward: 50
  },
  {
    id: 'q-10',
    question: 'বাংলাদেশের বিজয় দিবস কবে?',
    options: ['২১ ফেব্রুয়ারি', '২৬ মার্চ', '১৬ ডিসেম্বর', '১৪ এপ্রিল'],
    correctIndex: 2,
    explanation: '১৬ ডিসেম্বর বাংলাদেশের মহান বিজয় দিবস।',
    reward: 50
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    title: 'TaskVault BD তে স্বাগতম!',
    message: 'ম্যাথ টাস্ক ও কুইজ জব সমাধান করে ৫০ কয়েন করে আয় করুন এবং ১,০০০ কয়েনে ৳১.০০ মূল ওয়ালেটে কনভার্ট করুন।',
    time: 'এইমাত্র',
    type: 'earning',
    read: false
  }
];
