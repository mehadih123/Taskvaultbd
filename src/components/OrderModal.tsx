import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { Product, Order } from '../types';
import { playSound } from '../utils/audio';

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  onClose,
  onSubmitOrder
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('কালো');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // Resellers can customize their selling price to increase/adjust profit
  const [sellingPrice, setSellingPrice] = useState<number>(product?.customerPrice ?? 0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [cityType, setCityType] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  if (!product) return null;

  // STRICT REQUIREMENT 2: DYNAMIC COLOR & SIZE (FASHION ONLY, HIDDEN FOR OTHERS)
  const isFashion = Boolean(
    /ফ্যাশন|fashion|পোশাক|শার্ট|টি-শার্ট|পাঞ্জাবি|বোরকা|শাড়ি|হুডি/i.test(product.category || '') ||
    /ফ্যাশন|fashion/i.test(product.title || '')
  );

  // STRICT REQUIREMENT 3: ACCURATE DELIVERY CHARGE LOGIC (INSIDE = INSIDE, OUTSIDE = OUTSIDE)
  const insideCharge = product.deliveryChargeInside ?? 60;
  const outsideCharge = product.deliveryChargeOutside ?? 120;
  const deliveryCharge = cityType === 'inside_dhaka' ? insideCharge : outsideCharge;

  // Profit calculations
  const basePrice = product.customerPrice;
  const unitCommission = (product.commission || 0) + Math.max(0, sellingPrice - basePrice);
  const totalCommission = unitCommission * quantity;
  const subtotal = sellingPrice * quantity;
  const totalCustomerPayable = subtotal + deliveryCharge;

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'কাস্টমারের পূর্ণ নাম লিখুন';
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      newErrors.customerPhone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
    }
    if (!customerAddress.trim() || customerAddress.length < 8) {
      newErrors.customerAddress = 'পূর্ণ ডেলিভারি ঠিকানা বিস্তারিত লিখুন (থানা, জেলা সহ)';
    }
    if (sellingPrice < basePrice) {
      newErrors.sellingPrice = `বিক্রয়মূল্য নির্ধারিত মূল্যের (৳${basePrice}) কম হতে পারবে না`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = () => {
    if (quantity < 1) return;
    playSound('click');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!validateStep2()) {
      playSound('error');
      return;
    }
    playSound('click');
    setStep(3);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    playSound('cash');

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        productId: product.id,
        productTitle: `${product.title} (${quantity}টি${isFashion ? ` - ${selectedColor}, সাইজ ${selectedSize}` : ''})`,
        productImage: product.image,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        cityType,
        sellingPrice: subtotal,
        commission: totalCommission,
        status: 'pending_courier',
        escrowReleased: false,
        resellerName: 'মেহেদী হাসান',
        date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      onSubmitOrder(newOrder);
      setIsSubmitting(false);
      setOrderSuccess(newOrder);
      playSound('success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                {orderSuccess ? 'অর্ডার সফল হয়েছে!' : 'রিসেলিং ড্রপশিপিং অর্ডার'}
              </h3>
              <p className="text-xs text-slate-400">
                {orderSuccess ? 'কুরিয়ার বুকিং সম্পন্ন' : `ধাপ ${step}/৩: ${step === 1 ? 'পণ্য ও ভ্যারিয়েশন' : step === 2 ? 'ডেলিভারি এরিয়া ও কাস্টমার ঠিকানা' : 'ইনভয়েস সামারি ও নিশ্চিতকরণ'}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-100 border-2 border-rose-200 dark:border-slate-700 font-black text-2xl leading-none flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Close Order Modal"
            title="বন্ধ করুন (×)"
          >
            &times;
          </button>
        </div>

        {/* Step Progress Indicators */}
        {!orderSuccess && (
          <div className="grid grid-cols-3 gap-2 px-6 pt-3">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          </div>
        )}

        {orderSuccess ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 mb-2">
                ইনভয়েস আইডি: #{orderSuccess.id}
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                অর্ডার নিশ্চিত হয়েছে!
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                অভিনন্দন! আপনার কাস্টমার <strong className="text-slate-700 dark:text-slate-200">{orderSuccess.customerName}</strong> এর নামে অর্ডারটি বুকিং হয়েছে। ডেলিভারি সম্পন্ন হলে আপনার নির্ধারিত কমিশন অটো ব্যালেন্সে জমা হবে।
              </p>
            </div>

            {/* Commission highlight box */}
            <div className="glass-panel p-4 rounded-2xl border border-amber-300 dark:border-amber-700/60 max-w-md mx-auto text-center bg-amber-50/40 dark:bg-amber-950/20">
              <div className="text-xs text-amber-700 dark:text-amber-300 font-bold">পেন্ডিং এস্ক্রো কমিশন (স্মার্ট সুরক্ষা)</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <span>৳</span>
                <span>{orderSuccess.commission.toLocaleString('bn-BD')}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                কুরিয়ার ডেলিভারি সম্পন্ন ও পেমেন্ট কনফার্মেশনের পর স্বয়ংক্রিয়ভাবে উইথড্রয়াল ব্যালেন্সে যুক্ত হবে।
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>কাস্টমার নাম্বার: {orderSuccess.customerPhone}</div>
              <div>ডেলিভারি ঠিকানা: {orderSuccess.customerAddress}</div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => { playSound('click'); onClose(); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                ঠিক আছে, ধন্যবাদ
              </button>
            </div>
          </div>
        ) : (
          /* 3-Step Wizard Body */
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Product Summary Mini Card */}
            <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 items-center">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {product.title}
                  </h4>
                  {product.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    খুচরা মূল্য: <strong className="text-slate-700 dark:text-slate-200">৳{product.customerPrice}</strong>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    কমিশন: ৳{product.commission}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 1: QUANTITY & DYNAMIC VARIATIONS */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                {/* Quantity Selector */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      পণ্যের পরিমাণ (Quantity)
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">প্রতি পিসে নির্ধারিত কমিশন স্বয়ংক্রিয়ভাবে হিসাব হবে</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-base text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.min(50, prev + 1))}
                      className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* STRICT REQUIREMENT 2: DYNAMIC COLOR & SIZE (FASHION ONLY, HIDDEN FOR OTHERS) */}
                {isFashion ? (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                        পোশাক / ফ্যাশন ভ্যারিয়েশন নির্বাচন
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                        Fashion Option
                      </span>
                    </div>

                    {/* Color selection */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                        রঙ নির্বাচন করুন (Color) *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['কালো', 'সাদা', 'নেভি ব্লু', 'মেরুন'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                              selectedColor === c
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size selection */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                        সাইজ নির্বাচন করুন (Size) *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['M', 'L', 'XL', 'XXL'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                              selectedSize === s
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>এই ক্যাটাগরির জন্য রঙ বা সাইজ ভ্যারিয়েশন আবশ্যক নয়। সরাসরি পরিমাণ নির্ধারণ করে পরবর্তী ধাপে যান।</span>
                  </div>
                )}

                {/* Selling Price / Markup Control */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-0.5">
                      প্রতি পিস বিক্রয়মূল্য (৳)
                    </label>
                    <span className="text-[10px] text-slate-400">নির্ধারিত মূল্য ৳{product.customerPrice}</span>
                  </div>
                  <input
                    type="number"
                    min={product.customerPrice}
                    step={10}
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-28 px-3 py-1.5 text-right text-base font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextToStep2}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <span>পরবর্তী ধাপ: ডেলিভারি ও কাস্টমার তথ্য</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: DELIVERY ZONE & CUSTOMER DETAILS */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                {/* STRICT REQUIREMENT 3: ACCURATE DELIVERY CHARGE LOGIC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ডেলিভারি এরিয়া নির্বাচন করুন *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label 
                      onClick={() => setCityType('inside_dhaka')}
                      className={`flex flex-col justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        cityType === 'inside_dhaka'
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cityType"
                          checked={cityType === 'inside_dhaka'}
                          onChange={() => setCityType('inside_dhaka')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold">ঢাকার ভেতরে</span>
                      </div>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-2">
                        ৳{insideCharge} BDT
                      </span>
                    </label>

                    <label 
                      onClick={() => setCityType('outside_dhaka')}
                      className={`flex flex-col justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        cityType === 'outside_dhaka'
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cityType"
                          checked={cityType === 'outside_dhaka'}
                          onChange={() => setCityType('outside_dhaka')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold">ঢাকার বাইরে</span>
                      </div>
                      <span className="text-sm font-black text-slate-600 dark:text-slate-300 mt-2">
                        ৳{outsideCharge} BDT
                      </span>
                    </label>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      কাস্টমারের পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3.5 py-2 text-sm rounded-xl border ${errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none`}
                    />
                    {errors.customerName && <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      কাস্টমারের মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full px-3.5 py-2 text-sm font-mono rounded-xl border ${errors.customerPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none`}
                    />
                    {errors.customerPhone && <p className="text-[11px] text-rose-500 mt-1">{errors.customerPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      পূর্ণ ডেলিভারি ঠিকানা (থানা ও জেলা সহ) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className={`w-full px-3.5 py-2 text-sm rounded-xl border ${errors.customerAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none`}
                    />
                    {errors.customerAddress && <p className="text-[11px] text-rose-500 mt-1">{errors.customerAddress}</p>}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setStep(1); }}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>পূর্ববর্তী</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextToStep3}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>পরবর্তী: অর্ডার রিভিউ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUMMARY & CASH ON DELIVERY CONFIRMATION */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 font-bold">
                    <span className="text-slate-900 dark:text-white">অর্ডার বিবরণী (Invoice Summary)</span>
                    <span className="text-emerald-600 font-bold">ক্যাশ অন ডেলিভারি</span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>পণ্য:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{product.title}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>পরিমাণ:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{quantity} টি</span>
                  </div>
                  {isFashion && (
                    <div className="flex justify-between text-slate-500">
                      <span>ভ্যারিয়েশন (রঙ ও সাইজ):</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">রঙ: {selectedColor} | সাইজ: {selectedSize}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>পণ্যের মূল্য সাবটোটাল:</span>
                    <span className="font-bold text-slate-900 dark:text-white">৳{subtotal.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>ডেলিভারি চার্জ ({cityType === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):</span>
                    <span className="font-bold text-slate-900 dark:text-white">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-black">
                    <span className="text-slate-900 dark:text-white">কাস্টমার প্রদেয় মোট টাকা:</span>
                    <span className="text-base text-pink-600 dark:text-pink-400">৳{totalCustomerPayable.toLocaleString('bn-BD')} BDT</span>
                  </div>

                  {/* Reseller Commission Highlight */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block">আপনার অর্জিত নিট কমিশন:</span>
                      <span className="text-[10px] text-slate-400">কুরিয়ার ডেলিভারির পর স্বয়ংক্রিয় যুক্ত হবে</span>
                    </div>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ৳{totalCommission.toLocaleString('bn-BD')} BDT
                    </span>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-400">
                    <div><strong>প্রাপক:</strong> {customerName} ({customerPhone})</div>
                    <div><strong>ঠিকানা:</strong> {customerAddress}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setStep(2); }}
                    className="w-1/3 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-300 transition-colors"
                  >
                    ← এডিট
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="w-2/3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>অর্ডার বুকিং হচ্ছে...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ক্যাশ অন ডেলিভারি নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
