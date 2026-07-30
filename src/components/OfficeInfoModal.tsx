import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, Clock, ShieldCheck, ExternalLink, UserCheck, Globe, FileText, Smartphone } from 'lucide-react';
import { NotaryLogo } from './NotaryLogo';

interface OfficeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfficeInfoModal({ isOpen, onClose }: OfficeInfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#D3B574]/40 my-6 space-y-0"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] p-5 text-white flex items-center justify-between border-b border-[#D3B574]/40">
              <div className="flex items-center gap-3">
                <NotaryLogo size="md" />
                <div>
                  <h3 className="text-base font-black flex items-center gap-2">
                    <span>دفتر اسناد رسمی ۶۶۲ تهران</span>
                    <span className="text-[10px] bg-[#D3B574] text-[#001755] px-2 py-0.5 rounded-full font-bold">رسمی</span>
                  </h3>
                  <p className="text-xs text-blue-100/90 font-medium">سازمان ثبت اسناد و املاک کشور — بیش از ۲۵ سال تجربه ثبتی</p>
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

            {/* Content Body */}
            <div className="p-6 space-y-4 text-xs text-[#002279] max-h-[75vh] overflow-y-auto">
              
              {/* Official Seal / Management Card */}
              <div className="glass-card-gold p-4.5 rounded-2xl border border-[#D3B574]/45 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm">
                <div className="shrink-0">
                  <NotaryLogo size="lg" />
                </div>
                <div className="space-y-1.5 text-center sm:text-right">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-black text-sm text-[#002279]">دفتر اسناد رسمی ۶۶۲ تهران</h4>
                    <span className="bg-[#F5F0E6] text-[#A88640] border border-[#D3B574]/50 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#D3B574]" />
                      سردفتر: خانم لیلا فرجزاده
                    </span>
                  </div>
                  <p className="text-[#002279]/80 text-[11px] leading-relaxed font-medium">
                    ارائه‌دهنده خدمات تخصصی ثبت رسمی اسناد، با بیش از ۲۵ سال تجربه ثبتی در حوزه تنظیم اسناد ملکی، امور خانواده، مشارکت در ساخت، بیع و وکالت‌نامه‌ها مبتنی بر دقت، شفافیت و رعایت دقیق مقررات قانون الزام به ثبت سند رسمی.
                  </p>
                </div>
              </div>

              {/* Info Contact Items */}
              <div className="space-y-2.5">
                
                {/* Address */}
                <div className="flex items-start gap-3 p-3.5 bg-[#F5F0E6]/80 rounded-2xl border border-[#D3B574]/30">
                  <MapPin className="w-4 h-4 text-[#D3B574] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-black text-[#002279]">نشانی رسمی دفترخانه:</span>
                    <p className="text-[#002279]/80 font-semibold text-[11.5px] leading-snug">
                      تهران، چهارراه جهان کودک، بلوار حقانی، نرسیده به گاندی شمالی، پلاک ۶۷
                    </p>
                  </div>
                </div>

                {/* Phones & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-2xl border border-[#D3B574]/30 flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#002279] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#002279] block mb-1">تلفن‌های تماس:</span>
                      <div className="flex flex-col gap-1 text-[11px] font-mono">
                        <a href="tel:+982188195217" className="text-[#002279] hover:underline font-bold dir-ltr text-right">
                          021 - 88195217
                        </a>
                        <a href="tel:+989196625662" className="text-[#A88640] hover:underline font-bold dir-ltr text-right flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-[#D3B574]" />
                          0919 662 5662
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#D3B574]/30 flex items-start gap-3">
                    <Globe className="w-4 h-4 text-[#D3B574] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#002279] block mb-1">وب‌سایت رسمی:</span>
                      <a
                        href="https://www.notary662th.ir/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#002279] hover:text-[#D3B574] font-bold dir-ltr block text-right hover:underline text-[11px] flex items-center gap-1"
                      >
                        www.notary662th.ir
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href="https://www.notary662th.ir/cost-system/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#A88640] hover:underline mt-1 block"
                      >
                        • لینک سامانه تعرفه در سایت اصلی
                      </a>
                    </div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#D3B574]/30">
                  <Clock className="w-4 h-4 text-[#002279] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#002279]">ساعات فعالیت و پذیرش مراجعین:</span>
                    <p className="text-[#002279]/80 font-semibold text-[11px]">
                      شنبه تا چهارشنبه: ۸:۰۰ الی ۱۵:۳۰ | پنج‌شنبه‌ها: ۸:۰۰ الی ۱۳:۰۰
                    </p>
                  </div>
                </div>
              </div>

              {/* Comprehensive Notary Services List */}
              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#D3B574]/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#002279]">
                  <FileText className="w-4 h-4 text-[#D3B574]" />
                  <span>دامنه خدمات رسمی دفتر اسناد رسمی ۶۶۲:</span>
                </div>
                <p className="text-[#002279]/80 text-[11px] leading-relaxed">
                  • <strong className="text-[#002279]">اسناد ملکی و تجاری:</strong> تنظیم و ثبت کلیه قراردادهای مشارکت در ساخت، پیش‌فروش املاک، تعهد به بیع، بیع‌نامه قطعی و رهنی، قولنامه محضری، صلح عمری و وکالت فروش املاک.
                </p>
                <p className="text-[#002279]/80 text-[11px] leading-relaxed">
                  • <strong className="text-[#002279]">امور اسناد خانوادگی:</strong> تنظیم شروط ضمن عقد، وکالت حق طلاق، ابراء مهریه، حضانت فرزند و مشاوره حقوقی ازدواج.
                </p>
              </div>

              {/* Quality & Legal Banner */}
              <div className="bg-[#002279]/10 p-3.5 rounded-2xl border border-[#002279]/20 text-[#002279] space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#D3B574]" />
                  تضمین دقت و اشاعه فرهنگ سند رسمی
                </span>
                <p className="text-[11px] text-[#002279]/80 leading-relaxed font-medium">
                  هدف این سامانه روشنگری، اطلاع‌رسانی و ارائه محاسبات ریالی شفاف به مراجعین و جامعه محترم دفاتر اسناد رسمی منطبق بر جدیدترین بخشنامه‌های ابلاغی است.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F5F0E6] border-t border-[#D3B574]/30 flex items-center justify-between">
              <a
                href="https://www.notary662th.ir/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#002279] hover:text-[#D3B574] flex items-center gap-1 hover:underline"
              >
                <span>ورود به سایت notary662th.ir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-[#001755] to-[#002279] hover:from-[#002279] hover:to-[#001755] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-white/20"
              >
                متوجه شدم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

