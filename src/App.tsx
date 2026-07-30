import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { RealEstateCalc } from './components/RealEstateCalc';
import { FinancialCalc } from './components/FinancialCalc';
import { RentCalc } from './components/RentCalc';
import { InheritanceCalc } from './components/InheritanceCalc';
import { OfficeInfoModal } from './components/OfficeInfoModal';
import { SavedCalcModal } from './components/SavedCalcModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { PwaExportModal } from './components/PwaExportModal';
import { CalculatorTab, CurrencyUnit, SavedCalculation } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTab | 'dashboard'>('dashboard');
  const [currency, setCurrency] = useState<CurrencyUnit>('TOMAN'); // Default Toman for Iranian users

  // Modals state
  const [isOfficeInfoOpen, setIsOfficeInfoOpen] = useState<boolean>(false);
  const [isSavedHistoryOpen, setIsSavedHistoryOpen] = useState<boolean>(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState<boolean>(false);
  const [isPwaExportOpen, setIsPwaExportOpen] = useState<boolean>(false);

  // Print modal state
  const [printData, setPrintData] = useState<{
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  } | null>(null);

  // Saved calculations state (persisted in localStorage)
  const [savedList, setSavedList] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem('notary_saved_calcs_662');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notary_saved_calcs_662', JSON.stringify(savedList));
    } catch (e) {
      // Ignore quota errors
    }
  }, [savedList]);

  const handleSaveResult = (
    title: string,
    description: string,
    totalRial: number,
    inputs: Record<string, unknown>
  ) => {
    const newItem: SavedCalculation = {
      id: Date.now().toString(),
      dateStr: new Date().toLocaleDateString('fa-IR'),
      timestamp: Date.now(),
      tab: activeTab === 'dashboard' ? 'real_estate' : activeTab,
      title,
      description,
      totalRial,
      inputs,
    };

    setSavedList((prev) => [newItem, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('آیا از پاک‌سازی تمام سوابق ذخیره‌شده اطمینان دارید؟')) {
      setSavedList([]);
    }
  };

  const handlePrintSavedItem = (item: SavedCalculation) => {
    setPrintData({
      title: item.title,
      details: [
        { key: 'شرح معامله', value: item.description },
        { key: 'تاریخ ثبت', value: item.dateStr },
      ],
      items: [
        { label: item.description, amountRial: item.totalRial },
      ],
      totalRial: item.totalRial,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF8F6] to-[#F5F0E6] text-[#002279] pb-20 md:pb-8">
      
      {/* Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenOfficeInfo={() => setIsOfficeInfoOpen(true)}
        onOpenSavedHistory={() => setIsSavedHistoryOpen(true)}
        savedCount={savedList.length}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard
                onSelectTab={setActiveTab}
                onOpenOfficeInfo={() => setIsOfficeInfoOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'real_estate' && (
            <motion.div
              key="real_estate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RealEstateCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <FinancialCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'rent' && (
            <motion.div
              key="rent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RentCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'inheritance' && (
            <motion.div
              key="inheritance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <InheritanceCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#D3B574]/30 bg-white/50 backdrop-blur-md text-center text-xs text-[#002279]/80 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-right">
            <div>
              <span>کلیه حقوق این سامانه متعلق به </span>
              <strong className="text-[#002279] font-black">دفتر اسناد رسمی ۶۶۲ تهران (سردفتر: خانم لیلا فرجزاده)</strong>
              <span> است.</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              تهران، چهارراه جهان کودک، بلوار حقانی، نرسیده به گاندی شمالی، پلاک ۶۷ | تلفن: ۰۲۱۸۸۱۹۵۲۱۷ - ۰۹۱۹۶۶۲۵۶۶۲
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold">
            <a
              href="https://www.notary662th.ir/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-[#002279] hover:text-[#D3B574] flex items-center gap-1"
            >
              <span>وب‌سایت رسمی (notary662th.ir)</span>
            </a>
            <span className="text-[#D3B574]">•</span>
            <button
              type="button"
              onClick={() => setIsPwaExportOpen(true)}
              className="hover:underline text-[#002279] font-extrabold hover:text-[#A88640]"
            >
              دانلود نسخه اپلیکیشن (PWA / ویندوز / اندروید)
            </button>
            <span className="text-[#D3B574]">•</span>
            <button
              type="button"
              onClick={() => setIsOfficeInfoOpen(true)}
              className="hover:underline text-[#002279] hover:text-[#001755]"
            >
              اطلاعات دفترخانه
            </button>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
      <OfficeInfoModal
        isOpen={isOfficeInfoOpen}
        onClose={() => setIsOfficeInfoOpen(false)}
      />

      <SavedCalcModal
        isOpen={isSavedHistoryOpen}
        onClose={() => setIsSavedHistoryOpen(false)}
        savedList={savedList}
        onDeleteSaved={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
        currency={currency}
        onPrintSavedItem={handlePrintSavedItem}
      />

      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
        currency={currency}
      />

      <PwaExportModal
        isOpen={isPwaExportOpen}
        onClose={() => setIsPwaExportOpen(false)}
      />

      <ReceiptPrintModal
        isOpen={printData !== null}
        onClose={() => setPrintData(null)}
        data={printData}
        currency={currency}
      />

    </div>
  );
}
