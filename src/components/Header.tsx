import { Info, History, Coins } from 'lucide-react';
import { CurrencyUnit } from '../types';
import { NotaryLogo } from './NotaryLogo';

interface HeaderProps {
  currency: CurrencyUnit;
  onCurrencyChange: (newUnit: CurrencyUnit) => void;
  onOpenOfficeInfo: () => void;
  onOpenSavedHistory: () => void;
  savedCount: number;
}

export function Header({
  currency,
  onCurrencyChange,
  onOpenOfficeInfo,
  onOpenSavedHistory,
  savedCount,
}: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-[#D3B574]/30 sticky top-0 z-30 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Office Title */}
          <div className="flex items-center gap-3">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={onOpenOfficeInfo}
              title="مشاهده اطلاعات رسمی دفترخانه ۶۶۲ (لیلا فرجزاده)"
            >
              <NotaryLogo size="md" />
              <span className="absolute -bottom-0.5 -left-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D3B574] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D3B574] border border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-[#002279] tracking-tight flex items-center gap-1.5">
                  <span>دفتر اسناد رسمی ۶۶۲ تهران</span>
                </h1>
                <span className="bg-[#F5F0E6] text-[#A88640] text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-[#D3B574]/40 shadow-2xs">
                  سردفتر: خانم لیلا فرجزاده
                </span>
              </div>
              <p className="text-xs text-[#002279]/70 font-medium mt-0.5">
                سامانه آنلاین محاسبه تعرفه اسناد رسمی و سهم‌الارث متوفی (notary662th.ir)
              </p>
            </div>
          </div>

          {/* Right Action Tools: Currency Switcher & Top Modals */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#D3B574]/20">
            
            {/* Currency Switcher */}
            <div className="bg-[#F5F0E6]/90 backdrop-blur-md p-1 rounded-full border border-[#D3B574]/40 flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => onCurrencyChange('RIAL')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1 ${
                  currency === 'RIAL'
                    ? 'bg-gradient-to-r from-[#001755] to-[#002279] text-white shadow-xs border border-white/20'
                    : 'text-[#002279]/80 hover:text-[#002279]'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-[#D3B574]" />
                ریال
              </button>
              <button
                type="button"
                onClick={() => onCurrencyChange('TOMAN')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1 ${
                  currency === 'TOMAN'
                    ? 'bg-gradient-to-r from-[#001755] to-[#002279] text-white shadow-xs border border-white/20'
                    : 'text-[#002279]/80 hover:text-[#002279]'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-[#D3B574]" />
                تومان
              </button>
            </div>

            {/* Top Modal Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenSavedHistory}
                title="سوابق محاسبات ذخیره شده"
                className="p-2 text-[#002279] hover:bg-[#F5F0E6] rounded-2xl transition-all relative text-xs font-semibold flex items-center gap-1.5 border border-[#D3B574]/30 shadow-2xs"
              >
                <History className="w-4 h-4 text-[#002279]" />
                <span className="hidden sm:inline">سوابق</span>
                {savedCount > 0 && (
                  <span className="bg-gradient-to-r from-[#D3B574] to-[#A88640] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-2xs">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenOfficeInfo}
                className="p-2 text-[#002279] bg-[#F5F0E6] hover:bg-gradient-to-r hover:from-[#001755] hover:to-[#002279] hover:text-white rounded-2xl transition-all duration-200 text-xs font-bold flex items-center gap-1.5 border border-[#D3B574]/40 shadow-2xs group"
              >
                <Info className="w-4 h-4 text-[#D3B574] group-hover:text-[#D3B574]" />
                <span>دفترخانه ۶۶۲</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

