import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Share2, CheckCircle } from 'lucide-react';
import { CurrencyUnit } from '../types';
import { formatCurrency, spelloutCurrency } from '../utils/numberUtils';
import { NotaryLogo } from './NotaryLogo';
import confetti from 'canvas-confetti';

interface PrintableData {
  title: string;
  items: Array<{ label: string; amountRial: number; note?: string }>;
  totalRial: number;
  details: Array<{ key: string; value: string }>;
}

interface ReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrintableData | null;
  currency: CurrencyUnit;
}

export function ReceiptPrintModal({ isOpen, onClose, data, currency }: ReceiptPrintModalProps) {
  if (!data) return null;

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // Ignore confetti errors
    }
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `پیش‌فاکتور دفتر اسناد رسمی ۶۶۲ تهران — ${data.title}`,
        text: `برآورد هزینه: ${formatCurrency(data.totalRial, currency)}\nدفتر اسناد رسمی ۶۶۲ تهران (سردفتر: خانم لیلا فرجزاده)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `پیش‌فاکتور ${data.title}\nمبلغ کل: ${formatCurrency(data.totalRial, currency)}\nدفتر اسناد رسمی ۶۶۲ تهران (سردفتر: خانم لیلا فرجزاده)`
      );
      alert('متن پیش‌فاکتور در حافظه کپی شد.');
    }
  };

  const currentDateStr = new Date().toLocaleDateString('fa-IR');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D3B574]/40 my-8 space-y-0"
          >
            {/* Action Bar (hidden during browser print) */}
            <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] p-4 text-white flex items-center justify-between no-print border-b border-[#D3B574]/40">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#D3B574]" />
                <span className="font-bold text-sm">پیش‌نمایش رسمی برگ برآورد هزینه</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-white/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  اشتراک‌گذاری
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-[#D3B574] hover:bg-[#A88640] text-[#001755] text-xs font-black rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  چاپ سند
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Letterhead & Body (This prints clean!) */}
            <div className="p-6 sm:p-8 space-y-6 text-[#002279] print-card">
              
              {/* Header Letterhead */}
              <div className="border-b-2 border-[#D3B574] pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <NotaryLogo size="lg" />
                  <div>
                    <h2 className="text-xl font-black text-[#002279] flex items-center gap-2">
                      <span>دفتر اسناد رسمی ۶۶۲ تهران</span>
                      <span className="text-[10px] bg-[#F5F0E6] text-[#A88640] border border-[#D3B574]/50 px-2 py-0.5 rounded-full font-bold">سردفتر: خانم لیلا فرجزاده</span>
                    </h2>
                    <p className="text-xs text-[#002279]/80 font-bold mt-0.5">
                      سازمان ثبت اسناد و املاک کشور — حوزه ثبتی تهران | بیش از ۲۵ سال تجربه ثبتی
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      نشانی: تهران، چهارراه جهان کودک، بلوار حقانی، نرسیده به گاندی شمالی، پلاک ۶۷ | وب‌سایت: www.notary662th.ir
                    </p>
                  </div>
                </div>

                <div className="text-left text-xs text-slate-600 space-y-1 dir-ltr shrink-0">
                  <div><strong>تاریخ:</strong> {currentDateStr}</div>
                  <div><strong>شماره برآورد:</strong> ۶۶۲-{Math.floor(100000 + Math.random() * 900000)}</div>
                </div>
              </div>

              {/* Title & Document Info */}
              <div className="space-y-3">
                <div className="text-center bg-[#F5F0E6] p-3 rounded-xl border border-[#D3B574]/40">
                  <h3 className="text-base font-bold text-[#002279]">{data.title}</h3>
                  <p className="text-xs text-[#002279]/70 mt-0.5">برآورد غیررسمی پیش از تنظیم سند در دفترخانه</p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#002279]/5 p-3 rounded-xl border border-[#002279]/15">
                  {data.details.map((d, idx) => (
                    <div key={idx} className="flex justify-between p-1">
                      <span className="text-slate-600 font-medium">• {d.key}:</span>
                      <span className="font-bold text-[#002279]">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#002279] border-b border-[#D3B574]/40 pb-1">جزئیات تعرفه‌ها و هزینه‌ها:</h4>
                
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F5F0E6] text-[#002279] border-b border-[#D3B574]/40">
                      <th className="py-2 px-3 font-bold">شرح هزینه</th>
                      <th className="py-2 px-3 font-bold text-left">مبلغ ({currency === 'TOMAN' ? 'تومان' : 'ریال'})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-[#002279]">{item.label}</span>
                          {item.note && <span className="block text-[10px] text-slate-500">{item.note}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-left font-bold text-[#002279]">
                          {formatCurrency(item.amountRial, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Card */}
              <div className="bg-gradient-to-r from-[#001755] to-[#002279] text-white p-4 rounded-2xl flex items-center justify-between shadow-xs border border-[#D3B574]/40">
                <div>
                  <span className="text-xs text-[#E7D09E] font-medium block">مجموع کل برآورد هزینه:</span>
                  <span className="text-xs text-blue-100/90 font-semibold">{spelloutCurrency(data.totalRial, currency)}</span>
                </div>
                <div className="text-xl font-black text-[#D3B574]">
                  {formatCurrency(data.totalRial, currency)}
                </div>
              </div>

              {/* Signature stamp section */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-[#002279] font-bold">
                    <CheckCircle className="w-4 h-4 text-[#D3B574]" />
                    محاسبه شده مطابق بخشنامه رسمی تعرفه حق‌التحریر ابلاغی سازمان ثبت
                  </span>
                  <p className="text-[10px] text-slate-600 font-medium">
                    دفتر اسناد رسمی ۶۶۲ تهران | تلفن: ۰۲۱۸۸۱۹۵۲۱۷ - ۰۹۱۹۶۶۲۵۶۶۲ | تارنما: www.notary662th.ir
                  </p>
                </div>

                <div className="text-center space-y-4 pl-4 flex flex-col items-center">
                  <span className="font-black text-[#002279] block text-[11px]">مهر و امضاء دفتر اسناد رسمی ۶۶۲ تهران</span>
                  <NotaryLogo size="md" />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end no-print">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#001755] hover:bg-[#002279] text-white rounded-xl text-xs font-bold transition-colors"
              >
                بستن پیش‌نمایش
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
