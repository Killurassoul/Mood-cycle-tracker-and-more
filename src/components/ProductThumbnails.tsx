import React from 'react';

interface ProductThumbnailProps {
  category: string;
  className?: string;
  size?: number;
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = ({
  category,
  className = '',
  size = 40
}) => {
  const cat = category.toLowerCase();

  return (
    <div
      className={`rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-center p-1 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {cat.includes('cleanse') ? (
        // Cleanser Pump Bottle (like Cetaphil)
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <rect x="14" y="14" width="12" height="20" rx="3" fill="#E6F4FF" stroke="#1890FF" strokeWidth="1.2" />
          <rect x="16" y="11" width="8" height="3" rx="1" fill="#91CAFF" />
          <path d="M 20 11 L 20 6 L 15 6" stroke="#096DD9" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="16" y="20" width="8" height="8" rx="1" fill="#1890FF" opacity="0.3" />
        </svg>
      ) : cat.includes('tone') || cat.includes('lotion') ? (
        // Toner tall bottle (Hadalabo)
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <rect x="15" y="12" width="10" height="22" rx="2" fill="#E6FFFB" stroke="#13C2C2" strokeWidth="1.2" />
          <rect x="16" y="8" width="8" height="4" rx="1" fill="#87E8DE" stroke="#13C2C2" strokeWidth="1" />
          <line x1="18" y1="18" x2="22" y2="18" stroke="#13C2C2" strokeWidth="1" strokeLinecap="round" />
          <line x1="18" y1="22" x2="22" y2="22" stroke="#13C2C2" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ) : cat.includes('serum') || cat.includes('dropper') || cat.includes('mucin') ? (
        // Dropper vial (The Ordinary)
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <rect x="14" y="15" width="12" height="19" rx="2" fill="#FFFFFF" stroke="#D9D9D9" strokeWidth="1.2" />
          <rect x="16" y="12" width="8" height="3" fill="#595959" />
          <path d="M 18 12 C 18 8 22 8 22 12 Z" fill="#8C8C8C" />
          <rect x="16" y="20" width="8" height="6" fill="#F0F0F0" />
        </svg>
      ) : cat.includes('moistur') || cat.includes('cream') || cat.includes('baume') ? (
        // Squeeze Tube (Illiyoon)
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M 14 11 L 26 11 L 24 30 L 16 30 Z" fill="#F0F5FF" stroke="#2F54EB" strokeWidth="1.2" />
          <rect x="17" y="30" width="6" height="4" rx="1" fill="#2F54EB" />
          <rect x="17" y="18" width="6" height="5" fill="#ADC6FF" />
        </svg>
      ) : (
        // Sunscreen Tube with yellow/orange sun hint (Skin1004)
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <path d="M 14 10 L 26 10 L 24 30 L 16 30 Z" fill="#FFFBE6" stroke="#FAAD14" strokeWidth="1.2" />
          <circle cx="20" cy="19" r="3" fill="#FA8C16" />
          <rect x="17" y="30" width="6" height="4" rx="1" fill="#13C2C2" />
        </svg>
      )}
    </div>
  );
};
