import React, { useState } from 'react';
import { Book } from '../types/library';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const showGeneratedImage = Boolean(book.coverImage) && !imgError;

  const titleSizeClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl leading-tight'
      : size === 'sm'
      ? 'text-base leading-snug'
      : 'text-xl leading-snug';

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-stone-300/80 shadow-sm select-none ${className}`}
      style={{ backgroundColor: book.coverPalette.bg }}
    >
      {showGeneratedImage ? (
        <>
          <img
            src={book.coverImage}
            alt={`Sampul buku ${book.title} karya ${book.author}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
          {/* Subtle spine crease effect for tactile book feel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-white/10 to-transparent"
          />
        </>
      ) : (
        <div
          className="cloth-texture relative flex h-full w-full flex-col justify-between p-5 sm:p-6"
          style={{
            backgroundColor: book.coverPalette.bg,
            color: book.coverPalette.text,
          }}
        >
          {/* Spine shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/30 via-white/5 to-transparent"
          />

          {/* Inner editorial frame */}
          <div
            className="relative flex h-full flex-col justify-between border p-4 sm:p-5"
            style={{ borderColor: `${book.coverPalette.accent}44` }}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono tracking-widest uppercase opacity-80">
              <span className="truncate">{book.accessionNumber}</span>
              <span className="tabular-nums">{book.year}</span>
            </div>

            <div className="my-auto py-3">
              <div
                className="mb-3 h-px w-8"
                style={{ backgroundColor: book.coverPalette.accent }}
              />
              <h4 className={`font-serif font-semibold text-balance ${titleSizeClass}`}>
                {book.title}
              </h4>
              {size !== 'sm' && (
                <p className="mt-2 line-clamp-2 text-xs opacity-75 leading-relaxed">
                  {book.subtitle}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
              <span className="text-xs font-medium tracking-wide truncate">
                {book.author}
              </span>
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: book.coverPalette.accent }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
