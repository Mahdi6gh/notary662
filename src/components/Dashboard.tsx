import { motion } from 'motion/react';
import { Building, Landmark, Key, Users, ArrowLeft, ShieldCheck, Scale, Sparkles, HelpCircle } from 'lucide-react';
import { CalculatorTab } from '../types';

interface DashboardProps {
  onSelectTab: (tab: CalculatorTab) => void;
  onOpenOfficeInfo: () => void;
}

export function Dashboard({ onSelectTab, onOpenOfficeInfo }: DashboardProps) {
  const cards = [
    {
      id: 'real_estate' as const,
      title: 'اسناد غیرمنقول و پیش‌فروش',
      subtitle: 'خرید، فروش، انتقال ملک، آپارتمان و پیش‌فروش ساختمان',
      icon: Building,
      badge: 'پرکاربردترین',
      iconColor: 'text-[#002279]',
      badgeColor: 'bg-[#F5F0E6] text-[#A88640] border border-[#D3B574]/40',
      features: ['حق‌التحریر پلکانی ملک', 'استعلام ثبت، دارایی و شهرداری', 'محاسبه ارزش افزوده و کاداستر'],
    },
    {
      id: 'financial' as const,
      title: 'سایر اسناد مالی و رهنی',
      subtitle: 'اسناد رهن بانک، وام، وثیقه، تعهد و اقرارنامه مالی',
      icon: Landmark,
      badge: 'اسناد رهنی',
      iconColor: 'text-[#002279]',
      badgeColor: 'bg-[#002279]/10 text-[#002279] border border-[#002279]/20',
      features: ['اصل و سود وام‌های بانکی', 'سهم هزینه‌های راهن (وام‌گیرنده)', 'محاسبه حق‌الثبت ۱٪'],
    },
    {
      id: 'rent' as const,
      title: 'اسناد اجاره املاک',
      subtitle: 'اجاره‌نامه رسمی مسکونی، تجاری و اداری در دفترخانه',
      icon: Key,
      badge: 'رهن و اجاره',
      iconColor: 'text-[#A88640]',
      badgeColor: 'bg-[#F5F0E6] text-[#A88640] border border-[#D3B574]/40',
      features: ['فرمول ترکیب ودیعه و اجاره', 'محاسبه استعلام‌های مربوطه', 'تعداد موجر و مستأجر اضافه'],
    },
    {
      id: 'inheritance' as const,
      title: 'محاسبه دقیق سهم‌الارث',
      subtitle: 'تقسیم قانونی ترکه بین فرزندان، همسر و والدین (منقول/غیرمنقول)',
      icon: Users,
      badge: 'جدید و هوشمند',
      iconColor: 'text-[#002279]',
      badgeColor: 'bg-[#002279]/10 text-[#002279] border border-[#002279]/20',
      features: ['تفکیک اموال منقول و غیرمنقول', 'هشدار حقوقی طلب زوجه از ملک', 'تطبیق با قانون مدنی ارث'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="notary-hero-card rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#D3B574]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#002279]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#E7D09E] border border-[#D3B574]/50 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D3B574] animate-pulse" />
            <span>تعرفه رسمی جدید دفاتر اسناد رسمی کشور (notary662th.ir)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
            محاسبه‌گر هوشمند هزینه اسناد و سهم‌الارث
          </h2>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium">
            برای برآورد ریالی دقیق هزینه‌های تنظیم سند یا محاسبه قانونی سهم‌الارث متوفی قبل از مراجعه به دفتر اسناد رسمی ۶۶۲ تهران (سردفتر: خانم لیلا فرجزاده)، ابزار مورد نظر خود را انتخاب نمایید.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D3B574]" />
              منطبق با بخشنامه‌های سازمان ثبت اسناد و املاک
            </span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#D3B574]" />
              محاسبه آنلاین و زنده (Live)
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2x2 Category Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#002279] flex items-center gap-2">
            <span>انتخاب ماشین‌حساب تخصصی</span>
          </h3>
          <span className="text-xs text-[#A88640] bg-[#F5F0E6] px-3 py-1 rounded-full font-bold border border-[#D3B574]/40">۴ بخش محاسباتی مجزا</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelectTab(card.id)}
                className="cursor-pointer glass-panel glass-panel-hover rounded-[2rem] p-6 relative overflow-hidden group flex flex-col justify-between border border-[#D3B574]/30"
              >
                <div className="space-y-4">
                  {/* Card Header & Icon */}
                  <div className="flex items-start justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#F5F0E6] via-white to-white shadow-xs border border-[#D3B574]/40 flex items-center justify-center transition-transform group-hover:rotate-3">
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h4 className="text-lg font-black text-[#002279] group-hover:text-[#001755] transition-colors flex items-center justify-between">
                      <span>{card.title}</span>
                      <ArrowLeft className="w-4 h-4 text-[#D3B574] opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                    </h4>
                    <p className="text-xs sm:text-sm text-[#002279]/70 mt-1 line-clamp-2 font-medium">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-3 border-t border-[#D3B574]/20 space-y-1.5">
                    {card.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-[#002279]/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D3B574]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Hint */}
                <div className="mt-5 pt-3 flex items-center justify-between text-xs font-black text-[#002279] group-hover:translate-x-[-2px] transition-transform">
                  <span className="group-hover:text-[#A88640] transition-colors">شروع محاسبه</span>
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center border border-[#D3B574]/40 group-hover:border-[#D3B574]">
                    <ArrowLeft className="w-4 h-4 text-[#002279] group-hover:text-[#A88640]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Office Information & Legal Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-panel rounded-2xl p-5 border border-[#D3B574]/40 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#F5F0E6] rounded-xl text-[#A88640] border border-[#D3B574]/40 shrink-0">
            <HelpCircle className="w-5 h-5 text-[#D3B574]" />
          </div>
          <div className="space-y-0.5">
            <h5 className="text-sm font-bold text-[#002279]">راهنمای رسمی مراجعین دفتر اسناد رسمی ۶۶۲ تهران</h5>
            <p className="text-xs text-[#002279]/70">
              هزینه‌های اعلام‌شده بر اساس بخشنامه رسمی تعرفه حق‌التحریر دفاتر اسناد رسمی ابلاغی سازمان ثبت املاک کشور محاسبه می‌گردد.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenOfficeInfo}
          className="px-4 py-2 bg-[#F5F0E6] hover:bg-gradient-to-r hover:from-[#001755] hover:to-[#002279] hover:text-white text-[#002279] rounded-xl text-xs font-bold border border-[#D3B574]/40 transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>اطلاعات تماس و نشانی دفترخانه</span>
          <ArrowLeft className="w-3.5 h-3.5 text-[#D3B574]" />
        </button>
      </motion.div>

    </div>
  );
}
