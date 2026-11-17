import React, { useEffect, useState } from 'react';
import { X, Bookmark, BookOpen, ArrowRight, Check, Pencil, Trash2, MessageSquareQuote, Link2, FileText, ExternalLink } from 'lucide-react';
import { Book, BookReview, BookSummary, ReadingProgress } from '../types/library';
import { BookCover } from './BookCover';
import { BookReviewSection } from './BookReviewSection';
import { BookSummarySection } from './BookSummarySection';
import { buildBookShareUrl, copyTextToClipboard } from '../utils/shareLink';

interface BookDetailModalProps {
  book: Book | null;
  progress?: ReadingProgress;
  isSaved: boolean;
  reviews: BookReview[];
  summaries: BookSummary[];
  initialTab?: 'daftar-isi' | 'ringkasan' | 'resensi';
  initialReviewComposerOpen?: boolean;
  initialSummaryComposerOpen?: boolean;
  initialSummaryScope?: string;
  onClose: () => void;
  onStartReading: (book: Book, chapterIndex?: number) => void;
  onToggleSave: (bookId: string) => void;
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (bookId: string) => void;
  onAddReview: (review: Omit<BookReview, 'id' | 'createdAt'>) => void;
  onUpdateReview: (review: BookReview) => void;
  onDeleteReview: (reviewId: string) => void;
  onAddSummary: (summary: Omit<BookSummary, 'id' | 'createdAt'>) => void;
  onUpdateSummary: (summary: BookSummary) => void;
  onDeleteSummary: (summaryId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  progress,
  isSaved,
  reviews,
  summaries,
  initialTab = 'daftar-isi',
  initialReviewComposerOpen = false,
  initialSummaryComposerOpen = false,
  initialSummaryScope = 'Seluruh Buku',
  onClose,
  onStartReading,
  onToggleSave,
  onEditBook,
  onDeleteBook,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onAddSummary,
  onUpdateSummary,
  onDeleteSummary,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'daftar-isi' | 'ringkasan' | 'resensi'>(initialTab);

  useEffect(() => {
    setConfirmDelete(false);
    setLinkCopied(false);
    setActiveTab(initialTab);
  }, [book?.id, initialTab]);

  const handleCopyBookLink = async () => {
    if (!book) return;
    const url = buildBookShareUrl(book);
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  useEffect(() => {
    if (!book) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, onClose]);

  if (!book) return null;

  const resumeChapterIndex = progress ? progress.chapterIndex : 0;
  const hasStarted = Boolean(progress);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#F8F6F1] text-stone-900 border border-stone-300 rounded-md shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top utility bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F2EFE8]">
          <span className="font-mono text-xs tracking-wider text-stone-600 tabular-nums">
            KATALOG {book.accessionNumber}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail buku"
            className="p-2 -mr-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-200/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Cover column */}
            <div className="md:col-span-4 lg:col-span-4">
              <div className="bg-[#EBE6DF] p-5 sm:p-6 rounded-sm border border-stone-200">
                <BookCover book={book} size="lg" />
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => onStartReading(book, resumeChapterIndex)}
                  className="w-full py-3 px-5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A]"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>
                    {hasStarted
                      ? `Lanjutkan Bab ${resumeChapterIndex + 1}`
                      : 'Baca di Ruang Baca'}
                  </span>
                </button>

                {book.externalUrl && (
                  <a
                    href={book.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-md border border-[#1E3A8A] bg-white hover:bg-blue-50 text-[#1E3A8A] flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>Buka Link Buku Digital</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onToggleSave(book.id)}
                  className={`w-full py-2.5 px-4 text-sm font-medium rounded-md border flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                    isSaved
                      ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Tersimpan di Rak Saya</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 shrink-0" />
                      <span>Simpan ke Rak Saya</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ringkasan')}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-md border border-stone-300 bg-[#F2EFE8] hover:bg-stone-200 text-stone-900 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <FileText className="w-4 h-4 shrink-0 text-[#1E3A8A]" />
                  <span>Tulis Ringkasan ({summaries.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('resensi')}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-md border border-stone-300 bg-[#F2EFE8] hover:bg-stone-200 text-stone-900 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageSquareQuote className="w-4 h-4 shrink-0 text-[#1E3A8A]" />
                  <span>Tulis Resensi ({reviews.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyBookLink}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-md border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 shrink-0 text-emerald-700" />
                      <span className="text-emerald-800">Tautan Buku Disalin</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 shrink-0 text-stone-600" />
                      <span>Salin Tautan Buku</span>
                    </>
                  )}
                </button>

                {book.isTeacherAdded && (onEditBook || onDeleteBook) && (
                  <div className="pt-3 mt-1 border-t border-stone-200 space-y-2">
                    {onEditBook && (
                      <button
                        type="button"
                        onClick={() => onEditBook(book)}
                        className="w-full py-2 px-4 text-xs font-medium rounded-md border border-stone-300 bg-[#F2EFE8] hover:bg-stone-200 text-stone-800 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Sunting Naskah Buku</span>
                      </button>
                    )}

                    {onDeleteBook && !confirmDelete && (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="w-full py-2 px-4 text-xs font-medium rounded-md border border-stone-300 bg-white hover:bg-red-50 hover:border-red-300 text-red-800 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus dari Katalog</span>
                      </button>
                    )}

                    {onDeleteBook && confirmDelete && (
                      <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
                        <p>Hapus buku ini secara permanen dari katalog?</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onDeleteBook(book.id)}
                            className="flex-1 py-1.5 px-2.5 bg-red-800 hover:bg-red-900 text-white font-medium rounded transition-colors"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="flex-1 py-1.5 px-2.5 bg-white border border-stone-300 text-stone-800 font-medium rounded hover:bg-stone-100 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata & chapters column */}
            <div className="md:col-span-8 lg:col-span-8">
              <div className="text-xs font-medium tracking-wide text-[#1E3A8A]">
                {book.genre}
                {book.isTeacherAdded && (
                  <span className="text-stone-500 font-normal"> · Koleksi Guru</span>
                )}
              </div>
              <h2
                id="modal-book-title"
                className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-stone-900 text-balance leading-tight"
              >
                {book.title}
              </h2>
              <p className="mt-2 text-base text-stone-600 leading-relaxed">
                {book.subtitle}
              </p>

              {/* Museum Accession Metadata Grid */}
              <dl className="mt-6 border-y border-stone-200 divide-y divide-stone-200 text-sm">
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-stone-500">Pengarang</dt>
                  <dd className="col-span-2 font-medium text-stone-900">{book.author}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-stone-500">Penerbit & Tahun</dt>
                  <dd className="col-span-2 text-stone-800 tabular-nums">
                    {book.publisher} · {book.year}
                  </dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-stone-500">Tebal & Durasi</dt>
                  <dd className="col-span-2 text-stone-800 tabular-nums">
                    {book.pages} halaman · ± {book.totalReadMinutes} menit baca
                  </dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-stone-500">Bahasa</dt>
                  <dd className="col-span-2 text-stone-800">{book.language}</dd>
                </div>
                {book.externalUrl && (
                  <div className="py-2.5 grid grid-cols-3 gap-4">
                    <dt className="text-stone-500">Tautan Sumber</dt>
                    <dd className="col-span-2 truncate">
                      <a
                        href={book.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate">{book.externalUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Synopsis */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                  Sinopsis Koleksi
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-stone-700">
                  {book.synopsis}
                </p>
              </div>

              {/* Segmented Tabs: Daftar Isi vs Ringkasan Siswa vs Resensi Siswa */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] rounded-md border border-stone-200 w-fit mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('daftar-isi')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                      activeTab === 'daftar-isi'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Daftar Isi ({book.chapters.length} Bab)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ringkasan')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                      activeTab === 'ringkasan'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Ringkasan Siswa ({summaries.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('resensi')}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                      activeTab === 'resensi'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Resensi Siswa ({reviews.length})
                  </button>
                </div>

                {activeTab === 'daftar-isi' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                        Daftar Bab Bacaan
                      </h3>
                      {progress && (
                        <span className="text-xs text-stone-500 tabular-nums">
                          {progress.completedChapters.length} dari {book.chapters.length} bab selesai
                        </span>
                      )}
                    </div>

                    <div className="divide-y divide-stone-200 border-y border-stone-200">
                      {book.chapters.map((chapter, idx) => {
                        const isCompleted = progress?.completedChapters.includes(idx);
                        const isCurrent = progress?.chapterIndex === idx;
                        return (
                          <button
                            key={chapter.id}
                            type="button"
                            onClick={() => onStartReading(book, idx)}
                            className="w-full py-3.5 px-2 flex items-center justify-between gap-4 text-left hover:bg-stone-200/50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
                          >
                            <div className="flex items-baseline gap-4 min-w-0">
                              <span className="font-mono text-xs text-stone-400 tabular-nums shrink-0">
                                {String(chapter.number).padStart(2, '0')}
                              </span>
                              <span className="text-sm sm:text-[15px] font-medium text-stone-900 group-hover:text-[#1E3A8A] transition-colors truncate">
                                {chapter.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 text-xs text-stone-500 tabular-nums">
                              {isCompleted && (
                                <span className="text-emerald-800 font-medium">Selesai</span>
                              )}
                              {!isCompleted && isCurrent && (
                                <span className="text-[#1E3A8A] font-medium">Terakhir dibaca</span>
                              )}
                              <span>{chapter.readMinutes} mnt</span>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#1E3A8A] transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'ringkasan' && (
                  <BookSummarySection
                    bookId={book.id}
                    bookTitle={book.title}
                    chapters={book.chapters}
                    summaries={summaries}
                    initialComposerOpen={initialSummaryComposerOpen}
                    initialScope={initialSummaryScope}
                    onAddSummary={onAddSummary}
                    onUpdateSummary={onUpdateSummary}
                    onDeleteSummary={onDeleteSummary}
                  />
                )}

                {activeTab === 'resensi' && (
                  <BookReviewSection
                    bookId={book.id}
                    bookTitle={book.title}
                    reviews={reviews}
                    initialComposerOpen={initialReviewComposerOpen}
                    onAddReview={onAddReview}
                    onUpdateReview={onUpdateReview}
                    onDeleteReview={onDeleteReview}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
