import { Building, Landmark, Key, Users, LayoutDashboard } from 'lucide-react';
import { CalculatorTab } from '../types';

interface NavigationProps {
  activeTab: CalculatorTab | 'dashboard';
  onTabChange: (tab: CalculatorTab | 'dashboard') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'پیش‌خوان',
      icon: LayoutDashboard,
      badge: 'اصلی',
    },
    {
      id: 'real_estate' as const,
      label: 'املاک و پیش‌فروش',
      icon: Building,
      badge: 'غیرمنقول',
    },
    {
      id: 'financial' as const,
      label: 'مالی و رهنی',
      icon: Landmark,
      badge: 'اسناد وام',
    },
    {
      id: 'rent' as const,
      label: 'اسناد اجاره',
      icon: Key,
      badge: 'رهن و اجاره',
    },
    {
      id: 'inheritance' as const,
      label: 'محاسبه سهم‌الارث',
      icon: Users,
      badge: 'وراثت',
    },
  ];

  return (
    <>
      {/* Top Tab Bar for Desktop & Tablet */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-xl border-b border-[#D3B574]/30 sticky top-[69px] z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm transition-all duration-300 shrink-0 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#001755] to-[#002279] text-white shadow-md font-bold border border-[#D3B574]/50'
                      : 'text-[#002279] hover:text-[#001755] hover:bg-[#F5F0E6] font-semibold border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D3B574]' : 'text-[#002279]'}`} />
                  <span>{tab.label}</span>
                  {tab.id !== 'dashboard' && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/20'
                          : 'bg-[#F5F0E6] text-[#A88640] border border-[#D3B574]/40'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-[#D3B574]/30 z-40 px-2 py-1.5 shadow-2xl no-print">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-[#002279] font-bold bg-[#F5F0E6] border border-[#D3B574]/50'
                    : 'text-[#002279]/70 hover:text-[#002279]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-[#D3B574]' : ''}`} />
                <span className="text-[10px] truncate max-w-full text-center leading-tight">
                  {tab.id === 'dashboard' ? 'پیش‌خوان' : tab.label.replace('محاسبه ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
