import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Key, Users, FileText, CheckSquare, Printer, BookmarkPlus, Sparkles, Calculator, RefreshCw } from 'lucide-react';
import { CurrencyUnit, RentInput } from '../types';
import { calculateRent } from '../utils/tierCalculator';
import { formatCurrency, parseInputNumber, spelloutCurrency, toRials } from '../utils/numberUtils';
import { AnimatedCounter } from './AnimatedCounter';

interface RentCalcProps {
  currency: CurrencyUnit;
  onSaveResult: (title: string, desc: string, totalRial: number, inputs: Record<string, unknown>) => void;
  onPrintResult: (data: {
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  }) => void;
}

export function RentCalc({ currency, onSaveResult, onPrintResult }: RentCalcProps) {
  // Three separate input fields as specified in prompt
  const [depositInput, setDepositInput] = useState<string>('500000000'); // 500 million
  const [rentInput, setRentInput] = useState<string>('15000000'); // 15 million monthly
  const [durationMonths, setDurationMonths] = useState<number>(12); // 12 months

  const [lessorsCount, setLessorsCount] = useState<number>(1);
  const [lesseesCount, setLesseesCount] = useState<number>(1);
  const [extraPages, setExtraPages] = useState<number>(0);

  const [inquiryRegistration, setInquiryRegistration] = useState<boolean>(true);
  const [inquiryTax, setInquiryTax] = useState<boolean>(false);
  const [inquiryMunicipality, setInquiryMunicipality] = useState<boolean>(false);

  const rawDeposit = parseInputNumber(depositInput);
  const depositRial = toRials(rawDeposit, currency);

  const rawRent = parseInputNumber(rentInput);
  const rentRial = toRials(rawRent, currency);

  const calcInput: RentInput = useMemo(
    () => ({
      depositAmount: depositRial,
      monthlyRent: rentRial,
      durationMonths,
      lessorsCount,
      lesseesCount,
      extraPages,
      inquiryRegistration,
      inquiryTax,
      inquiryMunicipality,
    }),
    [depositRial, rentRial, durationMonths, lessorsCount, lesseesCount, extraPages, inquiryRegistration, inquiryTax, inquiryMunicipality]
  );

  const result = useMemo(() => calculateRent(calcInput), [calcInput]);

  const resetForm = () => {
    setDepositInput('');
    setRentInput('');
    setDurationMonths(12);
    setLessorsCount(1);
    setLesseesCount(1);
    setExtraPages(0);
    setInquiryRegistration(true);
    setInquiryTax(false);
    setInquiryMunicipality(false);
  };

  const handleSave = () => {
    if (result.totalRial <= 0) return;
    onSaveResult(
      'سند اجاره',
      `اجاره‌نامه (${formatCurrency(depositRial, currency)} رهن + ${formatCurrency(rentRial, currency)} اجاره ماهانه ${durationMonths} ماهه)`,
      result.totalRial,
      { ...calcInput }
    );
  };

  const handlePrint = () => {
    onPrintResult({
      title: 'برآورد هزینه تنظیم سند اجاره املاک',
      details: [
        { key: 'مبلغ رهن (ودیعه)', value: formatCurrency(depositRial, currency) },
        { key: 'اجاره ماهانه', value: formatCurrency(rentRial, currency) },
        { key: 'مدت اجاره', value: `${durationMonths} ماه` },
        { key: 'مبنای محاسبه هزینه‌ها', value: formatCurrency(result.calculationBaseRial, currency) },
        { key: 'تعداد متعاملین', value: `${lessorsCount} موجر / ${lesseesCount} مستأجر` },
      ],
      items: [
        { label: 'حق‌التحریر پلکانی اجاره', amountRial: result.haqOlTahrirRial },
        { label: 'حق‌الثبت اسناد (۰٫۵٪ مبنا)', amountRial: result.haqOlSabtRial },
        { label: 'حق‌الثبت کاداستر (۰٫۵٪ مبنا)', amountRial: result.cadastreRial },
        { label: 'مالیات بر ارزش افزوده (۱۰٪ حق‌التحریر)', amountRial: result.vatRial },
        { label: 'استعلام‌های انتخابی (ثبت/دارایی/شهرداری)', amountRial: result.inquiriesRial },
        { label: 'هزینه موجر/مستأجر اضافه', amountRial: result.extraPersonsRial },
        { label: 'هزینه اوراق اضافی', amountRial: result.extraPagesRial },
        { label: 'ثبت الکترونیک اسناد', amountRial: result.electronicRegRial },
      ],
      totalRial: result.totalRial,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#5E5240]/15 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-700/10 text-amber-700 border border-amber-700/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#134252]">
              محاسبه هزینه تنظیم اسناد اجاره املاک
            </h2>
            <p className="text-xs text-[#628C71] mt-0.5">
              تنظیم سند رسمی اجاره‌نامه مسکونی، تجاری، سرقفلی و اداری
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="text-xs text-[#628C71] hover:text-[#0F766E] flex items-center gap-1 self-end sm:self-center px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          پاکسازی فرم
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-5">
            
            {/* Field 1: Deposit Amount (رهن / ودیعه) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#134252]">
                ۱. مبلغ رهن / ودیعه ({currency === 'TOMAN' ? 'تومان' : 'ریال'}) — (می‌تواند صفر باشد)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={depositInput ? Number(depositInput).toLocaleString('en-US') : ''}
                  onChange={(e) => setDepositInput(parseInputNumber(e.target.value).toString())}
                  placeholder="مثال: ۵۰۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FAF8F6] border border-[#5E5240]/20 rounded-xl px-4 py-3 text-sm font-bold text-[#134252] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E] transition-all dir-ltr text-right"
                />
                <span className="absolute left-3 top-3 text-xs font-bold text-[#628C71]">
                  {currency === 'TOMAN' ? 'تومان' : 'ریال'}
                </span>
              </div>
            </div>

            {/* Field 2: Monthly Rent */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#134252]">
                ۲. مبلغ اجاره ماهانه ({currency === 'TOMAN' ? 'تومان' : 'ریال'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={rentInput ? Number(rentInput).toLocaleString('en-US') : ''}
                  onChange={(e) => setRentInput(parseInputNumber(e.target.value).toString())}
                  placeholder="مثال: ۱۵٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FAF8F6] border border-[#5E5240]/20 rounded-xl px-4 py-3 text-sm font-bold text-[#134252] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E] transition-all dir-ltr text-right"
                />
                <span className="absolute left-3 top-3 text-xs font-bold text-[#628C71]">
                  {currency === 'TOMAN' ? 'تومان' : 'ریال'}
                </span>
              </div>
            </div>

            {/* Field 3: Duration in Months */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-[#134252] flex items-center justify-between">
                <span>۳. مدت اجاره به ماه</span>
                <span className="text-xs text-[#0F766E] font-bold">{durationMonths} ماه ({durationMonths / 12} سال)</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(m)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      durationMonths === m
                        ? 'bg-[#0F766E] text-white border-[#0F766E]'
                        : 'bg-[#FAF8F6] text-[#134252] border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} ماهه
                  </button>
                ))}
              </div>
            </div>

            {/* Lessors & Lessees Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  تعداد موجران (مالکین)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLessorsCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-[#134252] bg-[#FAF8F6] py-2 rounded-xl border border-slate-200">
                    {lessorsCount} نفر
                  </span>
                  <button
                    type="button"
                    onClick={() => setLessorsCount((prev) => Math.min(10, prev + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  تعداد مستأجران
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLesseesCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-[#134252] bg-[#FAF8F6] py-2 rounded-xl border border-slate-200">
                    {lesseesCount} نفر
                  </span>
                  <button
                    type="button"
                    onClick={() => setLesseesCount((prev) => Math.min(10, prev + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Extra Pages */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-[#134252] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  تعداد اوراق اضافی
                </span>
                <span className="text-[11px] font-normal text-slate-500">هر برگ اضافی: ۲۰,۰۰۰ تومان</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={extraPages}
                  onChange={(e) => setExtraPages(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-700"
                />
                <span className="w-16 text-center text-xs font-bold text-amber-800 bg-amber-100 py-1.5 px-2 rounded-lg shrink-0">
                  {extraPages} برگ
                </span>
              </div>
            </div>

            {/* Checkboxes for Inquiries */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                استعلام‌های اجاره اسناد
              </label>

              <div className="space-y-2 bg-[#FAF8F6] p-3.5 rounded-xl border border-[#5E5240]/10">
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryRegistration}
                      onChange={(e) => setInquiryRegistration(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-700 focus:ring-amber-700 border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252]">
                      استعلام ثبت اسناد
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(563_500, currency)}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryTax}
                      onChange={(e) => setInquiryTax(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-700 focus:ring-amber-700 border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252]">
                      استعلام دارایی
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(163_500, currency)}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryMunicipality}
                      onChange={(e) => setInquiryMunicipality(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-700 focus:ring-amber-700 border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252]">
                      استعلام شهرداری
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(163_500, currency)}
                  </span>
                </label>

              </div>
            </div>

          </div>
        </div>

        {/* Breakdown Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-4 sticky top-32">
            
            {/* Calculation Base Highlight (as required by prompt) */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-amber-700" />
                  مبنای محاسبه هزینه‌ها
                </span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">فرمول اجاره</span>
              </div>
              <div className="text-lg font-extrabold text-amber-950">
                {formatCurrency(result.calculationBaseRial, currency)}
              </div>
              <p className="text-[11px] text-amber-800">
                مبلغ رهن + (اجاره ماهانه × مدت به ماه)
              </p>
            </div>

            {/* List Rows */}
            <div className="space-y-2 text-xs">
              
              {/* Haq-ol-Tahrir */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-amber-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌التحریر پلکانی</span>
                  <span className="text-[10px] text-[#628C71]">بر اساس مبنای محاسبه</span>
                </div>
                <span className="font-bold text-amber-800 text-sm">
                  {formatCurrency(result.haqOlTahrirRial, currency)}
                </span>
              </div>

              {/* Haq-ol-Sabt */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-teal-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌الثبت اسناد (۰٫۵٪)</span>
                  <span className="text-[10px] text-[#628C71]">۰٫۵٪ مبنای محاسبه</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.haqOlSabtRial, currency)}
                </span>
              </div>

              {/* Cadastre */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-cyan-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌الثبت کاداستر (۰٫۵٪)</span>
                  <span className="text-[10px] text-[#628C71]">۰٫۵٪ مبنای محاسبه</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.cadastreRial, currency)}
                </span>
              </div>

              {/* VAT */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-indigo-500 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">مالیات بر ارزش افزوده (۱۰٪)</span>
                  <span className="text-[10px] text-[#628C71]">۱۰٪ حق‌التحریر</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.vatRial, currency)}
                </span>
              </div>

              {/* Inquiries */}
              {result.inquiriesRial > 0 && (
                <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-emerald-600 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#134252] block">استعلام‌های انتخابی</span>
                    <span className="text-[10px] text-[#628C71]">ثبت / دارایی / شهرداری</span>
                  </div>
                  <span className="font-bold text-[#134252]">
                    {formatCurrency(result.inquiriesRial, currency)}
                  </span>
                </div>
              )}

              {/* Extra Persons */}
              {result.extraPersonsRial > 0 && (
                <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-orange-500 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#134252] block">هزینه موجر/مستأجر اضافه</span>
                    <span className="text-[10px] text-[#628C71]">موجر و مستأجر بیش از ۱ نفر</span>
                  </div>
                  <span className="font-bold text-[#134252]">
                    {formatCurrency(result.extraPersonsRial, currency)}
                  </span>
                </div>
              )}

              {/* Extra Pages */}
              {result.extraPagesRial > 0 && (
                <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-purple-500 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#134252] block">هزینه اوراق اضافی</span>
                    <span className="text-[10px] text-[#628C71]">{extraPages} برگ</span>
                  </div>
                  <span className="font-bold text-[#134252]">
                    {formatCurrency(result.extraPagesRial, currency)}
                  </span>
                </div>
              )}

              {/* Electronic Reg */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-slate-400 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">ثبت الکترونیک اسناد</span>
                  <span className="text-[10px] text-[#628C71]">هزینه ثابت سامانه</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.electronicRegRial, currency)}
                </span>
              </div>

            </div>

            {/* TOTAL Card */}
            <motion.div
              layout
              className="bg-gradient-to-br from-[#134252] via-[#0F766E] to-[#134252] rounded-[1.75rem] p-5 text-white shadow-lg space-y-2 relative overflow-hidden border border-white/10"
            >
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-teal-100 font-semibold relative z-10">
                <span>مبلغ کل هزینه‌های سند اجاره</span>
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[10px]">دفترخانه ۶۶۲</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-white tracking-tight relative z-10">
                <AnimatedCounter valueRial={result.totalRial} unit={currency} />
              </div>

              {result.totalRial > 0 && (
                <p className="text-[11px] text-teal-100/90 pt-2 border-t border-white/10 relative z-10 font-medium">
                  {spelloutCurrency(result.totalRial, currency)}
                </p>
              )}
            </motion.div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={result.totalRial <= 0}
                className="w-full bg-[#E0F2F1] hover:bg-[#0F766E] text-[#0F766E] hover:text-white disabled:opacity-50 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#0F766E]/20"
              >
                <BookmarkPlus className="w-4 h-4" />
                ذخیره فاکتور
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={result.totalRial <= 0}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white disabled:opacity-50 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                چاپ / پیش‌فاکتور
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
