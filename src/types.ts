export type Language = 'bn' | 'en';
export type AppTab = 'home' | 'resell' | 'microjobs' | 'analytics' | 'support';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password?: string;
  email: string;
  role: 'user' | 'admin';
  balance: number; // Withdrawable balance
  pendingEscrowBalance: number; // Commission waiting for courier delivery approval
  coins: number; // Quiz & Math game coins (1000 coins = 1 BDT)
  memberTier: string;
  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: string;
  status?: 'online' | 'idle' | 'offline';
  lastActive?: string;
  failedLoginAttempts?: number;
  lockedUntil?: number; // timestamp in ms for 5-hour lockout
  joinedDate: string;
}

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  regularPrice?: number;
  customerPrice: number;
  commission: number;
  deliveryChargeInside?: number;
  deliveryChargeOutside?: number;
  image: string;
  rating?: number;
  soldCount?: number;
  stock?: number;
  supplier?: string;
  description: string;
  features: string[];
}

export interface MicroJob {
  id: string;
  title: string;
  titleEn?: string;
  category: 'youtube' | 'facebook' | 'telegram' | 'app' | 'review';
  platform: string;
  reward: number;
  estimatedTime: string;
  completedSlots: number;
  totalSlots: number;
  instructions: string[];
  proofPlaceholder: string;
  targetUrl: string;
  isUserGenerated?: boolean;
  postedBy?: string;
  senderPhone?: string;
  paymentTrxId?: string;
  totalBudget?: number;
  status: 'active' | 'pending_admin_approval' | 'rejected';
  createdAt?: string;
}

export interface TaskProofSubmission {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId?: string;
  workerName: string;
  workerPhone: string;
  reward: number;
  proofText: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reward: number;
}

export interface Transaction {
  id: string;
  type: 'resell_commission' | 'micro_job' | 'quiz_reward' | 'referral' | 'withdrawal' | 'withdrawal_refund' | 'math_reward' | 'captcha_reward' | 'job_posting' | 'spin_game';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing' | 'rejected';
  method?: 'bKash Personal' | 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  account?: string;
  trxId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: 'bKash Personal' | 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  accountType: 'personal' | 'agent';
  accountNumber: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  trxId?: string;
  rejectReason?: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  category: 'withdrawal_issue' | 'job_issue' | 'reselling_help' | 'suggestion' | 'complaint' | 'blocked_account_appeal' | 'other';
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'resolved';
  adminReply?: string;
  appealUserId?: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  cityType: 'inside_dhaka' | 'outside_dhaka';
  sellingPrice: number;
  commission: number;
  status: 'pending_courier' | 'shipped' | 'delivered_paid' | 'cancelled';
  escrowReleased: boolean;
  resellerName: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'earning' | 'job' | 'withdrawal' | 'info' | 'alert';
  read: boolean;
}
