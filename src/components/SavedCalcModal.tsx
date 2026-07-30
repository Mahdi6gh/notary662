import { motion, AnimatePresence } from 'motion/react';
import { X, History, Trash2, Printer, ExternalLink, Calendar } from 'lucide-react';
import { SavedCalculation, CurrencyUnit } from '../types';
import { formatCurrency } from '../utils/numberUtils';

interface SavedCalcModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCalculation[];
  onDeleteSaved: (id: string) => void;
  onClearAll: () => void;
  currency: CurrencyUnit;
  onPrintSavedItem: (item: SavedCalculation) => void;
}

export function SavedCalcModal({
  isOpen,
  onClose,
  savedList,
  onDeleteSaved,
  onClearAll,
  currency,
  onPrintSavedItem,
}: SavedCalcModalProps) {
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
            <div className="bg-[#134252] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <History className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">سوابق محاسبات ذخیره‌شده</h3>
                  <p className="text-xs text-teal-100/80">{savedList.length} پیش‌فاکتور ذخیره شده</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedList.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs text-red-200 hover:text-white hover:bg-red-600/30 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    پاکسازی همه
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {savedList.length === 0 ? (
                <div className="py-12 text-center space-y-2 text-slate-500">
                  <History className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-[#134252]">هیچ سابقه محاسباتی یافت نشد</p>
                  <p className="text-xs text-[#628C71]">
                    پس از انجام هر محاسبه، می‌توانید با دکمه «ذخیره فاکتور»، سوابق را در اینجا حفظ کنید.
                  </p>
                </div>
              ) : (
                savedList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF8F6] p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0F766E]/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#134252]">{item.title}</span>
                        <span className="text-[10px] bg-[#E0F2F1] text-[#0F766E] px-2 py-0.2 rounded-md font-semibold">
                          {item.dateStr}
                        </span>
                      </div>
                      <p className="text-xs text-[#628C71] line-clamp-1">{item.description}</p>
                      <div className="text-sm font-extrabold text-[#0F766E]">
                        {formatCurrency(item.totalRial, currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPrintSavedItem(item)}
                        className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#134252] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        چاپ
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSaved(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="حذف این سابقه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
