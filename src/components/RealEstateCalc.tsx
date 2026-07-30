import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Building, Users, FileText, CheckSquare, Printer, BookmarkPlus, Sparkles, RefreshCw } from 'lucide-react';
import { CurrencyUnit, RealEstateInput } from '../types';
import { calculateRealEstate } from '../utils/tierCalculator';
import { formatCurrency, parseInputNumber, spelloutCurrency, toRials, fromRials } from '../utils/numberUtils';
import { AnimatedCounter } from './AnimatedCounter';

interface RealEstateCalcProps {
  currency: CurrencyUnit;
  onSaveResult: (title: string, desc: string, totalRial: number, inputs: Record<string, unknown>) => void;
  onPrintResult: (data: {
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  }) => void;
}

export function RealEstateCalc({ currency, onSaveResult, onPrintResult }: RealEstateCalcProps) {
  // Local state storing input values in current selected currency
  const [propertyPriceInput, setPropertyPriceInput] = useState<string>('5000000000'); // Default 5 billion Tomans/Rials
  const [sellersCount, setSellersCount] = useState<number>(1);
  const [buyersCount, setBuyersCount] = useState<number>(1);
  const [extraPages, setExtraPages] = useState<number>(0);

  // Checkboxes for inquiries
  const [inquiryRegistration, setInquiryRegistration] = useState<boolean>(true);
  const [inquiryTax, setInquiryTax] = useState<boolean>(true);
  const [inquiryMunicipality, setInquiryMunicipality] = useState<boolean>(true);

  // Convert entered input to standard Rials for mathematical processing
  const rawPriceNumber = parseInputNumber(propertyPriceInput);
  const priceRial = toRials(rawPriceNumber, currency);

  const calcInput: RealEstateInput = useMemo(
    () => ({
      propertyPrice: priceRial,
      sellersCount,
      buyersCount,
      extraPages,
      inquiryRegistration,
      inquiryTax,
      inquiryMunicipality,
    }),
    [priceRial, sellersCount, buyersCount, extraPages, inquiryRegistration, inquiryTax, inquiryMunicipality]
  );

  const result = useMemo(() => calculateRealEstate(calcInput), [calcInput]);

  // Quick preset price setter
  const setPresetPrice = (amountInCurrentUnit: number) => {
    setPropertyPriceInput(amountInCurrentUnit.toString());
  };

  const resetForm = () => {
    setPropertyPriceInput('');
    setSellersCount(1);
    setBuyersCount(1);
    setExtraPages(0);
    setInquiryRegistration(true);
    setInquiryTax(true);
    setInquiryMunicipality(true);
  };

  const handleSave = () => {
    if (result.totalRial <= 0) return;
    onSaveResult(
      'سند غیرمنقول و پیش‌فروش',
      `ملک به ارزش ${formatCurrency(result.propertyPriceRial, currency)} (${sellersCount} فروشنده، ${buyersCount} خریدار)`,
      result.totalRial,
      { ...calcInput }
    );
  };

  const handlePrint = () => {
    onPrintResult({
      title: 'برآورد هزینه تنظیم سند غیرمنقول و پیش‌فروش ساختمان',
      details: [
        { key: 'مبلغ ملک', value: formatCurrency(result.propertyPriceRial, currency) },
        { key: 'تعداد متعاملین', value: `${sellersCount} فروشنده / ${buyersCount} خریدار` },
        { key: 'تعداد اوراق اضافی', value: `${extraPages} برگ` },
      ],
      items: [
        { label: 'حق‌التحریر پلکانی دفترخانه', amountRial: result.haqOlTahrirRial },
        { label: 'حق‌الثبت اسناد (۰٫۵٪ پایه ۹٪)', amountRial: result.haqOlSabtRial },
        { label: 'حق‌الثبت کاداستر (۰٫۵٪ پایه ۹٪)', amountRial: result.cadastreRial },
        { label: 'مالیات بر ارزش افزوده (۱۰٪ پایه ۹٪)', amountRial: result.vatRial },
        { label: 'هزینه استعلام‌های انتخابی (ثبت/دارایی/شهرداری)', amountRial: result.inquiriesRial },
        { label: 'هزینه نفرات اضافه (فروشنده/خریدار)', amountRial: result.extraPersonsRial },
        { label: 'هزینه اوراق اضافی', amountRial: result.extraPagesRial },
        { label: 'سامانه ثبت الکترونیک اسناد', amountRial: result.electronicRegRial },
      ],
      totalRial: result.totalRial,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#5E5240]/15 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#134252]">
              محاسبه هزینه اسناد غیرمنقول و پیش‌فروش ساختمان
            </h2>
            <p className="text-xs text-[#628C71] mt-0.5">
              تنظیم سند انتقال قطعی ملک، آپارتمان، زمین، صلح و پیش‌فروش ساختمان
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
            
            {/* Property Price Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#134252]">
                قیمت / ارزش معامله ملک ({currency === 'TOMAN' ? 'تومان' : 'ریال'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={propertyPriceInput ? Number(propertyPriceInput).toLocaleString('en-US') : ''}
                  onChange={(e) => setPropertyPriceInput(parseInputNumber(e.target.value).toString())}
                  placeholder="مثال: ۵٬۰۰۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FAF8F6] border border-[#5E5240]/20 rounded-xl px-4 py-3 text-base font-bold text-[#134252] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E] transition-all dir-ltr text-right"
                />
                <span className="absolute left-3 top-3.5 text-xs font-bold text-[#628C71]">
                  {currency === 'TOMAN' ? 'تومان' : 'ریال'}
                </span>
              </div>

              {/* Spellout text for large numbers */}
              {priceRial > 0 && (
                <p className="text-xs text-[#0F766E] font-medium bg-[#E0F2F1]/50 px-3 py-1.5 rounded-lg border border-[#0F766E]/10">
                  معادل: {spelloutCurrency(priceRial, currency)}
                </p>
              )}

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 py-1 pl-1">مقادیر پیشنهادی:</span>
                {[
                  { label: currency === 'TOMAN' ? '۱ میلیارد' : '۱۰ میلیارد', val: currency === 'TOMAN' ? 1_000_000_000 : 10_000_000_000 },
                  { label: currency === 'TOMAN' ? '۳ میلیارد' : '۳۰ میلیارد', val: currency === 'TOMAN' ? 3_000_000_000 : 30_000_000_000 },
                  { label: currency === 'TOMAN' ? '۵ میلیارد' : '۵۰ میلیارد', val: currency === 'TOMAN' ? 5_000_000_000 : 50_000_000_000 },
                  { label: currency === 'TOMAN' ? '۱۰ میلیارد' : '۱۰۰ میلیارد', val: currency === 'TOMAN' ? 10_000_000_000 : 100_000_000_000 },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setPresetPrice(preset.val)}
                    className="text-[11px] bg-slate-100 hover:bg-[#E0F2F1] text-slate-700 hover:text-[#0F766E] px-2.5 py-1 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sellers & Buyers Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              
              {/* Sellers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                  تعداد فروشندگان
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSellersCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-[#134252] bg-[#FAF8F6] py-2 rounded-xl border border-slate-200">
                    {sellersCount} نفر
                  </span>
                  <button
                    type="button"
                    onClick={() => setSellersCount((prev) => Math.min(10, prev + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buyers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                  تعداد خریداران
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyersCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-[#134252] bg-[#FAF8F6] py-2 rounded-xl border border-slate-200">
                    {buyersCount} نفر
                  </span>
                  <button
                    type="button"
                    onClick={() => setBuyersCount((prev) => Math.min(10, prev + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
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
                  <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                  تعداد اوراق اضافی سند
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
                  className="w-full accent-[#0F766E]"
                />
                <span className="w-16 text-center text-xs font-bold text-[#0F766E] bg-[#E0F2F1] py-1.5 px-2 rounded-lg shrink-0">
                  {extraPages} برگ
                </span>
              </div>
            </div>

            {/* Checkboxes for Inquiries */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-[#134252] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#0F766E]" />
                استعلام‌های قانونی مورد نیاز
              </label>

              <div className="space-y-2 bg-[#FAF8F6] p-3.5 rounded-xl border border-[#5E5240]/10">
                
                {/* Registration Inquiry */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryRegistration}
                      onChange={(e) => setInquiryRegistration(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E] border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252] group-hover:text-[#0F766E]">
                      استعلام ثبت اسناد و املاک
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(1_260_000, currency)}
                  </span>
                </label>

                {/* Tax Inquiry */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryTax}
                      onChange={(e) => setInquiryTax(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E] border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252] group-hover:text-[#0F766E]">
                      استعلام امور مالیاتی (دارایی)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(1_500_000, currency)}
                  </span>
                </label>

                {/* Municipality Inquiry */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inquiryMunicipality}
                      onChange={(e) => setInquiryMunicipality(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E] border-slate-300"
                    />
                    <span className="text-xs font-medium text-[#134252] group-hover:text-[#0F766E]">
                      استعلام شهرداری / مفاصاحساب
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E]">
                    {formatCurrency(600_000, currency)}
                  </span>
                </label>

              </div>
            </div>

          </div>
        </div>

        {/* Breakdown Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-4 sticky top-32">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#134252] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                ریز هزینه‌های قابل پرداخت
              </h3>
              <span className="text-[11px] text-[#628C71]">مجموع تفکیکی</span>
            </div>

            {/* Special Base Indicator */}
            {result.specialBaseRial > 0 && (
              <div className="bg-[#FAF8F6] p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-[#628C71]">پایه محاسبه ۹٪ ملک:</span>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.specialBaseRial, currency)}
                </span>
              </div>
            )}

            {/* Breakdown List Rows */}
            <div className="space-y-2 text-xs">
              
              {/* Haq-ol-Tahrir */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-[#0F766E] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌التحریر پلکانی</span>
                  <span className="text-[10px] text-[#628C71]">تعرفه رسمی دفترخانه</span>
                </div>
                <span className="font-bold text-[#0F766E] text-sm">
                  {formatCurrency(result.haqOlTahrirRial, currency)}
                </span>
              </div>

              {/* Haq-ol-Sabt */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-[#208C8D] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حقالثبت اسناد</span>
                  <span className="text-[10px] text-[#628C71]">۰٫۵٪ پایه محاسبه</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.haqOlSabtRial, currency)}
                </span>
              </div>

              {/* Cadastre */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-teal-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌الثبت کاداستر</span>
                  <span className="text-[10px] text-[#628C71]">۰٫۵٪ پایه محاسبه</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.cadastreRial, currency)}
                </span>
              </div>

              {/* VAT */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-cyan-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">مالیات بر ارزش افزوده (۱۰٪)</span>
                  <span className="text-[10px] text-[#628C71]">۱۰٪ پایه ۹٪</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.vatRial, currency)}
                </span>
              </div>

              {/* Inquiries */}
              {result.inquiriesRial > 0 && (
                <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-indigo-500 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#134252] block">هزینه استعلام‌ها</span>
                    <span className="text-[10px] text-[#628C71]">ثبت / دارایی / شهرداری</span>
                  </div>
                  <span className="font-bold text-[#134252]">
                    {formatCurrency(result.inquiriesRial, currency)}
                  </span>
                </div>
              )}

              {/* Extra Persons */}
              {result.extraPersonsRial > 0 && (
                <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-amber-500 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#134252] block">هزینه متعاملین اضافه</span>
                    <span className="text-[10px] text-[#628C71]">فروشنده / خریدار اضافی</span>
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

            {/* TOTAL Grand Card */}
            <motion.div
              layout
              className="bg-gradient-to-br from-[#0F766E] via-[#134252] to-[#0F766E] rounded-[1.75rem] p-5 text-white shadow-lg space-y-2 relative overflow-hidden border border-white/10"
            >
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-teal-100 font-semibold relative z-10">
                <span>مبلغ کل قابل پرداخت</span>
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[10px]">دفتر اسناد رسمی ۶۶۲</span>
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

            {/* Save & Print Action Bar */}
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
                className="w-full bg-[#0F766E] hover:bg-[#134252] text-white disabled:opacity-50 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                چاپ / صدور پیش‌فاکتور
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
