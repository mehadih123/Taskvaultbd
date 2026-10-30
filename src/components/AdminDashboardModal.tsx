import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  Users, 
  Clock, 
  Smartphone, 
  Search,
  AlertCircle,
  Lock,
  Unlock,
  ArrowUpRight,
  RotateCcw,
  MessageSquare,
  Send,
  Eye,
  Check,
  LayoutDashboard,
  UserCheck,
  UserX,
  Radio,
  FileText,
  AlertTriangle,
  KeyRound,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Wallet,
  CheckCheck
} from 'lucide-react';
import { Product, Order, MicroJob, TaskProofSubmission, Language, UserAccount, WithdrawalRequest, FeedbackItem } from '../types';
import { playSound } from '../utils/audio';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Admin device security
  adminToken?: string | null;
  onRevokeAdminDevice?: () => void;
  // User Management
  users: UserAccount[];
  onToggleBlockUser: (userId: string, reason?: string) => void;
  // Withdrawals Management
  withdrawals: WithdrawalRequest[];
  onApproveWithdrawal: (withdrawalId: string) => void;
  onRejectWithdrawal: (withdrawalId: string, reason: string) => void;
  // Resell Orders & Escrow
  orders: Order[];
  onApproveEscrowOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  // User Submitted Jobs
  jobs: MicroJob[];
  onApproveUserJob: (jobId: string) => void;
  onRejectUserJob: (jobId: string) => void;
  // Worker Proofs
  proofs: TaskProofSubmission[];
  onApproveProof: (proofId: string) => void;
  onRejectProof: (proofId: string) => void;
  // Feedbacks & Complaints
  feedbacks: FeedbackItem[];
  onReplyFeedback: (feedbackId: string, reply: string) => void;
  // Products Management
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  language: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  onRevokeAdminDevice,
  users,
  onToggleBlockUser,
  withdrawals,
  onApproveWithdrawal,
  onRejectWithdrawal,
  orders,
  onApproveEscrowOrder,
  onUpdateOrderStatus,
  jobs,
  onApproveUserJob,
  onRejectUserJob,
  proofs,
  onApproveProof,
  onRejectProof,
  feedbacks,
  onReplyFeedback,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  language
}) => {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'active_users' | 'blocked_users' | 'complaints' | 'withdrawals' | 'orders' | 'products' | 'jobs_proofs'>('dashboard');

  // Search filters
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'appeals' | 'general'>('all');

  // Block Modal Confirmation State
  const [userToBlock, setUserToBlock] = useState<UserAccount | null>(null);
  const [blockReason, setBlockReason] = useState('সন্দেহজনক কার্যকলাপ ও পলিসি লঙ্ঘন');
  const [customBlockReason, setCustomBlockReason] = useState('');

  // Withdrawal Reject Modal state
  const [rejectingWdrId, setRejectingWdrId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('ভুল একাউন্ট নম্বর প্রদান করা হয়েছে');

  // Feedback Reply state
  const [replyingFbId, setReplyingFbId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Master PIN Change State
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleUpdateAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('taskvault_admin_pin') || '2026';
    if (currentPinInput !== storedPin) {
      setPinMessage({ text: 'ভুল পিন! পুনরায় চেষ্টা করুন।', isError: true });
      playSound('error');
      return;
    }
    if (newPinInput.length < 4) {
      setPinMessage({ text: 'নতুন পিন কমপক্ষে ৪ সংখ্যার হতে হবে!', isError: true });
      playSound('error');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinMessage({ text: 'নতুন পিন ও কনফার্ম পিন মেলেনি!', isError: true });
      playSound('error');
      return;
    }

    localStorage.setItem('taskvault_admin_pin', newPinInput);
    setPinMessage({ text: 'এডমিন মাস্টার পিন সফলভাবে পরিবর্তন করা হয়েছে!', isError: false });
    playSound('success');
    setTimeout(() => {
      setShowPinModal(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setPinMessage(null);
    }, 1500);
  };

  // Product Add / Edit Form State
  // Product Add / Edit Form State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodCategory, setProdCategory] = useState<string>('medicine');
  const [customerPrice, setCustomerPrice] = useState<number>(500);
  const [commission, setCommission] = useState<number>(150);
  const [deliveryInside, setDeliveryInside] = useState<number>(60);
  const [deliveryOutside, setDeliveryOutside] = useState<number>(120);
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [prodError, setProdError] = useState('');
  const [features, setFeatures] = useState('অরিজিনাল ও অথেনটিক,ক্যাশ অন ডেলিভারি');

  // File upload reader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // User counts and lists
  const activeUsers = users.filter(u => !u.isBlocked);
  const blockedUsers = users.filter(u => u.isBlocked);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const pendingUserJobs = jobs.filter(j => j.status === 'pending_admin_approval');
  const pendingProofs = proofs.filter(p => p.status === 'pending');
  const pendingEscrowOrders = orders.filter(o => o.status === 'pending_courier' || !o.escrowReleased);
  const appealsFeedbacks = feedbacks.filter(f => f.category === 'blocked_account_appeal');
  const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending');

  const totalPlatformBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalEscrowBalance = users.reduce((acc, u) => acc + (u.pendingEscrowBalance || 0), 0);

  const handleEditProductClick = (p: Product) => {
    playSound('click');
    setEditingProdId(p.id);
    setProdTitle(p.title);
    setProdTitleEn(p.titleEn);
    setProdCategory(p.category);
    setCustomerPrice(p.customerPrice);
    setCommission(p.commission);
    setDeliveryInside(p.deliveryChargeInside ?? 60);
    setDeliveryOutside(p.deliveryChargeOutside ?? 120);
    setImage(p.image);
    setImagePreview(p.image);
    setFeatures(p.features.join(', '));
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProdError('');
    if (!prodTitle.trim()) return;
    if (!image.trim()) {
      playSound('error');
      setProdError('অনুগ্রহ করে পণ্যের ছবি আপলোড করুন বা ইমেজ লিংক দিন!');
      return;
    }

    playSound('success');
    if (editingProdId) {
      const existing = products.find(p => p.id === editingProdId);
      if (existing) {
        onUpdateProduct({
          ...existing,
          title: prodTitle,
          titleEn: prodTitleEn || prodTitle,
          category: prodCategory,
          customerPrice: Number(customerPrice),
          commission: Number(commission),
          deliveryChargeInside: Number(deliveryInside),
          deliveryChargeOutside: Number(deliveryOutside),
          image,
          features: features.split(',').map(f => f.trim()).filter(Boolean)
        });
      }
    } else {
      const newP: Product = {
        id: 'prod-' + Date.now(),
        title: prodTitle,
        titleEn: prodTitleEn || prodTitle,
        category: prodCategory,
        customerPrice: Number(customerPrice),
        commission: Number(commission),
        deliveryChargeInside: Number(deliveryInside),
        deliveryChargeOutside: Number(deliveryOutside),
        image,
        rating: 4.9,
        soldCount: 0,
        supplier: 'TaskVault Direct',
        description: 'অফিসিয়াল হোলসেল প্রোডাক্ট। ক্যাশ অন ডেলিভারি সুবিধা ও জিরো রিস্কে কমিশন।',
        features: features.split(',').map(f => f.trim()).filter(Boolean)
      };
      onAddProduct(newP);
    }

    setIsEditingProduct(false);
    setEditingProdId(null);
    setImagePreview('');
  };

  const handleConfirmRejectWithdrawal = (id: string) => {
    playSound('error');
    onRejectWithdrawal(id, rejectReason);
    setRejectingWdrId(null);
    setRejectReason('ভুল একাউন্ট নম্বর প্রদান করা হয়েছে');
  };

  const handleConfirmFeedbackReply = (id: string) => {
    if (!replyText.trim()) return;
    playSound('success');
    onReplyFeedback(id, replyText);
    setReplyingFbId(null);
    setReplyText('');
  };

  const handleExecuteBlock = () => {
    if (!userToBlock) return;
    const finalReason = customBlockReason.trim() || blockReason;
    playSound('error');
    onToggleBlockUser(userToBlock.id, finalReason);
    setUserToBlock(null);
    setCustomBlockReason('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden my-4">
        
        {/* Top Header with Device Security Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/30 shrink-0">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  TaskVault BD — সিক্রেট অ্যাডমিন প্যানেল
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                  MASTER CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ডিভাইস সিকিউরিটি, ইউজার ব্লক/আনব্লক, উইথড্রয়াল রিফান্ড ও এস্ক্রো কন্ট্রোল
              </p>
            </div>
          </div>

          {/* Right Header: Admin Master PIN, Overview & Logout */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Master PIN Change Trigger */}
            <button
              onClick={() => { playSound('click'); setShowPinModal(true); }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="এডমিন মাস্টার পিন পরিবর্তন করুন"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>পিন পরিবর্তন</span>
            </button>

            {/* Overview / Dashboard Toggle */}
            <button
              onClick={() => { playSound('click'); setActiveTab('dashboard'); }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>ওভারভিউ</span>
            </button>

            {/* Admin Device Session Token Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-[11px] font-mono text-purple-300">
              <span className="hidden xl:inline">টোকেন:</span>
              <strong className="text-white">
                {adminToken ? `${adminToken.slice(0, 8)}••••` : 'AUTH_DEVICE'}
              </strong>
            </div>

            {onRevokeAdminDevice && (
              <button
                onClick={() => {
                  playSound('click');
                  onRevokeAdminDevice();
                }}
                className="px-2 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="লক করুন"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">লক</span>
              </button>
            )}

            {/* Prominent Close (×) Button */}
            <button
              type="button"
              onClick={() => { playSound('click'); onClose(); }}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-rose-600 text-white border-2 border-slate-600 hover:border-rose-500 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
              aria-label="Close Admin Modal"
              title="বন্ধ করুন (×)"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW DASHBOARD & DEVICE SECURITY */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Device Security Announcement Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        অ্যাডমিন ডিভাইস সিকিউরিটি ও সেশন অথরাইজেশন
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] font-bold">
                        সক্রিয় ও এনক্রিপ্টেড
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      এই ডিভাইসটিতে একটি স্থায়ী সিকিউরিটি টোকেন যুক্ত রয়েছে। অনুমতিহীন কোনো বহিরাগত ডিভাইস থেকে সরাসরি এই প্যানেলে প্রবেশ সম্পূর্ণভাবে ব্লক থাকবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-slate-400">সেশন টোকেন</div>
                    <div className="text-xs font-mono font-bold text-purple-300">
                      {adminToken || 'ADM-SEC-DEVICE-BINDED'}
                    </div>
                  </div>
                  {onRevokeAdminDevice && (
                    <button
                      onClick={onRevokeAdminDevice}
                      className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ডিভাইস লক</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>মোট ইউজার</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{users.length} জন</div>
                  <div className="text-[11px] text-slate-400">রিয়েল-টাইম রেজিস্টার্ড</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>সক্রিয় মেম্বার</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">{activeUsers.length} জন</div>
                  <div className="text-[11px] text-emerald-500 font-medium">স্বাভাবিক প্রবেশাধিকার আছে</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>ব্লকড অ্যাকাউন্ট</span>
                    <UserX className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400">{blockedUsers.length} জন</div>
                  <div className="text-[11px] text-rose-400 font-medium">সেশন ও লগইন স্থগিত</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>মোট ইউজার ব্যালেন্স</span>
                    <Wallet className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-teal-300">
                    ৳{totalPlatformBalance.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium">
                    এস্ক্রো: ৳{totalEscrowBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* VERTICALLY STACKED FULL-WIDTH ADMIN ACTION CONTROLS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    মাস্টার কন্ট্রোল ও ব্যবস্থাপনা (Admin Management Actions)
                  </h4>
                  <span className="text-[11px] text-purple-400 font-medium">৫টি মূল বিভাগ</span>
                </div>

                <div className="flex flex-col w-full space-y-2.5">
                  
                  {/* 1. Active Users Card */}
                  <button
                    onClick={() => { playSound('click'); setActiveTab('active_users'); }}
                    className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                            ১. সক্রিয় ইউজার তালিকা (Active Users)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          রিয়েল-টাইম ইউজার পর্যবেক্ষণ, ব্যালেন্স ট্র্যাকিং ও তাৎক্ষণিক ব্লক অপশন
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold font-mono">
                        {activeUsers.length} জন সক্রিয়
                      </span>
                      <span className="text-slate-500 group-hover:text-emerald-400 text-lg transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </button>

                  {/* 2. Blocked Users Card */}
                  <button
                    onClick={() => { playSound('click'); setActiveTab('blocked_users'); }}
                    className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UserX className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-rose-300 transition-colors">
                            ২. ব্লকড ইউজার তালিকা (Blocked Users)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          স্থগিত অ্যাকাউন্টসমূহ, ব্লকের কারণ পর্যালোচনা ও সেশন আনব্লক নিয়ন্ত্রণ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold font-mono">
                        {blockedUsers.length} জন স্থগিত
                      </span>
                      <span className="text-slate-500 group-hover:text-rose-400 text-lg transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </button>

                  {/* 3. Product Upload Card */}
                  <button
                    onClick={() => { playSound('click'); setActiveTab('products'); }}
                    className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-teal-950/80 border border-teal-700/60 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-teal-300 transition-colors">
                            ৩. প্রোডাক্ট আপলোড ও ক্যাটালগ (Product Upload)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          গ্যালারি থেকে সরাসরি ছবি আপলোড, ক্যাটাগরি ও ঢাকার ভেতর/বাইরে ডেলিভারি চার্জ নির্ধারণ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold font-mono">
                        {products.length} টি পণ্য লাইভ
                      </span>
                      <span className="text-slate-500 group-hover:text-teal-400 text-lg transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </button>

                  {/* 4. Withdrawal Requests Card */}
                  <button
                    onClick={() => { playSound('click'); setActiveTab('withdrawals'); }}
                    className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-pink-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-pink-950/80 border border-pink-700/60 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-pink-300 transition-colors">
                            ৪. উইথড্রয়াল রিকোয়েস্ট (Withdrawal Requests)
                          </h4>
                          {pendingWithdrawals.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500 text-white font-bold animate-pulse">
                              নতুন
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          বিকাশ, নগদ ও রকেট ক্যাশআউট অনুমোদন, TrxID প্রদান বা কারণসহ রিজেক্ট
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-pink-950 border border-pink-800 text-pink-300 text-xs font-bold font-mono">
                        {pendingWithdrawals.length} টি পেন্ডিং
                      </span>
                      <span className="text-slate-500 group-hover:text-pink-400 text-lg transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </button>

                  {/* 5. Support & Appeals Card */}
                  <button
                    onClick={() => { playSound('click'); setActiveTab('complaints'); }}
                    className="w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-left transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-950/80 border border-blue-700/60 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-blue-300 transition-colors">
                            ৫. অভিযোগ ও সাপোর্ট ইনবক্স (Support & Appeals)
                          </h4>
                          {appealsFeedbacks.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                              {appealsFeedbacks.length} আপিল
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ব্লকড ইউজারদের আপিল ও সাধারণ সাপোর্ট বার্তার উত্তর ও সমাধান
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-bold font-mono">
                        {feedbacks.length} টি বার্তা
                      </span>
                      <span className="text-slate-500 group-hover:text-blue-400 text-lg transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ACTIVE / UNBLOCKED USERS LIST (REQUIREMENT 4A) */}
          {activeTab === 'active_users' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>সক্রিয় ইউজার তালিকা ({activeUsers.length} জন)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    যেকোনো ইউজারকে "ব্লক করুন" ক্লিক করলে তার সেশন তাৎক্ষণিকভাবে বন্ধ (Auto-Logout) হয়ে যাবে
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500 w-full sm:w-64"
                  />
                </div>
              </div>

              {activeUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl">
                  কোনো সক্রিয় ইউজার পাওয়া যায়নি
                </div>
              ) : (
                <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                        <tr>
                          <th className="p-3.5">ইউজার তথ্য</th>
                          <th className="p-3.5">মোবাইল নম্বর</th>
                          <th className="p-3.5">ব্যালেন্স</th>
                          <th className="p-3.5">এস্ক্রো</th>
                          <th className="p-3.5">স্ট্যাটাস</th>
                          <th className="p-3.5">যোগদানের তারিখ</th>
                          <th className="p-3.5 text-right">নিরাপত্তা অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {activeUsers
                          .filter(u => 
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.phone.includes(searchQuery) ||
                            u.id.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-3.5">
                                <div className="font-bold text-white text-sm">{u.name}</div>
                                <div className="text-[10px] font-mono text-slate-400">{u.id} • {u.memberTier}</div>
                              </td>
                              <td className="p-3.5 font-mono font-medium text-slate-200">
                                {u.phone}
                              </td>
                              <td className="p-3.5 font-bold text-emerald-400 text-sm">
                                ৳{u.balance?.toLocaleString()}
                              </td>
                              <td className="p-3.5 font-bold text-amber-400">
                                ৳{u.pendingEscrowBalance || 0}
                              </td>
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>সক্রিয় (Active)</span>
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-400 text-[11px]">
                                {u.joinedDate}
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => setUserToBlock(u)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 cursor-pointer transition-all active:scale-95"
                                  title="ইউজারকে ব্লক করুন ও সেশন বাতিল করুন"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>ব্লক করুন</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: BLOCKED USERS LIST (REQUIREMENT 4B) */}
          {activeTab === 'blocked_users' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <UserX className="w-4 h-4 text-rose-400" />
                    <span>ব্লকড ইউজার তালিকা ({blockedUsers.length} জন)</span>
                  </h3>
                  <p className="text-xs text-rose-200 mt-0.5">
                    এই ইউজারদের সেশন স্থগিত। "আনব্লক করুন" ক্লিক করলে তারা তাৎক্ষণিকভাবে আবার লগইন ও কাজকর্ম করতে পারবেন
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ব্লকড ইউজার খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-rose-500 w-full sm:w-64"
                  />
                </div>
              </div>

              {blockedUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
                  <h4 className="font-bold text-white text-sm">কোনো ব্লকড ইউজার নেই</h4>
                  <p className="text-xs text-slate-400">
                    প্ল্যাটফর্মের সকল ব্যবহারকারী বর্তমানে সক্রিয় এবং নিরাপদ অবস্থায় রয়েছেন।
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                        <tr>
                          <th className="p-3.5">ইউজার তথ্য</th>
                          <th className="p-3.5">মোবাইল নম্বর</th>
                          <th className="p-3.5">ব্যালেন্স</th>
                          <th className="p-3.5">ব্লক করার কারণ</th>
                          <th className="p-3.5">আপিল স্ট্যাটাস</th>
                          <th className="p-3.5 text-right">অ্যাকশন (আনব্লক)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {blockedUsers
                          .filter(u => 
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.phone.includes(searchQuery)
                          )
                          .map((u) => {
                            const hasAppeal = feedbacks.some(f => f.userPhone.replace(/\D/g, '') === u.phone.replace(/\D/g, '') && f.category === 'blocked_account_appeal');
                            return (
                              <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-3.5">
                                  <div className="font-bold text-white text-sm">{u.name}</div>
                                  <div className="text-[10px] font-mono text-slate-400">{u.id}</div>
                                </td>
                                <td className="p-3.5 font-mono font-medium text-rose-300">
                                  {u.phone}
                                </td>
                                <td className="p-3.5 font-bold text-slate-300">
                                  ৳{u.balance?.toLocaleString()}
                                </td>
                                <td className="p-3.5 text-rose-300 text-xs">
                                  {u.blockReason || 'অ্যাডমিন কর্তৃক অ্যাকাউন্ট স্থগিত'}
                                </td>
                                <td className="p-3.5">
                                  {hasAppeal ? (
                                    <button
                                      onClick={() => {
                                        setActiveTab('complaints');
                                        setComplaintFilter('appeals');
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 text-[10px] font-bold hover:bg-rose-900 cursor-pointer"
                                    >
                                      <AlertCircle className="w-3 h-3 text-rose-400" />
                                      <span>আপিল জমা দিয়েছে →</span>
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-500">কোনো আপিল নেই</span>
                                  )}
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => {
                                      playSound('success');
                                      onToggleBlockUser(u.id);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>আনব্লক করুন</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: USER COMPLAINTS & APPEALS INBOX (REQUIREMENT 3 & 4) */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <span>ইউজার মতামত, অভিযোগ ও ব্লকড অ্যাকাউন্ট আপিল ইনবক্স</span>
                  </h3>
                  <p className="text-xs text-teal-200 mt-0.5">
                    ব্লকড ইউজারদের অভিযোগ এখান থেকে সরাসরি পর্যালোচনা করে ১-ক্লিকে অ্যাকাউন্ট সক্রিয় করা যায়
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setComplaintFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      complaintFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    সব ({feedbacks.length})
                  </button>
                  <button
                    onClick={() => setComplaintFilter('appeals')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                      complaintFilter === 'appeals' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-rose-400 hover:text-white'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>ব্লকড আপিল ({appealsFeedbacks.length})</span>
                  </button>
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl">
                  কোনো মতামত বা অভিযোগ জমা পড়েনি
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbacks
                    .filter(f => {
                      if (complaintFilter === 'appeals') return f.category === 'blocked_account_appeal';
                      if (complaintFilter === 'general') return f.category !== 'blocked_account_appeal';
                      return true;
                    })
                    .map((fb) => {
                      const matchedUser = users.find(u => u.phone.replace(/\D/g, '') === fb.userPhone.replace(/\D/g, ''));
                      const isUserCurrentlyBlocked = matchedUser?.isBlocked;

                      return (
                        <div
                          key={fb.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            fb.category === 'blocked_account_appeal'
                              ? 'bg-rose-950/20 border-rose-800/60'
                              : 'bg-slate-800/80 border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs text-indigo-400 font-bold">#{fb.id}</span>
                                {fb.category === 'blocked_account_appeal' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>ব্লকড অ্যাকাউন্ট আপিল</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                                    {fb.category}
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400">{fb.date}</span>
                              </div>

                              <div className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{fb.userName}</span>
                                <span className="text-xs font-mono text-emerald-400">({fb.userPhone})</span>
                                {isUserCurrentlyBlocked && (
                                  <span className="px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-bold">
                                    অ্যাকাউন্ট ব্লকড
                                  </span>
                                )}
                              </div>

                              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans mt-2">
                                {fb.message}
                              </div>

                              {fb.adminReply && (
                                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 mt-2 flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold">অ্যাডমিন উত্তর:</span> {fb.adminReply}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions: Unblock Directly & Reply */}
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                              {matchedUser && isUserCurrentlyBlocked && (
                                <button
                                  onClick={() => {
                                    playSound('success');
                                    onToggleBlockUser(matchedUser.id);
                                    onReplyFeedback(fb.id, 'আপনার অভিযোগ গ্রহণ করা হয়েছে এবং অ্যাকাউন্ট আনব্লক করে সক্রিয় করা হয়েছে।');
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>আনব্লক ও সক্রিয় করুন</span>
                                </button>
                              )}

                              <button
                                onClick={() => setReplyingFbId(fb.id)}
                                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>উত্তর দিন</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Feedback Reply Modal */}
              {replyingFbId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      <span>অভিযোগের জবাব প্রদান</span>
                    </h4>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="অ্যাডমিন উত্তর লিখুন..."
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmFeedbackReply(replyingFbId)}
                        className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
                      >
                        জবাব পাঠান
                      </button>
                      <button
                        onClick={() => setReplyingFbId(null)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: WITHDRAWALS MANAGEMENT */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-pink-400" />
                    <span>উইথড্রয়াল রিকোয়েস্ট অনুমোদন ও রিফান্ড ম্যানেজমেন্ট</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ভুল বা সন্দেহজনক উইথড্র বাতিল করলে স্বয়ংক্রিয়ভাবে ইউজারের একাউন্টে ব্যালেন্স রিফান্ড হবে
                  </p>
                </div>
              </div>

              {withdrawals.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl">
                  কোনো উইথড্র রিকোয়েস্ট পাওয়া যায়নি
                </div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-400 text-xs">#{w.id}</span>
                          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-pink-950 text-pink-300 border border-pink-800">
                            {w.method} ({w.accountType})
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300'
                              : w.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-amber-950 text-amber-300 animate-pulse'
                          }`}>
                            {w.status === 'approved' ? '✓ সফল' : w.status === 'rejected' ? '✗ বাতিল ও রিফান্ডেড' : '⏳ পেন্ডিং রিভিউ'}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-white">
                          ইউজার: {w.userName} (<span className="font-mono text-emerald-400">{w.accountNumber}</span>)
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>পরিমাণ: <strong className="text-emerald-400 text-sm">৳{w.amount}</strong></span>
                          <span>তারিখ: {w.date}</span>
                          {w.trxId && <span>TrxID: <strong className="font-mono text-indigo-300">{w.trxId}</strong></span>}
                          {w.rejectReason && <span className="text-rose-400">কারণ: {w.rejectReason}</span>}
                        </div>
                      </div>

                      {/* Action buttons */}
                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              playSound('success');
                              onApproveWithdrawal(w.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন করুন</span>
                          </button>

                          <button
                            onClick={() => setRejectingWdrId(w.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-600/40 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>বাতিল ও রিফান্ড</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reject Reason Modal */}
              {rejectingWdrId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>উইথড্রয়াল বাতিল ও রিফান্ড নিশ্চিতকরণ</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      বাতিল করার পর উত্তোলনের পুরো টাকা ইউজারের ব্যালেন্সে সাথে সাথে ফেরত যাবে।
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        বাতিলের কারণ নির্বাচন করুন:
                      </label>
                      <select
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                      >
                        <option value="ভুল একাউন্ট নম্বর প্রদান করা হয়েছে">ভুল একাউন্ট নম্বর প্রদান করা হয়েছে</option>
                        <option value="বিকাশ লিমিট পার হয়েছে">বিকাশ লিমিট পার হয়েছে</option>
                        <option value="ব্যবহারকারীর অনুরোধে বাতিল">ব্যবহারকারীর অনুরোধে বাতিল</option>
                        <option value="সন্দেহজনক লেনদেন যাচাই">সন্দেহজনক লেনদেন যাচাই</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleConfirmRejectWithdrawal(rejectingWdrId)}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        হ্যাঁ, রিফান্ড করুন
                      </button>
                      <button
                        onClick={() => setRejectingWdrId(null)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: RESELL ORDERS & SMART ESCROW */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <strong className="block text-sm font-bold text-amber-300 mb-0.5">
                    স্মার্ট এস্ক্রো নীতি (Smart Escrow Protocol):
                  </strong>
                  কাস্টমার কুরিয়ার থেকে পণ্য বুঝে নিয়ে মূল্য পরিশোধ করার পরই কেবল "ডেলিভার্ড ও পেইড (কমিশন রিলিজ)" বাটনে ক্লিক করবেন। সাথে সাথে রিসেলারের পেন্ডিং এস্ক্রো ব্যালেন্স আসল উইথড্রয়াল ব্যালেন্সে ট্রান্সফার হবে।
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl">
                  কোনো অর্ডার বুকিং পাওয়া যায়নি
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400 text-xs">#{order.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'delivered_paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                            }`}>
                              {order.status === 'delivered_paid' ? 'ডেলিভার্ড ও কমিশন পেইড' : order.status === 'shipped' ? 'কুরিয়ারে রওয়ানা' : 'পেন্ডিং কুরিয়ার বুকিং'}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-white">
                            {order.productTitle}
                          </div>

                          <div className="text-xs text-slate-300">
                            কাস্টমার: <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.customerAddress}
                          </div>

                          <div className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                            <span>বিক্রয় মূল্য: <strong>৳{order.sellingPrice}</strong></span>
                            <span>রিসেলার কমিশন: <strong className="text-emerald-400 font-bold">৳{order.commission}</strong></span>
                            <span>রিসেলার: {order.resellerName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {order.status === 'pending_courier' && (
                          <button
                            onClick={() => {
                              playSound('click');
                              onUpdateOrderStatus(order.id, 'shipped');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>কুরিয়ারে পাঠান</span>
                          </button>
                        )}

                        {(!order.escrowReleased || order.status !== 'delivered_paid') && (
                          <button
                            onClick={() => {
                              playSound('success');
                              onApproveEscrowOrder(order.id);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>ডেলিভার্ড ও কমিশন রিলিজ</span>
                          </button>
                        )}

                        {order.escrowReleased && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>কমিশন রিলিজড</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>পণ্য ক্যাটালগ ও ইনভেন্টরি ম্যানেজমেন্ট</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    এডমিন প্যানেল থেকে পণ্য যোগ করলে তা রিসেলিং শপে প্রদর্শিত হবে
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSound('click');
                    setIsEditingProduct(!isEditingProduct);
                    setEditingProdId(null);
                    setProdTitle('');
                    setProdTitleEn('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isEditingProduct ? 'ফর্ম লুকান' : 'নতুন পণ্য যোগ করুন'}</span>
                </button>
              </div>

              {/* Product Add / Edit Form */}
              {isEditingProduct && (
                <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 rounded-2xl bg-slate-800 border border-purple-500/40 space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>{editingProdId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য তথ্য ফরম'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">পণ্যের বাংলা নাম *</label>
                      <input
                        type="text"
                        required
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        placeholder="যেমন: ডায়াবেটিস কেয়ার ক্যাপসুল বা স্মার্ট ওয়াচ"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">পণ্যের ইংরেজি নাম *</label>
                      <input
                        type="text"
                        required
                        value={prodTitleEn}
                        onChange={(e) => setProdTitleEn(e.target.value)}
                        placeholder="e.g. Diabetes Care Herbal Pack"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Category, Selling Price & Reseller Commission */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-500 font-medium"
                      >
                        <option value="medicine">ঔষধ ও স্বাস্থ্য (Medicine & Health)</option>
                        <option value="gadget">গ্যাজেট (Gadget)</option>
                        <option value="fashion">ফ্যাশন (Fashion)</option>
                        <option value="beauty">বিউটি (Beauty)</option>
                        <option value="home">হোম ও কিচেন (Home & Kitchen)</option>
                        <option value="grocery">মুদি ও খাদ্য (Grocery & Food)</option>
                        <option value="others">অন্যান্য (Others)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">কাস্টমার বিক্রয় মূল্য (৳) *</label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={customerPrice}
                        onChange={(e) => setCustomerPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-400 mb-1">রিসেলার কমিশন (৳) *</label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={commission}
                        onChange={(e) => setCommission(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs text-emerald-400 font-bold outline-none"
                      />
                    </div>
                  </div>

                  {/* Mandatory Delivery Charges Inside and Outside Dhaka */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/80">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span>ডেলিভারি চার্জ (ঢাকার ভেতরে) *</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={deliveryInside}
                        onChange={(e) => setDeliveryInside(Number(e.target.value))}
                        placeholder="যেমন: ৬০"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none font-bold focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span>ডেলিভারি চার্জ (ঢাকার বাইরে) *</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={deliveryOutside}
                        onChange={(e) => setDeliveryOutside(Number(e.target.value))}
                        placeholder="যেমন: ১২০"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none font-bold focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Image File Uploader & Instant Preview */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      পণ্যের ছবি আপলোড করুন (গ্যালারি / ডিভাইস থেকে ফাইল সিলেক্ট করুন) *
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-purple-500/60 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 text-xs font-bold cursor-pointer transition-colors">
                        <Radio className="w-4 h-4" />
                        <span>ডিভাইস গ্যালারি / ফাইল থেকে ছবি নির্বাচন করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>

                      <div className="w-full sm:w-auto text-center text-xs text-slate-500">অথবা</div>

                      <div className="flex-1 w-full">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => {
                            setImage(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          placeholder="ইমেজ ওয়েব লিংক (URL) লিখুন"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Instant Preview Box */}
                    {imagePreview && (
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-lg object-cover border border-purple-500/50"
                        />
                        <div className="text-xs text-slate-300 flex-1">
                          <span className="font-bold text-emerald-400 block">ছবি সফলভাবে প্রিভিউ হয়েছে</span>
                          <span className="text-[11px] text-slate-400">পাবলিশ করার পর রিসেলিং শপে এটি প্রদর্শিত হবে</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setImage(''); setImagePreview(''); }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-bold cursor-pointer"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    )}
                  </div>

                  {prodError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700 text-rose-300 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{prodError}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProdId ? 'আপডেট সেভ করুন' : 'পণ্য পাবলিশ করুন'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table or Empty Notice */}
              {products.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 p-6 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-purple-400 opacity-60" />
                  <h5 className="font-bold text-white text-sm">ইনভেন্টরি সম্পূর্ণ খালি</h5>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    বর্তমানে কোনো পণ্য যোগ করা নেই। উপরের <strong className="text-purple-300">"নতুন পণ্য যোগ করুন"</strong> বাটনে ক্লিক করে পণ্য ইমেজ, বাংলা নাম, ইংরেজি নাম, পাইকারি দাম ও রিসেলার কমিশন দিয়ে পণ্য যুক্ত করুন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex gap-3.5 items-center"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-white truncate">{p.title}</h5>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          বিক্রয়: ৳{p.customerPrice} • ডেলিভারি: ৳{p.deliveryChargeInside ?? 60} (ঢাকা) / ৳{p.deliveryChargeOutside ?? 120} (বাইরে)
                        </div>
                        <div className="text-xs font-bold text-emerald-400 mt-1">
                          কমিশন: ৳{p.commission}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            playSound('click');
                            onDeleteProduct(p.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: USER JOBS & PROOFS */}
          {activeTab === 'jobs_proofs' && (
            <div className="space-y-6">
              
              {/* Section 1: User Jobs */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>ইউজার পোস্ট করা কাজ অনুমোদন ({jobs.filter(j => j.isUserGenerated).length})</span>
                </h4>

                {jobs.filter(j => j.isUserGenerated).length === 0 ? (
                  <div className="text-center py-6 text-slate-400 bg-slate-800/40 rounded-xl text-xs">
                    কোনো ইউজার জব পেন্ডিং নেই
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.filter(j => j.isUserGenerated).map((job) => (
                      <div
                        key={job.id}
                        className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{job.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              job.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {job.status === 'active' ? 'অনুমোদিত' : 'পেন্ডিং'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            বাজেট: ৳{job.totalBudget} • প্রতিজন: ৳{job.reward} • TrxID: {job.paymentTrxId || 'N/A'}
                          </div>
                        </div>

                        {job.status === 'pending_admin_approval' && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => { playSound('success'); onApproveUserJob(job.id); }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>অনুমোদন</span>
                            </button>
                            <button
                              onClick={() => { playSound('error'); onRejectUserJob(job.id); }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Worker Proofs */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>টাস্ক প্রুফ যাচাই ({proofs.length})</span>
                </h4>

                {proofs.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 bg-slate-800/40 rounded-xl text-xs">
                    কোনো প্রুফ জমা নেই
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proofs.map((prf) => (
                      <div
                        key={prf.id}
                        className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{prf.jobTitle}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prf.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : prf.status === 'rejected' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {prf.status === 'approved' ? 'গৃহীত' : prf.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'পেন্ডিং'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-mono">
                            প্রমাণ: "{prf.proofText}" • ওয়ার্কার: {prf.workerName} ({prf.workerPhone})
                          </div>
                        </div>

                        {prf.status === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => { playSound('success'); onApproveProof(prf.id); }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>অনুমোদন ও পেইড</span>
                            </button>
                            <button
                              onClick={() => { playSound('error'); onRejectProof(prf.id); }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* RETURN TO OVERVIEW DASHBOARD CONTROL WHEN INSIDE ANY SUB-TAB */}
        {activeTab !== 'dashboard' && (
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => { playSound('click'); setActiveTab('dashboard'); }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-purple-600/30"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>← মূল এডমিন প্যানেল (মেনু ও ওভারভিউ ড্যাশবোর্ড)</span>
            </button>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {activeTab.toUpperCase()} • BINDED SESSION
            </div>
          </div>
        )}

      </div>

      {/* MASTER PIN CHANGE MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  মাস্টার পিন পরিবর্তন করুন
                </h4>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdminPin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  বর্তমান মাস্টার পিন *
                </label>
                <input
                  type="password"
                  required
                  placeholder="বর্তমান পিন দিন"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  নতুন মাস্টার পিন * (কমপক্ষে ৪ সংখ্যা)
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  placeholder="নতুন গোপন পিন দিন"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  নতুন পিন নিশ্চিত করুন *
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  placeholder="নতুন পিন পুনরায় লিখুন"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              {pinMessage && (
                <div className={`p-2.5 rounded-xl text-xs font-bold ${
                  pinMessage.isError ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                }`}>
                  {pinMessage.text}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  পিন আপডেট ও সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOCK USER CONFIRMATION MODAL */}
      {userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-600/50 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-base text-white">
                ইউজার অ্যাকাউন্ট ব্লক নিশ্চিতকরণ
              </h4>
              <p className="text-xs text-rose-300 font-semibold">
                ইউজার: {userToBlock.name} ({userToBlock.phone})
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                ব্লক করার সাথে সাথে এই ইউজারের বর্তমান সেশন তাৎক্ষণিকভাবে বাতিল (Auto-Logout) হবে এবং তিনি কোনো কার্যক্রম চালাতে পারবেন না।
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                ব্লক করার কারণ নির্বাচন করুন:
              </label>
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-rose-500"
              >
                <option value="সন্দেহজনক কার্যকলাপ ও পলিসি লঙ্ঘন">সন্দেহজনক কার্যকলাপ ও পলিসি লঙ্ঘন</option>
                <option value="ভুল তথ্য বা একাধিক ডুপ্লিকেট অ্যাকাউন্ট">ভুল তথ্য বা একাধিক ডুপ্লিকেট অ্যাকাউন্ট</option>
                <option value="লেনদেন ও পেমেন্ট অসঙ্গতি">লেনদেন ও পেমেন্ট অসঙ্গতি</option>
                <option value="অ্যাডমিন কর্তৃক অ্যাকাউন্ট সাময়িক স্থগিত">অ্যাডমিন কর্তৃক অ্যাকাউন্ট সাময়িক স্থগিত</option>
              </select>
              
              <input
                type="text"
                placeholder="অথবা নিজস্ব কারণ লিখুন (ঐচ্ছিক)..."
                value={customBlockReason}
                onChange={(e) => setCustomBlockReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleExecuteBlock}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>হ্যাঁ, এখনই ব্লক ও লগআউট করুন</span>
              </button>
              <button
                onClick={() => setUserToBlock(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
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
