import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeSection: 'beranda' | 'katalog' | 'pilihan' | 'rak';
  onNavigate: (section: 'beranda' | 'katalog' | 'pilihan' | 'rak') => void;
  onOpenAddBook: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenAddBook,
  savedCount,
}) => {
  const navItems: { id: 'beranda' | 'katalog' | 'pilihan' | 'rak'; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'pilihan', label: 'Pilihan Kurator' },
    { id: 'katalog', label: 'Katalog' },
    { id: 'rak', label: savedCount > 0 ? `Rak Saya (${savedCount})` : 'Rak Saya' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-stone-200/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('beranda')}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded-sm"
        >
          Pustaka Aksara
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                  isActive
                    ? 'text-stone-900 border-[#1E3A8A]'
                    : 'border-transparent hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenAddBook}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-md inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Buku</span>
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <nav
        aria-label="Navigasi seluler"
        className="flex md:hidden items-center justify-between gap-2 px-4 py-2 border-t border-stone-200/70 bg-[#F8F6F1] overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`text-xs font-medium whitespace-nowrap shrink-0 px-2 py-1 rounded transition-colors ${
                isActive ? 'text-[#1E3A8A] bg-stone-200/60' : 'text-stone-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
