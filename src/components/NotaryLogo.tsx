import React from 'react';
import logoImg from '../assets/images/notary_662_logo_1785364787756.jpg';

interface NotaryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const NotaryLogo: React.FC<NotaryLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 rounded-full overflow-hidden border-2 border-[#D3B574] shadow-md bg-white p-0.5 ${sizeClasses[size]}`}>
        <img
          src={logoImg}
          alt="لوگوی رسمی دفتر اسناد رسمی ۶۶۲ تهران - لیلا فرجزاده"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-[#002279] text-base leading-tight tracking-tight">
            دفتر اسناد رسمی ۶۶۲ تهران
          </span>
          <span className="text-[11px] font-bold text-[#D3B574] flex items-center gap-1 mt-0.5">
            <span>سردفتر: خانم لیلا فرجزاده</span>
          </span>
        </div>
      )}
    </div>
  );
};
