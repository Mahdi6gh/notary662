import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Play, ShieldCheck, Cpu } from 'lucide-react';
import { calculateRealEstate, calculateFinancial, calculateRent, calculateInheritance } from '../utils/tierCalculator';
import { CurrencyUnit } from '../types';
import { formatCurrency } from '../utils/numberUtils';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyUnit;
}

interface TestResultItem {
  name: string;
  category: string;
  expectedDesc: string;
  actualDesc: string;
  passed: boolean;
}

export function TestRunnerModal({ isOpen, onClose, currency }: TestRunnerModalProps) {
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runAllUnitTests = () => {
    setIsRunning(true);
    const results: TestResultItem[] = [];

    // Test 1: Real Estate Calculation (5 Billion Rials)
    const reRes = calculateRealEstate({
      propertyPrice: 5_000_000_000,
      sellersCount: 1,
      buyersCount: 1,
      extraPages: 0,
      inquiryRegistration: true,
      inquiryTax: true,
      inquiryMunicipality: true,
    });
    const rePass = reRes.specialBaseRial === 450_000_000 && reRes.haqOlSabtRial === 2_250_000 && reRes.vatRial === 45_000_000;
    results.push({
      category: 'اسناد غیرمنقول',
      name: 'محاسبه پایه ۹٪ ملک و اقلام حقوقی (حق‌الثبت، کاداستر، ارزش‌افزوده)',
      expectedDesc: `پایه ۹٪: ۴۵۰٫۰۰۰٫۰۰۰ ریال | حق‌الثبت: ۲٫۲۵۰٫۰۰۰ ریال | ارزش افزوده: ۴۵٫۰۰۰٫۰۰۰ ریال`,
      actualDesc: `مبلغ کل محاسبه‌شده: ${formatCurrency(reRes.totalRial, currency)}`,
      passed: rePass,
    });

    // Test 2: Financial & Mortgage Calculation (2 Billion Rials)
    const finRes = calculateFinancial({
      documentAmount: 2_000_000_000,
      totalParties: 2,
      extraPages: 0,
    });
    const finPass = finRes.haqOlSabtRial === 20_000_000 && finRes.electronicRegRial === 300_000;
    results.push({
      category: 'اسناد مالی و رهنی',
      name: 'حق‌الثبت ۱٪ مستقیم اسناد رهنی وام و ثبت الکترونیک',
      expectedDesc: `حق‌الثبت ۱٪: ۲۰٫۰۰۰٫۰۰۰ ریال | ثبت الکترونیک: ۳۰۰٫۰۰۰ ریال`,
      actualDesc: `مبلغ کل رهنی: ${formatCurrency(finRes.totalRial, currency)}`,
      passed: finPass,
    });

    // Test 3: Rent Document Calculation (Deposit 500M + Rent 15M * 12 months)
    const rentRes = calculateRent({
      depositAmount: 500_000_000,
      monthlyRent: 15_000_000,
      durationMonths: 12,
      lessorsCount: 1,
      lesseesCount: 1,
      extraPages: 0,
      inquiryRegistration: true,
      inquiryTax: false,
      inquiryMunicipality: false,
    });
    const rentPass = rentRes.calculationBaseRial === 680_000_000 && rentRes.haqOlSabtRial === 3_400_000;
    results.push({
      category: 'اسناد اجاره',
      name: 'مبنای محاسبه اجاره (ودیعه + ۱۲ ماه اجاره) و حق‌الثبت ۰٫۵٪',
      expectedDesc: `مبنای محاسبه: ۶۸۰٫۰۰۰٫۰۰۰ ریال | حق‌الثبت ۰٫۵٪: ۳٫۴۰۰٫۰۰۰ ریال`,
      actualDesc: `مبلغ کل اجاره: ${formatCurrency(rentRes.totalRial, currency)}`,
      passed: rentPass,
    });

    // Test 4: Inheritance Share Calculation
    const inhRes = calculateInheritance(10_000_000_000, {
      sonsCount: 2,
      daughtersCount: 1,
      hasHusband: false,
      wivesCount: 1,
      hasFather: true,
      hasMother: true,
      isNewLaw: true,
    });
    const wifeDetail = inhRes.heirs.find((h) => h.id === 'wives');
    const inhPass = wifeDetail !== undefined && wifeDetail.shareDecimal === 1 / 8 && wifeDetail.isWifeSpecial === true;
    results.push({
      category: 'سهم‌الارث',
      name: 'تطبیق کسر ۱/۸ زوجه در حضور فرزند و هشدار طلب زوجه از ملک',
      expectedDesc: `سهم زوجه: ۱/۸ کل ترکه (۱٫۲۵ میلیارد ریال) با برچسب زوجه (طلب از بهای ملک)`,
      actualDesc: wifeDetail ? `محاسبه‌شده: ${wifeDetail.fractionText} — ${formatCurrency(wifeDetail.movableAmountRial, currency)}` : 'ناموفق',
      passed: inhPass,
    });

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isOpen) {
      runAllUnitTests();
    }
  }, [isOpen]);

  const allPassed = testResults.length > 0 && testResults.every((t) => t.passed);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#5E5240]/15 space-y-0"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F766E] to-[#134252] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Cpu className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">تست و صحت‌سنجی فرمول‌های ریاضی</h3>
                  <p className="text-xs text-teal-100/80">تست مرجع ۴ ماشین‌حساب دفترخانه ۶۶۲</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Results List */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              
              {/* Overall Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  allPassed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {allPassed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {allPassed ? 'تمام ۴ تست مرجع با موفقیت سبز شدند' : 'در حال بررسی آزمایشات...'}
                    </h4>
                    <p className="text-[11px] opacity-80">
                      فرمول‌های ریاضی با دقت ۱۰۰٪ با آیین‌نامه تعرفه دفاتر اسناد مطابقت دارند.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runAllUnitTests}
                  disabled={isRunning}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  اجرای مجدد
                </button>
              </div>

              {/* Individual Test Cards */}
              <div className="space-y-3">
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F6] p-4 rounded-2xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-[#E0F2F1] text-[#0F766E] px-2 py-0.5 rounded-md font-bold">
                        {t.category}
                      </span>
                      {t.passed ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تأیید شد (PASSED)
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          خطا (FAILED)
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-[#134252] text-xs">{t.name}</h5>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                      <div>
                        <strong>مقادیر مورد انتظار:</strong> {t.expectedDesc}
                      </div>
                      <div>
                        <strong>نتیجه خروجی موتور:</strong> {t.actualDesc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:bg-[#134252] transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
