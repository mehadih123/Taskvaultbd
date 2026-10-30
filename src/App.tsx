import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductsSection } from './components/ProductsSection';
import { OrderModal } from './components/OrderModal';
import { MicroJobsSection } from './components/MicroJobsSection';
import { MathTaskModal } from './components/MathTaskModal';
import { QuizJobModal } from './components/QuizJobModal';
import { CaptchaModal } from './components/CaptchaModal';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { WalletModal } from './components/WalletModal';
import { UserProfileModal } from './components/UserProfileModal';
import { OfficialChannelModal } from './components/OfficialChannelModal';
import { SideDrawer } from './components/SideDrawer';
import { CreateJobModal } from './components/CreateJobModal';
import { SecretAdminModal } from './components/SecretAdminModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { RulesModal } from './components/RulesModal';
import { SupportFeedbackSection } from './components/SupportFeedbackSection';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { AuthModal } from './components/AuthModal';
import { BottomNavBar } from './components/BottomNavBar';
import { SpinWinModal } from './components/SpinWinModal';
import { PolicyTrustModal, PolicyPageType } from './components/PolicyTrustModal';

import {
  INITIAL_USERS,
  INITIAL_WITHDRAWAL_REQUESTS,
  INITIAL_FEEDBACK_ITEMS,
  INITIAL_MICRO_JOBS,
  INITIAL_ORDERS,
  INITIAL_PROOF_SUBMISSIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import {
  Product,
  Order,
  MicroJob,
  Transaction,
  NotificationItem,
  UserAccount,
  Language,
  TaskProofSubmission,
  WithdrawalRequest,
  FeedbackItem,
  AppTab
} from './types';
import { toggleMute, playSound } from './utils/audio';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Language state (Bangla & English)
  const [language, setLanguage] = useState<Language>('bn');

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Registered Users State (Purged of demo accounts)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_users');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out legacy demo seed user if present from older builds
            const cleaned = parsed.filter(
              (u: UserAccount) => !(u.id === 'USR-8921' && u.phone === '01712345678')
            );
            if (cleaned.length !== parsed.length) {
              localStorage.setItem('taskvault_users', JSON.stringify(cleaned));
            }
            return cleaned;
          }
        } catch {}
      }
    }
    return INITIAL_USERS;
  });

  // Current Logged-in User (Strictly verified against registered accounts)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUserRaw = localStorage.getItem('taskvault_current_user');
      const savedUsersRaw = localStorage.getItem('taskvault_users');
      if (savedUserRaw && savedUsersRaw) {
        try {
          const parsedUser: UserAccount = JSON.parse(savedUserRaw);
          const parsedUsers: UserAccount[] = JSON.parse(savedUsersRaw);
          const matched = parsedUsers.find(
            u =>
              u.id === parsedUser.id &&
              !(u.id === 'USR-8921' && u.phone === '01712345678')
          );
          if (matched && !matched.isBlocked) {
            return matched;
          }
          localStorage.removeItem('taskvault_current_user');
        } catch {}
      } else {
        localStorage.removeItem('taskvault_current_user');
      }
    }
    return null;
  });

  // Core Balances & Permanent Coin Persistence (NEVER resets on refresh/reopen)
  const [balance, setBalance] = useState<number>(() => {
    if (currentUser && typeof currentUser.balance === 'number') {
      return currentUser.balance;
    }
    if (typeof window !== 'undefined') {
      const guestBal = localStorage.getItem('taskvault_guest_balance');
      return guestBal ? Number(guestBal) || 0 : 0;
    }
    return 0;
  });

  const [pendingEscrowBalance, setPendingEscrowBalance] = useState<number>(() => {
    if (currentUser && typeof currentUser.pendingEscrowBalance === 'number') {
      return currentUser.pendingEscrowBalance;
    }
    return 0;
  });

  const [coins, setCoins] = useState<number>(() => {
    if (currentUser && typeof currentUser.coins === 'number') {
      return currentUser.coins;
    }
    if (typeof window !== 'undefined') {
      const guestCoins = localStorage.getItem('taskvault_guest_coins');
      return guestCoins ? parseInt(guestCoins, 10) || 0 : 0;
    }
    return 0;
  });

  // Product Inventory (Starts clean; populated by Admin)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.some(p => p.id === 'prod-1' && p.title.includes('T900'))) {
            localStorage.setItem('taskvault_products', JSON.stringify([]));
            return [];
          }
          return Array.isArray(parsed) ? parsed : [];
        } catch {}
      }
    }
    return [];
  });

  const [jobs, setJobs] = useState<MicroJob[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_jobs');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_MICRO_JOBS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_ORDERS;
  });

  const [proofs, setProofs] = useState<TaskProofSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_proofs');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_PROOF_SUBMISSIONS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_withdrawals');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_WITHDRAWAL_REQUESTS;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_feedbacks');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_FEEDBACK_ITEMS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_transactions');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskvault_notifications');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modals & Drawers States (including separate Math Task & Quiz Job modals)
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [secretAdminModalOpen, setSecretAdminModalOpen] = useState(false);
  const [adminDashboardModalOpen, setAdminDashboardModalOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [policyModalPage, setPolicyModalPage] = useState<PolicyPageType | null>(null);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [officialChannelOpen, setOfficialChannelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Session Token (always verified via Master PIN first)
  const [adminDeviceToken, setAdminDeviceToken] = useState<string | null>(null);

  // Blocked User Notice State
  const [blockedNoticeUser, setBlockedNoticeUser] = useState<{ name: string; phone: string; reason?: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Real-time Blocked Account Auto-Logout Monitor
  useEffect(() => {
    const checkBlockedStatus = () => {
      try {
        const storedUsersRaw = localStorage.getItem('taskvault_users');
        const storedUserRaw = localStorage.getItem('taskvault_current_user');
        if (storedUsersRaw && storedUserRaw) {
          const storedUsers: UserAccount[] = JSON.parse(storedUsersRaw);
          const activeUser: UserAccount = JSON.parse(storedUserRaw);
          const matched = storedUsers.find(
            u => u.id === activeUser.id || u.phone.replace(/\D/g, '') === activeUser.phone.replace(/\D/g, '')
          );
          if (matched && matched.isBlocked) {
            localStorage.removeItem('taskvault_current_user');
            setCurrentUser(null);
            setBlockedNoticeUser({
              name: matched.name,
              phone: matched.phone,
              reason: matched.blockReason || 'অ্যাডমিন কর্তৃক অ্যাকাউন্ট স্থগিত'
            });
            setAuthModalOpen(true);
            playSound('error');
            showToast('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। সেশন তাৎক্ষণিকভাবে বন্ধ করা হয়েছে!');
          }
        }
      } catch {}
    };

    if (currentUser) {
      const matched = users.find(
        u => u.id === currentUser.id || u.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')
      );
      if (matched && matched.isBlocked) {
        localStorage.removeItem('taskvault_current_user');
        setCurrentUser(null);
        setBlockedNoticeUser({
          name: matched.name,
          phone: matched.phone,
          reason: matched.blockReason || 'অ্যাডমিন কর্তৃক অ্যাকাউন্ট স্থগিত'
        });
        setAuthModalOpen(true);
        playSound('error');
        showToast('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। সেশন তাৎক্ষণিকভাবে বন্ধ করা হয়েছে!');
      }
    }

    const interval = setInterval(checkBlockedStatus, 1500);
    window.addEventListener('storage', checkBlockedStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkBlockedStatus);
    };
  }, [users, currentUser]);

  // Dark Mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Secret Keyboard Shortcut (Ctrl + Alt + A) & Hash (#admin) -> ALWAYS opens PIN Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setSecretAdminModalOpen(true);
        playSound('click');
      }
    };

    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#taskvault-admin') {
        setSecretAdminModalOpen(true);
        playSound('click');
      }
    };

    handleHash();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Permanent Persistence of Coins & Balances to localStorage
  useEffect(() => {
    if (currentUser) {
      if (
        currentUser.balance === balance &&
        currentUser.pendingEscrowBalance === pendingEscrowBalance &&
        currentUser.coins === coins
      ) {
        return;
      }
      const updatedUser: UserAccount = {
        ...currentUser,
        balance,
        pendingEscrowBalance,
        coins
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('taskvault_current_user', JSON.stringify(updatedUser));
      setUsers(prev => {
        const next = prev.map(u => (u.id === currentUser.id ? updatedUser : u));
        localStorage.setItem('taskvault_users', JSON.stringify(next));
        return next;
      });
    } else {
      localStorage.setItem('taskvault_guest_coins', String(coins));
      localStorage.setItem('taskvault_guest_balance', String(balance));
    }
  }, [balance, pendingEscrowBalance, coins, currentUser]);

  useEffect(() => {
    localStorage.setItem('taskvault_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('taskvault_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('taskvault_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('taskvault_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('taskvault_proofs', JSON.stringify(proofs));
  }, [proofs]);

  useEffect(() => {
    localStorage.setItem('taskvault_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('taskvault_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('taskvault_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('taskvault_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
    playSound('click');
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'সাউন্ড বন্ধ করা হয়েছে' : 'সাউন্ড চালু করা হয়েছে');
  };

  // Strict Auth Handlers with Unified Coin & Balance Sync (Zero Coin Loss)
  const handleAuthSuccess = (user: UserAccount, isNewSignup = false) => {
    const guestEarnedCoins = !currentUser ? coins : 0;
    const guestEarnedBalance = !currentUser ? balance : 0;

    if (isNewSignup) {
      const mergedCoins = (user.coins || 0) + guestEarnedCoins;
      const mergedBalance = Number(((user.balance || 0) + guestEarnedBalance).toFixed(2));
      const newUser: UserAccount = {
        ...user,
        coins: mergedCoins,
        balance: mergedBalance,
        pendingEscrowBalance: 0
      };
      localStorage.removeItem('taskvault_guest_coins');
      localStorage.removeItem('taskvault_guest_balance');

      setCurrentUser(newUser);
      setBalance(mergedBalance);
      setPendingEscrowBalance(0);
      setCoins(mergedCoins);
      localStorage.setItem('taskvault_current_user', JSON.stringify(newUser));
      setUsers(prev => {
        const next = [newUser, ...prev];
        localStorage.setItem('taskvault_users', JSON.stringify(next));
        return next;
      });
      showToast(language === 'bn' ? `রেজিস্ট্রেশন সফল! স্বাগতম, ${newUser.name}` : `Welcome, ${newUser.name}!`);
    } else {
      const mergedCoins = (typeof user.coins === 'number' ? user.coins : 0) + guestEarnedCoins;
      const mergedBalance = Number(
        ((typeof user.balance === 'number' ? user.balance : 0) + guestEarnedBalance).toFixed(2)
      );
      const syncedUser: UserAccount = {
        ...user,
        coins: mergedCoins,
        balance: mergedBalance
      };
      localStorage.removeItem('taskvault_guest_coins');
      localStorage.removeItem('taskvault_guest_balance');

      setCurrentUser(syncedUser);
      setBalance(mergedBalance);
      setPendingEscrowBalance(typeof user.pendingEscrowBalance === 'number' ? user.pendingEscrowBalance : 0);
      setCoins(mergedCoins);
      localStorage.setItem('taskvault_current_user', JSON.stringify(syncedUser));
      setUsers(prev => {
        const next = prev.map(u => (u.id === syncedUser.id ? syncedUser : u));
        localStorage.setItem('taskvault_users', JSON.stringify(next));
        return next;
      });
      showToast(language === 'bn' ? `স্বাগতম, ${syncedUser.name}!` : `Welcome, ${syncedUser.name}!`);
    }

    setAuthModalOpen(false);
  };

  const handlePasswordReset = (phone: string, newPassword: string) => {
    const cleanTarget = phone.replace(/\D/g, '');
    setUsers(prev => {
      const next = prev.map(u =>
        u.phone.replace(/\D/g, '') === cleanTarget ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('taskvault_users', JSON.stringify(next));
      return next;
    });
    showToast('পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
  };

  const handleLogout = () => {
    playSound('click');
    localStorage.removeItem('taskvault_current_user');
    setCurrentUser(null);
    const guestCoins = parseInt(localStorage.getItem('taskvault_guest_coins') || '0', 10) || 0;
    const guestBal = Number(localStorage.getItem('taskvault_guest_balance') || '0') || 0;
    setCoins(guestCoins);
    setBalance(guestBal);
    setPendingEscrowBalance(0);
    setAuthModalOpen(true);
    showToast(language === 'bn' ? 'লগআউট সম্পন্ন হয়েছে' : 'Signed out');
  };

  // ADMIN: USER BLOCK / UNBLOCK
  const handleToggleBlockUser = (userId: string, reason?: string) => {
    let wasBlocked = false;
    let targetUserName = '';
    let targetUserPhone = '';

    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          wasBlocked = !u.isBlocked;
          targetUserName = u.name;
          targetUserPhone = u.phone;
          return {
            ...u,
            isBlocked: wasBlocked,
            blockReason: wasBlocked ? reason || 'সন্দেহজনক কার্যকলাপ ও পলিসি লঙ্ঘন' : undefined,
            blockedAt: wasBlocked
              ? 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
              : undefined
          };
        }
        return u;
      })
    );

    if (currentUser && (currentUser.id === userId || currentUser.phone === targetUserPhone)) {
      if (wasBlocked) {
        localStorage.removeItem('taskvault_current_user');
        setCurrentUser(null);
        setBlockedNoticeUser({
          name: targetUserName,
          phone: targetUserPhone,
          reason: reason || 'সন্দেহজনক কার্যকলাপ ও পলিসি লঙ্ঘন'
        });
        setAuthModalOpen(true);
        playSound('error');
        showToast('আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। সেশন তাৎক্ষণিকভাবে বন্ধ করা হয়েছে!');
        return;
      }
    }

    showToast(
      wasBlocked
        ? `ইউজার "${targetUserName}" ব্লক করা হয়েছে (সেশন বন্ধ)`
        : `ইউজার "${targetUserName}" সফলভাবে আনব্লক করা হয়েছে`
    );
  };

  // ADMIN: LOCK ADMIN PANEL
  const handleRevokeAdminDevice = () => {
    setAdminDeviceToken(null);
    setAdminDashboardModalOpen(false);
    playSound('click');
    showToast('অ্যাডমিন প্যানেল লক করা হয়েছে');
  };

  // BLOCKED USER COMPLAINT SUBMISSION
  const handleSubmitBlockedUserComplaint = (name: string, phone: string, message: string) => {
    const newFb: FeedbackItem = {
      id: 'FB-APL-' + Date.now().toString().slice(-5),
      userId: users.find(u => u.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))?.id || 'USR-ANON',
      userName: name,
      userPhone: phone,
      category: 'blocked_account_appeal',
      subject: 'ব্লকড অ্যাকাউন্ট আনব্লক করার আবেদন',
      message,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    setFeedbacks(prev => [newFb, ...prev]);

    const newNotif: NotificationItem = {
      id: 'notif-apl-' + Date.now(),
      title: 'নতুন অ্যাকাউন্ট আনব্লক আপিল!',
      message: `${name} (${phone}) থেকে আনব্লক করার আবেদন জমা পড়েছে।`,
      time: 'এইমাত্র',
      type: 'alert',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('আপনার অভিযোগ অ্যাডমিন প্যানেলে সফলভাবে জমা হয়েছে!');
  };

  // WITHDRAWAL SUBMISSION
  const handleWithdrawSuccess = (tx: Transaction, req: WithdrawalRequest) => {
    setBalance(prev => Math.max(0, Number((prev - tx.amount).toFixed(2))));
    setTransactions(prev => [tx, ...prev]);
    setWithdrawals(prev => [req, ...prev]);

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'উত্তোলন রিকোয়েস্ট সফল!',
        message: `আপনার ${tx.method} নম্বরে ৳${tx.amount} পাঠানোর আবেদন গৃহীত হয়েছে। TrxID: ${tx.trxId}`,
        time: 'এইমাত্র',
        type: 'withdrawal',
        read: false
      },
      ...prev
    ]);

    showToast(`উত্তোলন রিকোয়েস্ট জমা হয়েছে! ৳${tx.amount} প্রসেসিং হচ্ছে।`);
  };

  // ADMIN: APPROVE WITHDRAWAL
  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(prev =>
      prev.map(w => {
        if (w.id === withdrawalId) {
          const trxId = w.trxId || 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase();
          return { ...w, status: 'approved', trxId };
        }
        return w;
      })
    );

    setTransactions(prev =>
      prev.map(t => {
        if (t.type === 'withdrawal' && t.status === 'pending') {
          return { ...t, status: 'completed' };
        }
        return t;
      })
    );

    showToast(`উইথড্র রিকোয়েস্ট #${withdrawalId} সফলভাবে অনুমোদন করা হয়েছে!`);
  };

  // ADMIN: REJECT & REFUND WITHDRAWAL
  const handleRejectWithdrawal = (withdrawalId: string, reason: string) => {
    const targetWdr = withdrawals.find(w => w.id === withdrawalId);
    if (!targetWdr || targetWdr.status === 'rejected') return;

    setWithdrawals(prev =>
      prev.map(w => (w.id === withdrawalId ? { ...w, status: 'rejected', rejectReason: reason } : w))
    );

    if (currentUser && currentUser.id === targetWdr.userId) {
      setBalance(prev => Number((prev + targetWdr.amount).toFixed(2)));
    }

    const refundTx: Transaction = {
      id: 'TX-REFUND-' + Math.floor(1000 + Math.random() * 9000),
      type: 'withdrawal_refund',
      title: `বাতিলকৃত উইথড্র রিফান্ড: ৳${targetWdr.amount} ফেরত`,
      amount: targetWdr.amount,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      method: targetWdr.method
    };
    setTransactions(prev => [refundTx, ...prev]);

    setUsers(prev =>
      prev.map(u =>
        u.id === targetWdr.userId ? { ...u, balance: Number(((u.balance || 0) + targetWdr.amount).toFixed(2)) } : u
      )
    );

    showToast(`উইথড্রয়াল #${withdrawalId} বাতিল হয়েছে এবং ৳${targetWdr.amount} ইউজারের ব্যালেন্সে রিফান্ড করা হয়েছে!`);
  };

  // RESELL ORDER & SMART ESCROW WORKFLOW
  const handleSubmitOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setPendingEscrowBalance(prev => prev + newOrder.commission);

    const newTx: Transaction = {
      id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
      type: 'resell_commission',
      title: `${newOrder.productTitle} বিক্রির লাভ (এস্ক্রো সুরক্ষায়)`,
      amount: newOrder.commission,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    setTransactions(prev => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'নতুন রিসেল অর্ডার বুকিং!',
      message: `${newOrder.customerName} এর জন্য অর্ডার নিশ্চিত হয়েছে। কমিশন ৳${newOrder.commission} এস্ক্রোতে যুক্ত হয়েছে।`,
      time: 'এইমাত্র',
      type: 'earning',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`অর্ডার বুকিং সফল! কমিশন ৳${newOrder.commission} পেন্ডিং এস্ক্রোতে যুক্ত হয়েছে।`);
  };

  // ADMIN: APPROVE ESCROW ORDER
  const handleApproveEscrowOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder || targetOrder.escrowReleased) return;

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'delivered_paid', escrowReleased: true } : o))
    );
    setPendingEscrowBalance(prev => Math.max(0, prev - targetOrder.commission));
    setBalance(prev => Number((prev + targetOrder.commission).toFixed(2)));

    const releaseTx: Transaction = {
      id: 'TX-REL-' + Math.floor(1000 + Math.random() * 9000),
      type: 'resell_commission',
      title: `অর্ডার #${orderId} ডেলিভার্ড: এস্ক্রো কমিশন রিলিজ`,
      amount: targetOrder.commission,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed'
    };
    setTransactions(prev => [releaseTx, ...prev]);

    showToast(`অর্ডার #${orderId} ডেলিভার্ড! ৳${targetOrder.commission} উত্তোলনযোগ্য ব্যালেন্সে যোগ হয়েছে!`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    showToast(`অর্ডার #${orderId} এর স্ট্যাটাস আপডেট হয়েছে!`);
  };

  // USER JOB POSTING
  const handleSubmitUserJob = (job: MicroJob) => {
    setJobs(prev => [job, ...prev]);

    const postTx: Transaction = {
      id: 'TX-JOB-' + Math.floor(1000 + Math.random() * 9000),
      type: 'job_posting',
      title: `কাজ পোস্ট ফি: "${job.title}" (${job.totalSlots} জন)`,
      amount: job.totalBudget || 0,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      method: 'bKash',
      trxId: job.paymentTrxId
    };
    setTransactions(prev => [postTx, ...prev]);

    showToast(
      language === 'bn'
        ? 'কাজটি সাবমিট হয়েছে! এডমিন পেমেন্ট ভেরিফাই করে লাইভ করবে।'
        : 'Job submitted for Admin approval!'
    );
  };

  const handleApproveUserJob = (jobId: string) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'active' } : j)));
    showToast(
      language === 'bn'
        ? 'ইউজার কাজটি অনুমোদিত হয়েছে এবং পাবলিক বোর্ডে লাইভ হয়েছে!'
        : 'User Job approved & published!'
    );
  };

  const handleRejectUserJob = (jobId: string) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'rejected' } : j)));
    showToast(language === 'bn' ? 'কাজটি প্রত্যাখ্যান করা হয়েছে।' : 'Job rejected.');
  };

  // WORKER TASK SUBMISSION & PROOFS
  const handleCompleteJob = (job: MicroJob, proof: string) => {
    const newProof: TaskProofSubmission = {
      id: 'prf-' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      workerName: currentUser?.name || 'Worker',
      workerPhone: currentUser?.phone || 'N/A',
      reward: job.reward,
      proofText: proof,
      submittedAt: 'এইমাত্র',
      status: 'pending'
    };
    setProofs(prev => [newProof, ...prev]);
    showToast('আপনার কাজের প্রুফ জমা হয়েছে! এডমিন যাচাইয়ের পর রিওয়ার্ড যোগ হবে।');
  };

  const handleApproveProof = (proofId: string) => {
    const prf = proofs.find(p => p.id === proofId);
    if (!prf || prf.status === 'approved') return;

    setProofs(prev => prev.map(p => (p.id === proofId ? { ...p, status: 'approved' } : p)));
    setBalance(prev => Number((prev + prf.reward).toFixed(2)));

    const tx: Transaction = {
      id: 'TX-PRF-' + Math.floor(1000 + Math.random() * 9000),
      type: 'micro_job',
      title: `প্রুফ অনুমোদিত: ${prf.jobTitle}`,
      amount: prf.reward,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed'
    };
    setTransactions(prev => [tx, ...prev]);
    showToast(`প্রমাণ অনুমোদিত! ৳${prf.reward} ওয়ার্কার ওয়ালেটে পেইড`);
  };

  const handleRejectProof = (proofId: string) => {
    setProofs(prev => prev.map(p => (p.id === proofId ? { ...p, status: 'rejected' } : p)));
    showToast('প্রমাণটি প্রত্যাখ্যান করা হয়েছে');
  };

  // FEEDBACKS
  const handleSubmitFeedback = (newFb: FeedbackItem) => {
    setFeedbacks(prev => [newFb, ...prev]);
  };

  const handleReplyFeedback = (feedbackId: string, reply: string) => {
    setFeedbacks(prev =>
      prev.map(f => (f.id === feedbackId ? { ...f, adminReply: reply, status: 'resolved' } : f))
    );
    showToast('অভিযোগের জবাব প্রদান করা হয়েছে এবং বিষয়টি সমাধান হিসেবে চিহ্নিত হয়েছে!');
  };

  // PRODUCT MANAGEMENT (ADMIN)
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`নতুন পণ্য "${newProduct.title}" সফলভাবে ইনভেন্টরিতে যোগ হয়েছে!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    showToast('পণ্য তথ্য আপডেট হয়েছে!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('পণ্যটি ডিলিট করা হয়েছে!');
  };

  // STRICT REQUIREMENT 2: +50 COINS PER MATH / QUIZ ANSWER & INSTANT 1,000 COINS -> ৳1.00 BDT CONVERSION
  const handleWinQuizCoins = (coinsWon: number) => {
    setCoins(prev => prev + coinsWon);
  };

  const handleWinMathCoins = (coinsWon: number) => {
    setCoins(prev => prev + coinsWon);
  };

  const handleWinCaptchaCoins = (coinsWon: number) => {
    setCoins(prev => prev + coinsWon);
  };

  const handleConvertCoins = () => {
    if (coins < 1000) {
      playSound('error');
      showToast('কনভার্ট করতে নূন্যতম ১,০০০ কয়েন প্রয়োজন!');
      return;
    }

    playSound('coin');
    setCoins(prev => Math.max(0, prev - 1000));
    setBalance(prev => Number((prev + 1).toFixed(2)));

    const newTx: Transaction = {
      id: 'TX-CNV-' + Math.floor(100000 + Math.random() * 900000),
      type: 'quiz_reward',
      title: 'কয়েন কনভার্ট (১,০০০ কয়েন = ৳১.০০ BDT)',
      amount: 1,
      date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed'
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast('অভিনন্দন! ১,০০০ কয়েন কেটে ৳১.০০ BDT মূল ওয়ালেটে যুক্ত হয়েছে!');
  };

  // SPIN & WIN ENGINE
  const handleSpinWin = (entryCost: number, prizeWon: number) => {
    setBalance(prev => Math.max(0, Number((prev - entryCost + prizeWon).toFixed(2))));

    if (prizeWon > 0 || entryCost > 0) {
      const newTx: Transaction = {
        id: 'TX-SPIN-' + Math.floor(100000 + Math.random() * 900000),
        type: 'spin_game',
        title:
          prizeWon > 0
            ? `স্পিন & উইন পুরস্কার জয় (+৳${prizeWon})`
            : `স্পিন প্যাক ক্রয় (-৳${entryCost})`,
        amount: prizeWon > 0 ? prizeWon : entryCost,
        date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    playSound('click');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col antialiased overflow-x-hidden">
      {/* Blocked User Warning Alert */}
      {currentUser?.isBlocked && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
          <span>⚠️ আপনার একাউন্টটি এডমিন কর্তৃক স্থগিত (Blocked) রয়েছে। উইথড্রয়াল ও টাস্ক সাময়িকভাবে সীমিত।</span>
        </div>
      )}

      {/* Top Navigation with Separate Math Task & Quiz Job Buttons */}
      <Navbar
        balance={balance}
        coins={coins}
        pendingEscrowBalance={pendingEscrowBalance}
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenMathTask={() => setMathModalOpen(true)}
        onOpenQuizJob={() => setQuizModalOpen(true)}
        onOpenCaptcha={() => setCaptchaModalOpen(true)}
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSideDrawer={() => setSideDrawerOpen(true)}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        currentUser={currentUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {/* VIEW 1: HOMEPAGE */}
        {activeTab === 'home' && (
          <Hero
            coins={coins}
            balance={balance}
            onConvertCoins={handleConvertCoins}
            onStartEarning={() => setActiveTab('resell')}
            onOpenCreateJob={() => setCreateJobModalOpen(true)}
            onOpenRules={() => setRulesModalOpen(true)}
            onSelectTab={tab => setActiveTab(tab)}
            onOpenMathTask={() => setMathModalOpen(true)}
            onOpenQuizJob={() => setQuizModalOpen(true)}
            onOpenCaptcha={() => setCaptchaModalOpen(true)}
            onOpenWallet={() => setWalletModalOpen(true)}
            onOpenSpinWin={() => setSpinModalOpen(true)}
            language={language}
          />
        )}

        {/* VIEW 2: RESELLING STORE */}
        {activeTab === 'resell' && (
          <div className="py-6">
            <ProductsSection
              products={products}
              onSelectProductForOrder={prod => setSelectedProductForOrder(prod)}
              onShowToast={showToast}
              language={language}
            />
          </div>
        )}

        {/* VIEW 3: MICRO JOBS */}
        {activeTab === 'microjobs' && (
          <div className="py-6">
            <MicroJobsSection
              jobs={jobs}
              onCompleteJob={handleCompleteJob}
              onOpenCreateJob={() => setCreateJobModalOpen(true)}
              onShowToast={showToast}
              language={language}
            />
          </div>
        )}

        {/* VIEW 4: WALLET & ANALYTICS (NO REFERRAL CLUTTER) */}
        {activeTab === 'analytics' && (
          <div className="py-6">
            <DashboardAnalytics
              balance={balance}
              coins={coins}
              onConvertCoins={handleConvertCoins}
              transactions={transactions}
              onOpenWallet={() => setWalletModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 5: SUPPORT & COMPLAINTS */}
        {activeTab === 'support' && (
          <div className="py-6">
            <SupportFeedbackSection
              currentUser={currentUser}
              feedbacks={feedbacks}
              onSubmitFeedback={handleSubmitFeedback}
              onShowToast={showToast}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Isolated Non-Incentivized AdSense Display Container (Strictly Separated from All Task Submission Buttons; collapses cleanly until an AdSense unit is active) */}
      <aside
        aria-label="Advertisement"
        data-adsense-safe-zone="footer-separated"
        className="max-w-5xl w-full mx-auto px-4 my-8 empty:hidden"
      />

      {/* Footer */}
      <Footer
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenRules={() => setRulesModalOpen(true)}
        onOpenSupport={() => setOfficialChannelOpen(true)}
        onOpenSecretAdmin={() => setSecretAdminModalOpen(true)}
        onOpenPolicyPage={page => setPolicyModalPage(page)}
        onOpenMathTask={() => setMathModalOpen(true)}
        onOpenQuizJob={() => setQuizModalOpen(true)}
        onOpenCaptcha={() => setCaptchaModalOpen(true)}
        onSelectTab={tab => setActiveTab(tab)}
        language={language}
      />

      {/* SIDE DRAWER MENU */}
      {sideDrawerOpen && (
        <SideDrawer
          isOpen={sideDrawerOpen}
          onClose={() => setSideDrawerOpen(false)}
          currentUser={currentUser}
          balance={balance}
          coins={coins}
          pendingEscrowBalance={pendingEscrowBalance}
          activeTab={activeTab}
          onSelectTab={tab => setActiveTab(tab)}
          onOpenMathTask={() => setMathModalOpen(true)}
          onOpenQuizJob={() => setQuizModalOpen(true)}
          onOpenCaptcha={() => setCaptchaModalOpen(true)}
          onConvertCoins={handleConvertCoins}
          onOpenWallet={() => setWalletModalOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCreateJob={() => setCreateJobModalOpen(true)}
          onOpenRules={() => setRulesModalOpen(true)}
          onOpenPolicyPage={page => setPolicyModalPage(page)}
          onOpenSpinWin={() => setSpinModalOpen(true)}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          isMuted={isMuted}
          toggleMute={handleToggleMute}
          language={language}
        />
      )}

      {/* SEPARATE MODAL 1: MATH TASK (50,000+ ADDITION + ONLY, +50 COINS, CLOSE × BUTTON) */}
      {mathModalOpen && (
        <MathTaskModal
          isOpen={mathModalOpen}
          onClose={() => setMathModalOpen(false)}
          coins={coins}
          balance={balance}
          onWinMathCoins={handleWinMathCoins}
          onConvertCoins={handleConvertCoins}
          onShowToast={showToast}
          language={language}
        />
      )}

      {/* SEPARATE MODAL 2: QUIZ JOB (50,000+ CHILD-FRIENDLY GK, +50 COINS, CLOSE × BUTTON) */}
      {quizModalOpen && (
        <QuizJobModal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          coins={coins}
          balance={balance}
          onWinQuizCoins={handleWinQuizCoins}
          onConvertCoins={handleConvertCoins}
          onShowToast={showToast}
          language={language}
        />
      )}

      {/* SEPARATE MODAL 3: CAPTCHA SOLVING (50,000+ BUTTON CAPTCHAS, +50 COINS, CLOSE × BUTTON) */}
      {captchaModalOpen && (
        <CaptchaModal
          isOpen={captchaModalOpen}
          onClose={() => setCaptchaModalOpen(false)}
          coins={coins}
          balance={balance}
          onWinCaptchaCoins={handleWinCaptchaCoins}
          onConvertCoins={handleConvertCoins}
          onShowToast={showToast}
          language={language}
        />
      )}

      {/* USER-GENERATED JOB POSTING MODAL */}
      {createJobModalOpen && (
        <CreateJobModal
          isOpen={createJobModalOpen}
          onClose={() => setCreateJobModalOpen(false)}
          onSubmitJob={handleSubmitUserJob}
          language={language}
        />
      )}

      {/* STRICT SECRET ADMIN PIN MODAL (DEFAULT MASTER PIN: 2026) */}
      {secretAdminModalOpen && (
        <SecretAdminModal
          isOpen={secretAdminModalOpen}
          onClose={() => setSecretAdminModalOpen(false)}
          onAuthorized={(token: string) => {
            setAdminDeviceToken(token);
            setSecretAdminModalOpen(false);
            setAdminDashboardModalOpen(true);
            showToast('অ্যাডমিন প্যানেল অনুমোদিত হয়েছে!');
          }}
        />
      )}

      {/* SECRET ADMIN DASHBOARD */}
      {adminDashboardModalOpen && (
        <AdminDashboardModal
          isOpen={adminDashboardModalOpen}
          onClose={() => setAdminDashboardModalOpen(false)}
          adminToken={adminDeviceToken}
          onRevokeAdminDevice={handleRevokeAdminDevice}
          users={users}
          onToggleBlockUser={handleToggleBlockUser}
          withdrawals={withdrawals}
          onApproveWithdrawal={handleApproveWithdrawal}
          onRejectWithdrawal={handleRejectWithdrawal}
          orders={orders}
          onApproveEscrowOrder={handleApproveEscrowOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          jobs={jobs}
          onApproveUserJob={handleApproveUserJob}
          onRejectUserJob={handleRejectUserJob}
          proofs={proofs}
          onApproveProof={handleApproveProof}
          onRejectProof={handleRejectProof}
          feedbacks={feedbacks}
          onReplyFeedback={handleReplyFeedback}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          language={language}
        />
      )}

      {/* RULES MODAL */}
      {rulesModalOpen && (
        <RulesModal
          isOpen={rulesModalOpen}
          onClose={() => setRulesModalOpen(false)}
          language={language}
        />
      )}

      {/* DEDICATED GOOGLE ADSENSE COMPLIANCE & POLICY TRUST MODAL (PRIVACY, TERMS, CONTACT) */}
      {policyModalPage && (
        <PolicyTrustModal
          activePage={policyModalPage}
          onSelectPage={page => setPolicyModalPage(page)}
          onClose={() => setPolicyModalPage(null)}
          currentUser={currentUser}
          onSubmitFeedback={handleSubmitFeedback}
          onShowToast={showToast}
          language={language}
        />
      )}

      {/* RESELL ORDER CHECKOUT MODAL */}
      {selectedProductForOrder && (
        <OrderModal
          product={selectedProductForOrder}
          onClose={() => setSelectedProductForOrder(null)}
          onSubmitOrder={handleSubmitOrder}
        />
      )}

      {/* SECURE CASHOUT / WITHDRAWAL MODAL */}
      {walletModalOpen && (
        <WalletModal
          balance={balance}
          currentUser={currentUser}
          onClose={() => setWalletModalOpen(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
          language={language}
        />
      )}

      {/* USER PROFILE MODAL (NO REFERRAL CLUTTER, HAS CLOSE X BUTTON) */}
      {profileModalOpen && (
        <UserProfileModal
          balance={balance}
          coins={coins}
          currentUser={currentUser}
          onConvertCoins={handleConvertCoins}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {/* SPIN-TO-WIN MODAL (UPRIGHT ৳5, ৳10, ৳15, ৳20 SLICES + CLOSE X BUTTON) */}
      {spinModalOpen && (
        <SpinWinModal
          isOpen={spinModalOpen}
          onClose={() => setSpinModalOpen(false)}
          balance={balance}
          onSpinWin={handleSpinWin}
          onShowToast={showToast}
          language={language}
        />
      )}

      {/* OFFICIAL COMMUNITY MODAL */}
      {officialChannelOpen && (
        <OfficialChannelModal onClose={() => setOfficialChannelOpen(false)} />
      )}

      {/* STRICT AUTHENTICATION MODAL (WITH CLOSE X BUTTON, GMAIL SIGNUP & OTP RECOVERY) */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          onPasswordReset={handlePasswordReset}
          users={users}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          blockedNoticeUser={blockedNoticeUser}
          onClearBlockedNotice={() => setBlockedNoticeUser(null)}
          onSubmitBlockedComplaint={handleSubmitBlockedUserComplaint}
        />
      )}

      {/* TOAST NOTIFICATION */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenMathTask={() => setMathModalOpen(true)}
        onOpenQuizJob={() => setQuizModalOpen(true)}
        onOpenCaptcha={() => setCaptchaModalOpen(true)}
        onOpenWallet={() => setWalletModalOpen(true)}
        onOpenProfile={() => (currentUser ? setProfileModalOpen(true) : setAuthModalOpen(true))}
        language={language}
      />
    </div>
  );
}
