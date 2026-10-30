import { Language } from '../types';

export interface GeneratedMathProblem {
  id: number;
  a: number;
  b: number;
  answer: number;
  options: number[];
}

export interface GeneratedQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface GeneratedCaptchaChallenge {
  id: number;
  code: string;
  options: string[];
  correctIndex: number;
  glyphs: { char: string; rotate: number; dy: number; color: string }[];
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnDigits(num: number | string): string {
  return String(num).replace(/\d/g, d => BN_DIGITS[Number(d)]);
}

function shuffleWithCorrect<T>(items: T[], correctItem: T): { options: T[]; correctIndex: number } {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return {
    options: arr,
    correctIndex: arr.indexOf(correctItem)
  };
}

/**
 * 50,000+ SIMPLE ADDITION (+) GENERATOR (250 x 250 = 62,500 unique addition problems)
 * Strictly NO subtraction, multiplication, or division.
 */
export function generateAdditionProblem(excludeId?: number): GeneratedMathProblem {
  let a = 1;
  let b = 1;
  let id = 1;

  for (let tries = 0; tries < 5; tries++) {
    // Mix super easy (1..30) and medium-simple (1..250) covering 62,500 unique pairs
    const useCompactRange = Math.random() < 0.65;
    a = useCompactRange ? Math.floor(Math.random() * 40) + 1 : Math.floor(Math.random() * 250) + 1;
    b = useCompactRange ? Math.floor(Math.random() * 40) + 1 : Math.floor(Math.random() * 250) + 1;
    id = (a - 1) * 250 + b; // 1 .. 62,500
    if (id !== excludeId) break;
  }

  const answer = a + b;
  const decoys = new Set<number>();
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, 10, -10];
  let idx = 0;
  while (decoys.size < 3) {
    const delta = offsets[(Math.floor(Math.random() * offsets.length) + idx++) % offsets.length];
    const candidate = answer + delta;
    if (candidate > 0 && candidate !== answer) {
      decoys.add(candidate);
    }
  }

  const { options } = shuffleWithCorrect([answer, ...Array.from(decoys)], answer);
  return { id, a, b, answer, options };
}

/**
 * Curated Core Child-Friendly GK Questions
 */
const CORE_CHILD_GK_BN: { q: string; a: string; d: [string, string, string] }[] = [
  { q: 'বাংলাদেশের রাজধানীর নাম কী?', a: 'ঢাকা', d: ['চট্টগ্রাম', 'খুলনা', 'রাজশাহী'] },
  { q: 'বাংলাদেশের জাতীয় ফুল কোনটি?', a: 'শাপলা', d: ['গোলাপ', 'জবা', 'গাঁদা'] },
  { q: 'বাংলাদেশের জাতীয় ফল কোনটি?', a: 'কাঁঠাল', d: ['আম', 'লিচু', 'কলা'] },
  { q: 'বাংলাদেশের জাতীয় পাখি কোনটি?', a: 'দোয়েল', d: ['টিয়া', 'ময়না', 'কবুতর'] },
  { q: 'বাংলাদেশের জাতীয় মাছ কোনটি?', a: 'ইলিশ', d: ['রুই', 'কাতলা', 'বোয়াল'] },
  { q: 'বাংলাদেশের জাতীয় পশু কোনটি?', a: 'রয়েল বেঙ্গল টাইগার', d: ['সিংহ', 'হাতি', 'হরিণ'] },
  { q: 'বাংলাদেশের জাতীয় গাছ কোনটি?', a: 'আম গাছ', d: ['জাম গাছ', 'বট গাছ', 'কাঁঠাল গাছ'] },
  { q: 'বাংলাদেশের জাতীয় খেলা কোনটি?', a: 'হাডুডু (কাবাডি)', d: ['ক্রিকেট', 'ফুটবল', 'ব্যাডমিন্টন'] },
  { q: 'বাংলাদেশের বিজয় দিবস কবে?', a: '১৬ ডিসেম্বর', d: ['২৬ মার্চ', '২১ ফেব্রুয়ারি', '১৪ এপ্রিল'] },
  { q: 'বাংলাদেশের স্বাধীনতা দিবস কবে?', a: '২৬ মার্চ', d: ['১৬ ডিসেম্বর', '২১ ফেব্রুয়ারি', '১৭ মার্চ'] },
  { q: 'আন্তর্জাতিক মাতৃভাষা দিবস কবে?', a: '২১ ফেব্রুয়ারি', d: ['১৬ ডিসেম্বর', '২৬ মার্চ', '১ মে'] },
  { q: 'বাংলা নববর্ষের প্রথম মাসের নাম কী?', a: 'বৈশাখ', d: ['জ্যৈষ্ঠ', 'আষাঢ়', 'ফাল্গুন'] },
  { q: 'সকালবেলা সূর্য কোন দিকে ওঠে?', a: 'পূর্ব দিকে', d: ['পশ্চিম দিকে', 'উত্তর দিকে', 'দক্ষিণ দিকে'] },
  { q: 'সন্ধ্যায় সূর্য কোন দিকে অস্ত যায়?', a: 'পশ্চিম দিকে', d: ['পূর্ব দিকে', 'উত্তর দিকে', 'দক্ষিণ দিকে'] },
  { q: 'আকাশের রঙ সাধারণত কেমন দেখায়?', a: 'নীল', d: ['সবুজ', 'হলুদ', 'বেগুনি'] },
  { q: 'গাছের পাতার রঙ সাধারণত কী হয়?', a: 'সবুজ', d: ['নীল', 'সাদা', 'কালো'] },
  { q: 'দুধের রঙ কেমন হয়?', a: 'সাদা', d: ['লাল', 'নীল', 'কালো'] },
  { q: 'কাকের গায়ের রঙ কেমন?', a: 'কালো', d: ['সাদা', 'সবুজ', 'হলুদ'] },
  { q: 'পাকা কলার রঙ সাধারণত কী হয়?', a: 'হলুদ', d: ['নীল', 'কালো', 'বেগুনি'] },
  { q: 'রংধনুতে কয়টি রঙ থাকে?', a: '৭টি', d: ['৫টি', '৬টি', '৯টি'] },
  { q: 'বাংলাদেশে কয়টি ঋতু আছে?', a: '৬টি', d: ['৪টি', '৫টি', '৭টি'] },
  { q: '১ সপ্তাহে কত দিন?', a: '৭ দিন', d: ['৫ দিন', '৬ দিন', '৮ দিন'] },
  { q: '১ বছরে কত মাস?', a: '১২ মাস', d: ['১০ মাস', '১১ মাস', '১৪ মাস'] },
  { q: '১ দিনে কত ঘণ্টা?', a: '২৪ ঘণ্টা', d: ['১২ ঘণ্টা', '১৮ ঘণ্টা', '৩০ ঘণ্টা'] },
  { q: '১ ঘণ্টায় কত মিনিট?', a: '৬০ মিনিট', d: ['৩০ মিনিট', '৫০ মিনিট', '১০০ মিনিট'] },
  { q: '১ মিনিটে কত সেকেন্ড?', a: '৬০ সেকেন্ড', d: ['৪০ সেকেন্ড', '৫০ সেকেন্ড', '১০০ সেকেন্ড'] },
  { q: 'ইংরেজি বর্ণমালায় মোট কয়টি অক্ষর আছে?', a: '২৬টি', d: ['২৪টি', '২৫টি', '২৮টি'] },
  { q: 'ইংরেজি বর্ণমালায় Vowel (স্বরবর্ণ) কয়টি?', a: '৫টি', d: ['৪টি', '৬টি', '৭টি'] },
  { q: 'বাংলা স্বরবর্ণ মোট কয়টি?', a: '১১টি', d: ['৯টি', '১০টি', '১২টি'] },
  { q: 'বাংলা ব্যঞ্জনবর্ণ মোট কয়টি?', a: '৩৯টি', d: ['৩৫টি', '৩৭টি', '৪১টি'] },
  { q: 'মানুষের কয়টি চোখ থাকে?', a: '২টি', d: ['১টি', '৩টি', '৪টি'] },
  { q: 'মানুষের দুই হাতে মোট কয়টি আঙুল থাকে?', a: '১০টি', d: ['৮টি', '৯টি', '১২টি'] },
  { q: 'গরুর কয়টি পা থাকে?', a: '৪টি', d: ['২টি', '৩টি', '৬টি'] },
  { q: 'মাকড়সার কয়টি পা থাকে?', a: '৮টি', d: ['৪টি', '৬টি', '১০টি'] },
  { q: 'পৃথিবীর একমাত্র প্রাকৃতিক উপগ্রহ কোনটি?', a: 'চাঁদ', d: ['সূর্য', 'মঙ্গল', 'বুধ'] },
  { q: 'কোন প্রাণীকে বনের রাজা বলা হয়?', a: 'সিংহ', d: ['হরিণ', 'খরগোশ', 'বিড়াল'] },
  { q: 'কোন প্রাণীকে মরুভূমির জাহাজ বলা হয়?', a: 'উট', d: ['ঘোড়া', 'হাতি', 'গরু'] },
  { q: 'কোন পোকা মধু তৈরি করে?', a: 'মৌমাছি', d: ['পিঁপড়া', 'প্রজাপতি', 'মশা'] },
  { q: 'মাছ কোথায় বাস করে?', a: 'পানিতে', d: ['গাছে', 'আকাশে', 'মাটির ওপরে'] },
  { q: 'পাখি কীসের সাহায্যে আকাশে ওড়ে?', a: 'ডানা', d: ['কান', 'শিং', 'দাঁত'] },
  { q: 'আমরা কী দিয়ে শ্বাস নিই?', a: 'নাক দিয়ে', d: ['কান দিয়ে', 'চোখ দিয়ে', 'হাত দিয়ে'] },
  { q: 'আমরা কী দিয়ে কথা শুনি?', a: 'কান দিয়ে', d: ['চোখ দিয়ে', 'নাক দিয়ে', 'হাত দিয়ে'] },
  { q: 'বরফ গলে কী তৈরি হয়?', a: 'পানি', d: ['পাথর', 'বালি', 'কাঠ'] },
  { q: 'ট্রাফিক সিগন্যালের কোন আলো দেখলে গাড়ি থামে?', a: 'লাল আলো', d: ['সবুজ আলো', 'নীল আলো', 'সাদা আলো'] },
  { q: 'ট্রাফিক সিগন্যালের কোন আলো জ্বললে গাড়ি চলে?', a: 'সবুজ আলো', d: ['লাল আলো', 'কালো আলো', 'বেগুনি আলো'] },
  { q: 'বাংলাদেশের মুদ্রার নাম কী?', a: 'টাকা', d: ['রুপি', 'ডলার', 'রিয়াল'] },
  { q: 'বাংলাদেশের সমুদ্র সৈকত কোথায় অবস্থিত?', a: 'কক্সবাজার', d: ['বগুড়া', 'রংপুর', 'ময়মনসিংহ'] },
  { q: 'সুন্দরবনে কোন বিখ্যাত প্রাণী বাস করে?', a: 'রয়েল বেঙ্গল টাইগার', d: ['পেঙ্গুইন', 'ক্যাঙ্গারু', 'মেরু ভালুক'] },
  { q: 'ত্রিভুজের কয়টি বাহু থাকে?', a: '৩টি', d: ['২টি', '৪টি', '৫টি'] },
  { q: 'চতুর্ভুজের কয়টি বাহু থাকে?', a: '৪টি', d: ['৩টি', '৫টি', '৬টি'] }
];

const CATEGORY_GROUPS_BN: { label: string; items: string[] }[] = [
  { label: 'ফল', items: ['আম', 'কাঁঠাল', 'লিচু', 'কলা', 'পেয়ারা', 'আনারস', 'তরমুজ', 'পেঁপে', 'কমলা', 'আপেল', 'ডালিম', 'বরই'] },
  { label: 'ফুল', items: ['শাপলা', 'গোলাপ', 'জবা', 'বেলি', 'গাঁদা', 'শিউলি', 'কদম', 'রজনীগন্ধা', 'সূর্যমুখী', 'পলাশ', 'বকুল', 'চাঁপা'] },
  { label: 'পাখি', items: ['দোয়েল', 'টিয়া', 'ময়না', 'শালিক', 'কবুতর', 'কোকিল', 'মাছরাঙা', 'চড়ুই', 'বক', 'ঘুঘু', 'বাবুই', 'টুনটুনি'] },
  { label: 'নদী', items: ['পদ্মা', 'মেঘনা', 'যমুনা', 'কর্ণফুলী', 'সুরমা', 'তিস্তা', 'বুড়িগঙ্গা', 'রূপসা', 'কপোতাক্ষ', 'মধুমতী', 'ধলেশ্বরী', 'হালদা'] },
  { label: 'রঙ', items: ['লাল', 'নীল', 'সবুজ', 'হলুদ', 'সাদা', 'কালো', 'বেগুনি', 'কমলা', 'গোলাপি', 'বাদামি'] },
  { label: 'যানবাহন', items: ['বাস', 'ট্রেন', 'রিকশা', 'সাইকেল', 'নৌকা', 'বিমান', 'লঞ্চ', 'ট্রাক', 'মোটরসাইকেল', 'হেলিকপ্টার'] },
  { label: 'পশু/প্রাণী', items: ['গরু', 'ছাগল', 'হরিণ', 'হাতি', 'ঘোড়া', 'বিড়াল', 'খরগোশ', 'সিংহ', 'বাঘ', 'জিরাফ'] },
  { label: 'সবজি', items: ['আলু', 'বেগুন', 'টমেটো', 'গাজর', 'লাউ', 'কুমড়া', 'শসা', 'ফুলকপি', 'বাঁধাকপি', 'ঢেঁড়স'] }
];

const BN_WEEKDAYS = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
const BN_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
const EN_MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

/**
 * 50,000+ DYNAMIC CHILD-FRIENDLY GENERAL KNOWLEDGE GENERATOR
 * Combines curated GK, category identification combinations, calendar/unit facts,
 * and child number-sense questions for 60,000+ unique, 100% accurate questions.
 */
export function generateChildQuizQuestion(language: Language = 'bn', excludeId?: number): GeneratedQuizQuestion {
  const bucket = Math.random();

  // 1. Curated Core Child GK (30% selection weight for rich variety)
  if (bucket < 0.30) {
    const idx = Math.floor(Math.random() * CORE_CHILD_GK_BN.length);
    const item = CORE_CHILD_GK_BN[idx];
    const id = 1000 + idx;
    if (id !== excludeId) {
      const { options, correctIndex } = shuffleWithCorrect([item.a, ...item.d], item.a);
      return { id, question: item.q, options, correctIndex };
    }
  }

  // 2. Category Recognition GK (25% weight — thousands of combinations of fruits, birds, rivers, flowers, etc.)
  if (bucket < 0.55) {
    const gIdx = Math.floor(Math.random() * CATEGORY_GROUPS_BN.length);
    const group = CATEGORY_GROUPS_BN[gIdx];
    const pool = [...group.items];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picked = pool.slice(0, 3);
    const otherLabels = CATEGORY_GROUPS_BN.filter((_, i) => i !== gIdx).map(g => g.label);
    for (let i = otherLabels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherLabels[i], otherLabels[j]] = [otherLabels[j], otherLabels[i]];
    }
    const id = 5000 + gIdx * 1000 + pool[0].charCodeAt(0) + pool[1].charCodeAt(0);
    const question =
      language === 'bn'
        ? `${picked[0]}, ${picked[1]} ও ${picked[2]} — এগুলো কীসের নাম?`
        : `${picked[0]}, ${picked[1]} & ${picked[2]} belong to which group?`;
    const { options, correctIndex } = shuffleWithCorrect(
      [group.label, otherLabels[0], otherLabels[1], otherLabels[2]],
      group.label
    );
    return { id, question, options, correctIndex };
  }

  // 3. Calendar, Alphabet & Everyday Time GK (20% weight)
  if (bucket < 0.75) {
    const subType = Math.floor(Math.random() * 4);
    if (subType === 0) {
      const dIdx = Math.floor(Math.random() * BN_WEEKDAYS.length);
      const today = BN_WEEKDAYS[dIdx];
      const tomorrow = BN_WEEKDAYS[(dIdx + 1) % 7];
      const decoys = BN_WEEKDAYS.filter(d => d !== tomorrow).slice(0, 3);
      const { options, correctIndex } = shuffleWithCorrect([tomorrow, ...decoys], tomorrow);
      return {
        id: 15000 + dIdx,
        question: `আজ ${today} হলে আগামীকাল কী বার হবে?`,
        options,
        correctIndex
      };
    }
    if (subType === 1) {
      const mIdx = Math.floor(Math.random() * 11);
      const curM = subType % 2 === 0 ? BN_MONTHS[mIdx] : EN_MONTHS_BN[mIdx];
      const nextM = subType % 2 === 0 ? BN_MONTHS[mIdx + 1] : EN_MONTHS_BN[mIdx + 1];
      const list = subType % 2 === 0 ? BN_MONTHS : EN_MONTHS_BN;
      const decoys = list.filter(m => m !== nextM && m !== curM).slice(0, 3);
      const { options, correctIndex } = shuffleWithCorrect([nextM, ...decoys], nextM);
      return {
        id: 16000 + mIdx,
        question: `${curM} মাসের ঠিক পরের মাসের নাম কী?`,
        options,
        correctIndex
      };
    }
    if (subType === 2) {
      const weeks = Math.floor(Math.random() * 20) + 2; // 2..21 weeks
      const ans = `${toBnDigits(weeks * 7)} দিন`;
      const d1 = `${toBnDigits(weeks * 7 + 2)} দিন`;
      const d2 = `${toBnDigits(weeks * 7 - 2)} দিন`;
      const d3 = `${toBnDigits(weeks * 6)} দিন`;
      const { options, correctIndex } = shuffleWithCorrect([ans, d1, d2, d3], ans);
      return {
        id: 17000 + weeks,
        question: `১ সপ্তাহে ৭ দিন হলে, ${toBnDigits(weeks)} সপ্তাহে মোট কত দিন হয়?`,
        options,
        correctIndex
      };
    }
    const letterCode = Math.floor(Math.random() * 25); // A..Y
    const curChar = String.fromCharCode(65 + letterCode);
    const nextChar = String.fromCharCode(66 + letterCode);
    const dChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'P', 'R', 'S', 'T', 'Z'].filter(
      c => c !== nextChar && c !== curChar
    );
    const { options, correctIndex } = shuffleWithCorrect(
      [nextChar, dChars[0], dChars[1], dChars[2]],
      nextChar
    );
    return {
      id: 18000 + letterCode,
      question: `ইংরেজি বর্ণমালায় '${curChar}' এর ঠিক পরের অক্ষর কোনটি?`,
      options,
      correctIndex
    };
  }

  // 4. Child Number-Sense Pool (1..50,000+ unique questions: Next Number, Previous Number, Biggest Number)
  const mode = Math.floor(Math.random() * 3);
  if (mode === 0) {
    const n = Math.floor(Math.random() * 25000) + 1; // 25,000 unique "next number" questions
    const ans = toBnDigits(n + 1);
    const decoys = [toBnDigits(n + 2), toBnDigits(Math.max(0, n - 1)), toBnDigits(n + 3)];
    const { options, correctIndex } = shuffleWithCorrect([ans, ...decoys], ans);
    return {
      id: 20000 + n,
      question: `সংখ্যা গণনায় ${toBnDigits(n)} এর ঠিক পরের সংখ্যা কোনটি?`,
      options,
      correctIndex
    };
  }
  if (mode === 1) {
    const n = Math.floor(Math.random() * 25000) + 2; // 25,000 unique "previous number" questions
    const ans = toBnDigits(n - 1);
    const decoys = [toBnDigits(n + 1), toBnDigits(Math.max(0, n - 2)), toBnDigits(n + 2)];
    const { options, correctIndex } = shuffleWithCorrect([ans, ...decoys], ans);
    return {
      id: 45000 + n,
      question: `সংখ্যা গণনায় ${toBnDigits(n)} এর ঠিক আগের সংখ্যা কোনটি?`,
      options,
      correctIndex
    };
  }

  // Biggest number among 4 distinct simple numbers
  const base = Math.floor(Math.random() * 900) + 10;
  const nums = [base, base + 5, base + 12, base + 21];
  const biggest = toBnDigits(base + 21);
  const { options, correctIndex } = shuffleWithCorrect(nums.map(toBnDigits), biggest);
  return {
    id: 71000 + base,
    question: 'নিচের সংখ্যাগুলোর মধ্যে সবচেয়ে বড় সংখ্যা কোনটি?',
    options,
    correctIndex
  };
}

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const GLYPH_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

/**
 * 50,000+ SIMPLE TEXT/NUMBER CAPTCHA GENERATOR (32^5 = 33,554,432 combinations)
 * Structured cleanly with 4 button options + visual SVG glyph styling.
 */
export function generateCaptchaChallenge(): GeneratedCaptchaChallenge {
  const id = Math.floor(Math.random() * 50000) + 10001;
  const length = 5;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }

  const decoys = new Set<string>();
  while (decoys.size < 3) {
    const chars = code.split('');
    const mutType = decoys.size % 3;
    if (mutType === 0) {
      // Change 1 character
      const pos = Math.floor(Math.random() * length);
      const replacement = CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
      chars[pos] = replacement;
    } else if (mutType === 1 && length >= 2) {
      // Swap two adjacent characters
      const pos = Math.floor(Math.random() * (length - 1));
      [chars[pos], chars[pos + 1]] = [chars[pos + 1], chars[pos]];
    } else {
      // Change 2 characters
      const p1 = Math.floor(Math.random() * length);
      const p2 = (p1 + 2) % length;
      chars[p1] = CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
      chars[p2] = CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
    }
    const candidate = chars.join('');
    if (candidate !== code) {
      decoys.add(candidate);
    }
  }

  const { options, correctIndex } = shuffleWithCorrect([code, ...Array.from(decoys)], code);

  const glyphs = code.split('').map((char, idx) => ({
    char,
    rotate: Math.floor(Math.random() * 26) - 13,
    dy: Math.floor(Math.random() * 8) - 4,
    color: GLYPH_COLORS[idx % GLYPH_COLORS.length]
  }));

  return {
    id,
    code,
    options,
    correctIndex,
    glyphs
  };
}
