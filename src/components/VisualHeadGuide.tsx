import React from 'react';
import { cn } from '@/lib/utils';

interface HeadType {
  id: string;
  name: string;
  searchTerm: string;
  icon: React.ReactNode;
}

const headTypes: HeadType[] = [
  {
    id: 'hex',
    name: 'Hexagonal',
    searchTerm: 'hexagonal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
        <path d="M12 6l5.2 3v6L12 18l-5.2-3V9L12 6z" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'socket',
    name: 'Socket (Allen)',
    searchTerm: 'socket',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7l4.33 2.5v5L12 17l-4.33-2.5v-5L12 7z" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'flat',
    name: 'Plana',
    searchTerm: 'cabeza plana',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M4 7h16" />
        <path d="M6 7l6 10 6-10" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'oval',
    name: 'Gota / Oval',
    searchTerm: 'gota sebo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M4 9c0-2.2 3.6-4 8-4s8 1.8 8 4" />
        <path d="M6 9l6 10 6-10" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'pan',
    name: 'Cilíndrica',
    searchTerm: 'cilindrica',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <rect x="5" y="6" width="14" height="6" rx="2" />
        <path d="M12 12v9" />
      </svg>
    ),
  },
  {
    id: 'pija',
    name: 'Pija / Broca',
    searchTerm: 'pija',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M6 6h12" />
        <path d="M8 6l4 14 4-14" />
        <path d="M12 14v2" />
        <path d="M10 17l2 3 2-3" />
      </svg>
    ),
  },
];

interface Props {
  onSelect: (searchTerm: string) => void;
  currentSearch: string;
}

export const VisualHeadGuide: React.FC<Props> = ({ onSelect, currentSearch }) => {
  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 px-1">
        {headTypes.map((head) => {
          const isActive = currentSearch.toLowerCase().includes(head.searchTerm);
          return (
            <button
              key={head.id}
              onClick={() => onSelect(isActive ? '' : head.searchTerm)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-[24px] border-2 transition-all duration-300",
                isActive
                  ? "bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10"
                  : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "w-12 h-12 flex items-center justify-center p-1 transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-slate-400"
              )}>
                {head.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-center">
                {head.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
