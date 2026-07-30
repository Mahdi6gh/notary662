import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Landmark, Users, FileText, Printer, BookmarkPlus, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { CurrencyUnit, FinancialInput } from '../types';
import { calculateFinancial } from '../utils/tierCalculator';
import { formatCurrency, parseInputNumber, spelloutCurrency, toRials } from '../utils/numberUtils';
import { AnimatedCounter } from './AnimatedCounter';

interface FinancialCalcProps {
  currency: CurrencyUnit;
  onSaveResult: (title: string, desc: string, totalRial: number, inputs: Record<string, unknown>) => void;
  onPrintResult: (data: {
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  }) => void;
}

export function FinancialCalc({ currency, onSaveResult, onPrintResult }: FinancialCalcProps) {
  const [documentAmountInput, setDocumentAmountInput] = useState<string>('2000000000'); // Default 2 billion
  const [totalParties, setTotalParties] = useState<number>(2);
  const [extraPages, setExtraPages] = useState<number>(0);

  const rawDocNumber = parseInputNumber(documentAmountInput);
  const docRial = toRials(rawDocNumber, currency);

  const calcInput: FinancialInput = useMemo(
    () => ({
      documentAmount: docRial,
      totalParties,
      extraPages,
    }),
    [docRial, totalParties, extraPages]
  );

  const result = useMemo(() => calculateFinancial(calcInput), [calcInput]);

  const setPresetAmount = (amountInCurrentUnit: number) => {
    setDocumentAmountInput(amountInCurrentUnit.toString());
  };

  const resetForm = () => {
    setDocumentAmountInput('');
    setTotalParties(2);
    setExtraPages(0);
  };

  const handleSave = () => {
    if (result.totalRial <= 0) return;
    onSaveResult(
      'سند مالی و رهنی',
      `سند وام/رهن به مبلغ ${formatCurrency(result.documentAmountRial, currency)} (${totalParties} متعامل)`,
      result.totalRial,
      { ...calcInput }
    );
  };

  const handlePrint = () => {
    onPrintResult({
      title: 'برآورد هزینه تنظیم اسناد مالی، رهنی و تسهیلات بانکی',
      details: [
        { key: 'مبلغ سند (اصل و سود)', value: formatCurrency(result.documentAmountRial, currency) },
        { key: 'تعداد متعاملین', value: `${totalParties} نفر (راهن، وام‌گیرنده، بانک)` },
        { key: 'تعداد اوراق اضافی', value: `${extraPages} برگ` },
      ],
      items: [
        { label: 'حق‌التحریر پایه دفترخانه', amountRial: result.baseHaqOlTahrirRial },
        { label: 'حق‌التحریر متعاملین اضافه (بیش از ۲ نفر)', amountRial: result.extraPartiesHaqOlTahrirRial },
        { label: 'حق‌التحریر اوراق اضافی', amountRial: result.extraPagesHaqOlTahrirRial },
        { label: 'حق‌الثبت اسناد رهنی (۱٪ مستقیم)', amountRial: result.haqOlSabtRial },
        { label: 'مالیات بر ارزش افزوده (۱۰٪ کل حق‌التحریر)', amountRial: result.vatRial },
        { label: 'سامانه ثبت الکترونیک اسناد', amountRial: result.electronicRegRial },
      ],
      totalRial: result.totalRial,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#5E5240]/15 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#134252]/10 text-[#134252] border border-[#134252]/20">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#134252]">
              محاسبه هزینه سایر اسناد مالی، رهنی و تسهیلات بانکی
            </h2>
            <p className="text-xs text-[#628C71] mt-0.5">
              اسناد رهن بانک، وثیقه، متمم تسهیلات، تعهد و اقرارنامه مالی
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
            
            {/* Document Amount Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#134252]">
                مبلغ سند / مجموع اصل و سود وام ({currency === 'TOMAN' ? 'تومان' : 'ریال'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={documentAmountInput ? Number(documentAmountInput).toLocaleString('en-US') : ''}
                  onChange={(e) => setDocumentAmountInput(parseInputNumber(e.target.value).toString())}
                  placeholder="مثال: ۲٬۰۰۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FAF8F6] border border-[#5E5240]/20 rounded-xl px-4 py-3 text-base font-bold text-[#134252] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E] transition-all dir-ltr text-right"
                />
                <span className="absolute left-3 top-3.5 text-xs font-bold text-[#628C71]">
                  {currency === 'TOMAN' ? 'تومان' : 'ریال'}
                </span>
              </div>

              {docRial > 0 && (
                <p className="text-xs text-[#0F766E] font-medium bg-[#E0F2F1]/50 px-3 py-1.5 rounded-lg border border-[#0F766E]/10">
                  معادل: {spelloutCurrency(docRial, currency)}
                </p>
              )}

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 py-1 pl-1">مقادیر وام رایج:</span>
                {[
                  { label: currency === 'TOMAN' ? '۵۰۰ میلیون' : '۵ میلیارد', val: currency === 'TOMAN' ? 500_000_000 : 5_000_000_000 },
                  { label: currency === 'TOMAN' ? '۱ میلیارد' : '۱۰ میلیارد', val: currency === 'TOMAN' ? 1_000_000_000 : 10_000_000_000 },
                  { label: currency === 'TOMAN' ? '۲ میلیارد' : '۲۰ میلیارد', val: currency === 'TOMAN' ? 2_000_000_000 : 20_000_000_000 },
                  { label: currency === 'TOMAN' ? '۵ میلیارد' : '۵۰ میلیارد', val: currency === 'TOMAN' ? 5_000_000_000 : 50_000_000_000 },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setPresetAmount(preset.val)}
                    className="text-[11px] bg-slate-100 hover:bg-[#E0F2F1] text-slate-700 hover:text-[#0F766E] px-2.5 py-1 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Parties */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-[#134252] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0F766E]" />
                  تعداد کل متعاملین (مجموع راهن + وام‌گیرنده + مرتهن/بانک)
                </span>
                <span className="text-[11px] font-normal text-slate-500">پایه: ۲ نفر</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTotalParties((prev) => Math.max(2, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-[#134252] bg-[#FAF8F6] py-2 rounded-xl border border-slate-200">
                  {totalParties} نفر
                </span>
                <button
                  type="button"
                  onClick={() => setTotalParties((prev) => Math.min(10, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#134252] font-bold text-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-[#628C71]">
                به ازای هر نفر اضافه بیش از ۲ نفر: مبلغ ۲۰,۰۰۰ تومان به حق‌التحریر افزوده می‌شود.
              </p>
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

          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-4 sticky top-32">
            
            {/* Mandatory Legal Payer Notice */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-start gap-2 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">تذکر مهم قانونی:</span>
                <p className="mt-0.5">
                  پرداخت کلیه هزینه‌های تنظیم سند رهنی بر عهده <strong className="underline decoration-amber-400">راهن (وام‌گیرنده)</strong> می‌باشد.
                </p>
              </div>
            </div>

            {/* List Rows */}
            <div className="space-y-2 text-xs">
              
              {/* Haq-ol-Sabt 1% */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-[#0F766E] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">حق‌الثبت اسناد مالی (۱٪)</span>
                  <span className="text-[10px] text-[#628C71]">۱٪ مستقیم مبلغ سند</span>
                </div>
                <span className="font-bold text-[#0F766E] text-sm">
                  {formatCurrency(result.haqOlSabtRial, currency)}
                </span>
              </div>

              {/* Total Haq-ol-Tahrir */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-[#208C8D] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">مجموع حق‌التحریر</span>
                  <span className="text-[10px] text-[#628C71]">پایه + نفرات اضافه + اوراق</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.totalHaqOlTahrirRial, currency)}
                </span>
              </div>

              {/* Sub-breakdown of Haq-ol-Tahrir if extras present */}
              {(result.extraPartiesHaqOlTahrirRial > 0 || result.extraPagesHaqOlTahrirRial > 0) && (
                <div className="bg-[#E0F2F1]/30 p-2.5 rounded-xl space-y-1 text-[11px] border border-[#0F766E]/10">
                  <div className="flex justify-between text-slate-600">
                    <span>• حق‌التحریر پایه:</span>
                    <span>{formatCurrency(result.baseHaqOlTahrirRial, currency)}</span>
                  </div>
                  {result.extraPartiesHaqOlTahrirRial > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>• نفرات اضافه ({totalParties - 2} نفر):</span>
                      <span>{formatCurrency(result.extraPartiesHaqOlTahrirRial, currency)}</span>
                    </div>
                  )}
                  {result.extraPagesHaqOlTahrirRial > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>• اوراق اضافه ({extraPages} برگ):</span>
                      <span>{formatCurrency(result.extraPagesHaqOlTahrirRial, currency)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* VAT */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-cyan-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">مالیات بر ارزش افزوده (۱۰٪)</span>
                  <span className="text-[10px] text-[#628C71]">۱۰٪ کل حق‌التحریر</span>
                </div>
                <span className="font-bold text-[#134252]">
                  {formatCurrency(result.vatRial, currency)}
                </span>
              </div>

              {/* Electronic Reg */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-slate-400 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#134252] block">صدور سند الکترونیک</span>
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
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-teal-100 font-semibold relative z-10">
                <span>جمع کل هزینه‌ها (بر عهده راهن)</span>
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
                className="w-full bg-[#134252] hover:bg-[#0F766E] text-white disabled:opacity-50 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
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
