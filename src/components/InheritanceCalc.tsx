import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, AlertTriangle, Printer, BookmarkPlus, Sparkles, Scale, Info, Check, RefreshCw, Layers } from 'lucide-react';
import { CurrencyUnit, HeirSelection } from '../types';
import { calculateInheritance } from '../utils/tierCalculator';
import { formatCurrency, parseInputNumber, spelloutCurrency, toRials } from '../utils/numberUtils';

interface InheritanceCalcProps {
  currency: CurrencyUnit;
  onSaveResult: (title: string, desc: string, totalRial: number, inputs: Record<string, unknown>) => void;
  onPrintResult: (data: {
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  }) => void;
}

export function InheritanceCalc({ currency, onSaveResult, onPrintResult }: InheritanceCalcProps) {
  const [estateValueInput, setEstateValueInput] = useState<string>('10000000000'); // Default 10 billion
  const [isNewLaw, setIsNewLaw] = useState<boolean>(true); // 1389+ vs old law

  // Heirs selections
  const [hasSons, setHasSons] = useState<boolean>(true);
  const [sonsCount, setSonsCount] = useState<number>(2);

  const [hasDaughters, setHasDaughters] = useState<boolean>(true);
  const [daughtersCount, setDaughtersCount] = useState<number>(1);

  const [hasHusband, setHasHusband] = useState<boolean>(false);

  const [hasWives, setHasWives] = useState<boolean>(true);
  const [wivesCount, setWivesCount] = useState<number>(1);

  const [hasFather, setHasFather] = useState<boolean>(true);
  const [hasMother, setHasMother] = useState<boolean>(true);

  const rawEstate = parseInputNumber(estateValueInput);
  const estateRial = toRials(rawEstate, currency);

  const heirInput: HeirSelection = useMemo(
    () => ({
      sonsCount: hasSons ? sonsCount : 0,
      daughtersCount: hasDaughters ? daughtersCount : 0,
      hasHusband,
      wivesCount: hasWives ? wivesCount : 0,
      hasFather,
      hasMother,
      isNewLaw,
    }),
    [hasSons, sonsCount, hasDaughters, daughtersCount, hasHusband, hasWives, wivesCount, hasFather, hasMother, isNewLaw]
  );

  const result = useMemo(() => calculateInheritance(estateRial, heirInput), [estateRial, heirInput]);

  const resetHeirs = () => {
    setEstateValueInput('');
    setHasSons(false);
    setSonsCount(1);
    setHasDaughters(false);
    setDaughtersCount(1);
    setHasHusband(false);
    setHasWives(false);
    setWivesCount(1);
    setHasFather(false);
    setHasMother(false);
  };

  const handleSave = () => {
    if (result.estateValueRial <= 0 || result.heirs.length === 0) return;
    onSaveResult(
      'محاسبه سهم‌الارث',
      `ترکه به ارزش ${formatCurrency(result.estateValueRial, currency)} بین ${result.heirs.length} ردیف ورّاث`,
      result.estateValueRial,
      { ...heirInput }
    );
  };

  const handlePrint = () => {
    onPrintResult({
      title: 'گواهی برآورد قانونی سهم‌الارث (مطابق قانون مدنی ج.ا.ایران)',
      details: [
        { key: 'ارزش کل ترکه', value: formatCurrency(result.estateValueRial, currency) },
        { key: 'مبنای قانونی', value: isNewLaw ? 'قانون جدید اصلاح ارث زوجه (اصلاحیه ۱۳۸۹ به بعد)' : 'قانون قدیم ارث' },
        { key: 'تعداد ورّاث ذینفع', value: `${result.heirs.length} ردیف وارث` },
      ],
      items: result.heirs.map((h) => ({
        label: `${h.title} — ${h.fractionText}`,
        amountRial: h.movableAmountRial,
        note: h.note,
      })),
      totalRial: result.estateValueRial,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#5E5240]/15 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-700/10 text-indigo-700 border border-indigo-700/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#134252]">
              محاسبه‌گر قانونی سهم‌الارث (انحصار وراثت)
            </h2>
            <p className="text-xs text-[#628C71] mt-0.5">
              محاسبه سهم قانونی طبقات اول ارث (والدین، همسر و فرزندان) بر اساس قانون مدنی
            </p>
          </div>
        </div>

        {/* New Law vs Old Law Switcher */}
        <div className="flex items-center gap-2 bg-[#FAF8F6] p-1.5 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewLaw(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isNewLaw ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            قانون جدید (۱۳۸۹ به بعد)
          </button>
          <button
            type="button"
            onClick={() => setIsNewLaw(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isNewLaw ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            قانون قدیم
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Heirs Selection Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#134252] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-700" />
                ورود اطلاعات اموال و ورّاث
              </h3>
              <button
                type="button"
                onClick={resetHeirs}
                className="text-xs text-[#628C71] hover:text-[#0F766E] flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                بازنشانی
              </button>
            </div>

            {/* Estate Value Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#134252]">
                ارزش کل ترکه / اموال متوفی ({currency === 'TOMAN' ? 'تومان' : 'ریال'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={estateValueInput ? Number(estateValueInput).toLocaleString('en-US') : ''}
                  onChange={(e) => setEstateValueInput(parseInputNumber(e.target.value).toString())}
                  placeholder="مثال: ۱۰٬۰۰۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FAF8F6] border border-[#5E5240]/20 rounded-xl px-4 py-3 text-sm font-bold text-[#134252] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 transition-all dir-ltr text-right"
                />
                <span className="absolute left-3 top-3 text-xs font-bold text-[#628C71]">
                  {currency === 'TOMAN' ? 'تومان' : 'ریال'}
                </span>
              </div>
              {estateRial > 0 && (
                <p className="text-xs text-indigo-700 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  {spelloutCurrency(estateRial, currency)}
                </p>
              )}
            </div>

            {/* Heirs Checkboxes List */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-[#134252] block">
                انتخاب وراث حاضر متوفی:
              </label>

              {/* 1. Sons */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasSons}
                      onChange={(e) => setHasSons(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">پسر / فرزندان پسر</span>
                  </div>
                  {hasSons && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                      {sonsCount} نفر
                    </span>
                  )}
                </label>

                {hasSons && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 pt-1 border-t border-slate-200/60"
                  >
                    <span className="text-[11px] text-slate-500">تعداد پسران:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSonsCount((p) => Math.max(1, p - 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#134252]">
                        {sonsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSonsCount((p) => Math.min(20, p + 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 2. Daughters */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasDaughters}
                      onChange={(e) => setHasDaughters(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">دختر / فرزندان دختر</span>
                  </div>
                  {hasDaughters && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                      {daughtersCount} نفر
                    </span>
                  )}
                </label>

                {hasDaughters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 pt-1 border-t border-slate-200/60"
                  >
                    <span className="text-[11px] text-slate-500">تعداد دختران:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDaughtersCount((p) => Math.max(1, p - 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#134252]">
                        {daughtersCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDaughtersCount((p) => Math.min(20, p + 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 3. Husband */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasHusband}
                      onChange={(e) => {
                        setHasHusband(e.target.checked);
                        if (e.target.checked) setHasWives(false);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">زوج (شوهر متوفیه)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">حداکثر ۱ نفر</span>
                </label>
              </div>

              {/* 4. Wives */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasWives}
                      onChange={(e) => {
                        setHasWives(e.target.checked);
                        if (e.target.checked) setHasHusband(false);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">زوجه (همسر dائم متوفی)</span>
                  </div>
                  {hasWives && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {wivesCount} نفر
                    </span>
                  )}
                </label>

                {hasWives && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 pt-1 border-t border-slate-200/60"
                  >
                    <span className="text-[11px] text-slate-500">تعداد همسران:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setWivesCount((p) => Math.max(1, p - 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#134252]">
                        {wivesCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setWivesCount((p) => Math.min(4, p + 1))}
                        className="w-7 h-7 bg-white rounded-lg border font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 5. Father */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasFather}
                      onChange={(e) => setHasFather(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">پدر متوفی</span>
                  </div>
                  <span className="text-[11px] text-slate-500">طبقه اول</span>
                </label>
              </div>

              {/* 6. Mother */}
              <div className="bg-[#FAF8F6] p-3 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasMother}
                      onChange={(e) => setHasMother(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-[#134252]">مادر متوفی</span>
                  </div>
                  <span className="text-[11px] text-slate-500">طبقه اول</span>
                </label>
              </div>

            </div>

          </div>
        </div>

        {/* Right 2-Column Results Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#5E5240]/15 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#134252] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  جدول تفکیکی سهم قانونی ورّاث
                </h3>
                <p className="text-[11px] text-[#628C71]">تفکیک اموال منقول و غیرمنقول</p>
              </div>

              {result.estateValueRial > 0 && (
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  ترکه: {formatCurrency(result.estateValueRial, currency)}
                </span>
              )}
            </div>

            {/* Empty State */}
            {result.heirs.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-[#FAF8F6] rounded-2xl border border-dashed border-slate-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#134252]">هیچ وارثی انتخاب نشده است</h4>
                  <p className="text-xs text-[#628C71] mt-1">
                    لطفاً از پنل سمت راست، حداقل یک وارث (پسر، دختر، همسر یا والدین) را تیک بزنید.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* 2 COLUMNS LAYOUT: Movable vs Immovable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Column 1: Movable Property (اموال منقول) */}
                  <div className="space-y-3">
                    <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-200 text-teal-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-700 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold">۱. اموال منقول</h4>
                        <p className="text-[10px] text-teal-700">نقدینگی، طلا، خودرو، سهام، سپرده</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {result.heirs.map((heir) => (
                        <div
                          key={`movable-${heir.id}`}
                          className="bg-[#FAF8F6] p-3 rounded-xl border-r-4 border-r-[#0F766E] border border-slate-200/60 space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-bold text-[#134252]">
                            <span>{heir.title}</span>
                            <span className="text-xs bg-[#E0F2F1] text-[#0F766E] px-2 py-0.5 rounded-md font-mono dir-ltr">
                              {heir.fractionText}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#0F766E] font-bold text-sm pt-1">
                            <span>سهم منقول:</span>
                            <span>{formatCurrency(heir.movableAmountRial, currency)}</span>
                          </div>

                          {heir.note && (
                            <p className="text-[10px] text-slate-500 pt-0.5">{heir.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Immovable Property (اموال غیرمنقول) */}
                  <div className="space-y-3">
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold">۲. اموال غیرمنقول</h4>
                        <p className="text-[10px] text-amber-800">زمین، خانه، آپارتمان، ملک تجاری</p>
                      </div>
                    </div>

                    {/* MANDATORY WARNING BOX FOR WIFE IMMOVABLE SHARE (per prompt spec) */}
                    {result.hasWifeWarning && (
                      <div className="bg-blue-50/90 border-2 border-blue-300 rounded-xl p-3 text-blue-900 text-[11px] leading-relaxed flex items-start gap-2 shadow-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-amber-900 font-bold">⚠️ نکته مهم حقوقی در اموال غیرمنقول:</strong>
                          <span>
                            زوجه از عین اموال غیرمنقول (زمین و ملیکت ملک) ارث نمی‌برد، بلکه به میزان سهم قانونی خود از <strong>بهای آن (قیمت کارشناسی ملک)</strong> طلبکار است.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-xs">
                      {result.heirs.map((heir) => (
                        <div
                          key={`immovable-${heir.id}`}
                          className={`p-3 rounded-xl border-r-4 shadow-2xs space-y-1 ${
                            heir.isWifeSpecial
                              ? 'bg-amber-50/90 border-r-amber-500 border border-amber-300'
                              : 'bg-[#FAF8F6] border-r-indigo-600 border border-slate-200/60'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[#134252]">
                            <span className="flex items-center gap-1.5">
                              {heir.title}
                              {heir.isWifeSpecial && (
                                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.2 rounded-full font-bold">
                                  زوجه (طلب از بهای ملک)
                                </span>
                              )}
                            </span>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-mono dir-ltr">
                              {heir.fractionText}
                            </span>
                          </div>

                          <div className="flex items-center justify-between font-bold text-sm pt-1 text-indigo-900">
                            <span>ارزش سهم:</span>
                            <span>{formatCurrency(heir.immovableAmountRial, currency)}</span>
                          </div>

                          {heir.isWifeSpecial ? (
                            <p className="text-[10px] text-amber-900 font-medium pt-0.5">
                              پرداخت نقدی بهای ملک توسط سایر وراث به زوجه الزامی است.
                            </p>
                          ) : (
                            heir.note && <p className="text-[10px] text-slate-500 pt-0.5">{heir.note}</p>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#5E5240]/10">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={result.estateValueRial <= 0}
                    className="w-full bg-[#E0F2F1] hover:bg-[#0F766E] text-[#0F766E] hover:text-white disabled:opacity-50 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#0F766E]/20"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    ذخیره محاسبات ارث
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={result.estateValueRial <= 0}
                    className="w-full bg-[#0F766E] hover:bg-[#134252] text-white disabled:opacity-50 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    چاپ / گواهی تقسیم ترکه
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
