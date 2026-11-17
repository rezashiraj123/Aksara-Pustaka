import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Check,
  SlidersHorizontal,
  NotebookPen,
  Trash2,
  Quote,
  Link2,
  ExternalLink,
} from 'lucide-react';
import {
  Book,
  ReaderFontSize,
  ReaderTheme,
  ReadingNote,
  ReadingProgress,
} from '../types/library';
import { buildBookShareUrl, copyTextToClipboard } from '../utils/shareLink';

interface ReaderViewProps {
  book: Book;
  initialChapterIndex: number;
  progress?: ReadingProgress;
  isSaved: boolean;
  notes: ReadingNote[];
  onBack: () => void;
  onToggleSave: (bookId: string) => void;
  onUpdateProgress: (bookId: string, chapterIndex: number, completed?: boolean) => void;
  onAddNote: (note: Omit<ReadingNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onOpenReview?: (book: Book) => void;
  onOpenSummary?: (book: Book, chapterTitle: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  initialChapterIndex,
  progress,
  isSaved,
  notes,
  onBack,
  onToggleSave,
  onUpdateProgress,
  onAddNote,
  onDeleteNote,
  onOpenReview,
  onOpenSummary,
}) => {
  const [chapterIndex, setChapterIndex] = useState(
    Math.min(Math.max(initialChapterIndex, 0), book.chapters.length - 1)
  );
  const [theme, setTheme] = useState<ReaderTheme>('kertas');
  const [fontSize, setFontSize] = useState<ReaderFontSize>('sedang');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [scrollDepth, setScrollDepth] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyChapterLink = async () => {
    const url = buildBookShareUrl(book, chapterIndex);
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const chapter = book.chapters[chapterIndex];
  const bookNotes = notes.filter((n) => n.bookId === book.id);
  const isChapterCompleted = progress?.completedChapters.includes(chapterIndex) ?? false;

  useEffect(() => {
    onUpdateProgress(book.id, chapterIndex, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [book.id, chapterIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollDepth(100);
      } else {
        const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
        setScrollDepth(pct);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapterIndex]);

  const themeClasses: Record<
    ReaderTheme,
    { page: string; bar: string; border: string; text: string; muted: string; panel: string }
  > = {
    kertas: {
      page: 'bg-[#F8F6F1] text-stone-900',
      bar: 'bg-[#F8F6F1]/95',
      border: 'border-stone-200',
      text: 'text-stone-800',
      muted: 'text-stone-500',
      panel: 'bg-[#F1EEE6]',
    },
    sepia: {
      page: 'bg-[#F3EBD8] text-[#2C2217]',
      bar: 'bg-[#F3EBD8]/95',
      border: 'border-[#DFD2B7]',
      text: 'text-[#362A1D]',
      muted: 'text-[#73624D]',
      panel: 'bg-[#EAE0CA]',
    },
    malam: {
      page: 'bg-[#171717] text-stone-100',
      bar: 'bg-[#171717]/95',
      border: 'border-stone-800',
      text: 'text-stone-200',
      muted: 'text-stone-400',
      panel: 'bg-[#212121]',
    },
  };

  const fontSizeClasses: Record<ReaderFontSize, string> = {
    kecil: 'text-[16px] leading-[1.75]',
    sedang: 'text-[18px] leading-[1.8]',
    besar: 'text-[20px] leading-[1.85]',
  };

  const currentTheme = themeClasses[theme];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote({
      bookId: book.id,
      chapterIndex,
      chapterTitle: chapter.title,
      content: noteInput.trim(),
    });
    setNoteInput('');
  };

  const handleSavePullQuote = () => {
    if (!chapter.pullQuote) return;
    const alreadySaved = bookNotes.some((n) => n.quote === chapter.pullQuote);
    if (alreadySaved) return;
    onAddNote({
      bookId: book.id,
      chapterIndex,
      chapterTitle: chapter.title,
      content: 'Kutipan pilihan dari bab ini.',
      quote: chapter.pullQuote,
    });
  };

  const goToChapter = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= book.chapters.length) return;
    onUpdateProgress(book.id, chapterIndex, true);
    setChapterIndex(nextIdx);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${currentTheme.page}`}>
      {/* Sticky Minimal Reader Top Bar */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-sm border-b ${currentTheme.bar} ${currentTheme.border}`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded ${currentTheme.text}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <span className="font-serif text-base font-semibold truncate max-w-[260px] lg:max-w-md">
              {book.title}
            </span>
            <span className={currentTheme.muted} aria-hidden="true">
              ·
            </span>
            <span className={`text-xs font-mono tabular-nums whitespace-nowrap ${currentTheme.muted}`}>
              Bab {chapter.number}/{book.chapters.length}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative">
            <button
              type="button"
              onClick={handleCopyChapterLink}
              aria-label="Salin tautan bab ini"
              className={`px-2.5 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${currentTheme.border} hover:bg-black/5`}
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Disalin</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salin Tautan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(book.id)}
              aria-label={isSaved ? 'Hapus dari Rak Saya' : 'Simpan ke Rak Saya'}
              className={`p-2 rounded-md border transition-colors ${currentTheme.border} ${
                isSaved ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'hover:bg-black/5'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowNotesPanel((prev) => !prev)}
              aria-label="Tampilkan atau sembunyikan catatan bacaan"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${currentTheme.border} ${
                showNotesPanel ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'hover:bg-black/5'
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Catatan ({bookNotes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              aria-label="Pengaturan tampilan baca"
              className={`px-3 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${currentTheme.border} hover:bg-black/5`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tampilan</span>
            </button>

            {showSettings && (
              <div
                className={`absolute right-0 top-12 w-64 p-4 rounded-md border shadow-lg z-40 ${currentTheme.page} ${currentTheme.border}`}
              >
                <div className="space-y-4">
                  <div>
                    <div className={`text-xs font-medium mb-2 ${currentTheme.muted}`}>
                      Tema Kertas
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: 'kertas', label: 'Kertas' },
                          { id: 'sepia', label: 'Sepia' },
                          { id: 'malam', label: 'Malam' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setTheme(opt.id)}
                          className={`py-1.5 text-xs font-medium rounded border transition-colors ${
                            theme === opt.id
                              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                              : `${currentTheme.border} hover:bg-black/5`
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className={`text-xs font-medium mb-2 ${currentTheme.muted}`}>
                      Ukuran Huruf
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: 'kecil', label: 'Kecil' },
                          { id: 'sedang', label: 'Sedang' },
                          { id: 'besar', label: 'Besar' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFontSize(opt.id)}
                          className={`py-1.5 text-xs font-medium rounded border transition-colors ${
                            fontSize === opt.id
                              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                              : `${currentTheme.border} hover:bg-black/5`
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thin horizontal scroll progress bar */}
        <div className="h-[2px] w-full bg-black/5">
          <div
            className="h-full bg-[#1E3A8A] transition-[width] duration-150"
            style={{ width: `${scrollDepth}%` }}
          />
        </div>
      </header>

      {/* Chapter quick rail */}
      <div className={`border-b ${currentTheme.border}`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-4 overflow-x-auto">
          {book.chapters.map((ch, idx) => {
            const active = idx === chapterIndex;
            const done = progress?.completedChapters.includes(idx);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChapterIndex(idx)}
                className={`text-xs font-medium whitespace-nowrap shrink-0 py-1 px-2.5 rounded transition-colors ${
                  active
                    ? 'bg-[#1E3A8A] text-white'
                    : done
                    ? `${currentTheme.text} opacity-80 hover:opacity-100`
                    : `${currentTheme.muted} hover:opacity-100`
                }`}
              >
                <span className="font-mono tabular-nums mr-1.5">
                  {String(ch.number).padStart(2, '0')}
                </span>
                {ch.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetric Reading Canvas (70% prose / 30% margin notes) */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Primary Reading Column */}
          <article
            ref={contentRef}
            className={`${
              showNotesPanel ? 'lg:col-span-8' : 'lg:col-span-10 lg:col-start-2'
            } max-w-prose mx-auto w-full`}
          >
            <div className={`text-xs font-mono tracking-widest uppercase tabular-nums ${currentTheme.muted}`}>
              Bab {String(chapter.number).padStart(2, '0')} · {chapter.readMinutes} menit baca
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance leading-tight">
              {chapter.title}
            </h1>

            <div className={`mt-3 text-sm ${currentTheme.muted}`}>
              {book.title} — {book.author}
            </div>

            <div className={`my-8 border-b ${currentTheme.border}`} />

            {book.externalUrl && (
              <div
                className={`mb-8 p-4 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${currentTheme.panel} ${currentTheme.border}`}
              >
                <div className="min-w-0">
                  <div className={`text-xs font-mono uppercase tracking-wider ${currentTheme.muted}`}>
                    Sumber Buku Digital Eksternal
                  </div>
                  <div className="mt-0.5 text-xs truncate opacity-85">
                    {book.externalUrl}
                  </div>
                </div>
                <a
                  href={book.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Buka Link Asli</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className={`space-y-6 font-serif ${fontSizeClasses[fontSize]} ${currentTheme.text}`}>
              {chapter.paragraphs.map((para, pIdx) => (
                <React.Fragment key={pIdx}>
                  <p
                    className={
                      pIdx === 0
                        ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'
                        : ''
                    }
                  >
                    {para}
                  </p>

                  {/* Hairline-framed pull quote placed after paragraph 2 */}
                  {pIdx === 1 && chapter.pullQuote && (
                    <figure className={`my-10 py-6 border-y ${currentTheme.border}`}>
                      <blockquote className="font-serif italic text-xl sm:text-2xl leading-relaxed text-balance">
                        “{chapter.pullQuote}”
                      </blockquote>
                      <figcaption className="mt-3 flex items-center justify-between gap-4">
                        <span className={`text-xs font-sans ${currentTheme.muted}`}>
                          Kutipan Bab {chapter.number}
                        </span>
                        <button
                          type="button"
                          onClick={handleSavePullQuote}
                          className="text-xs font-sans font-medium text-[#1E3A8A] dark:text-blue-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Quote className="w-3 h-3" />
                          <span>Simpan kutipan</span>
                        </button>
                      </figcaption>
                    </figure>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Literacy Comprehension Prompt */}
            <section
              aria-label="Panduan pemahaman literasi"
              className={`mt-12 p-5 sm:p-6 rounded-md border ${currentTheme.panel} ${currentTheme.border}`}
            >
              <div className={`text-xs font-mono uppercase tracking-wider ${currentTheme.muted}`}>
                Refleksi Pemahaman Literasi · Bab {chapter.number}
              </div>
              <p className={`mt-2 text-sm leading-relaxed ${currentTheme.text}`}>
                Setelah membaca bab <span className="font-semibold">{chapter.title}</span>, coba simpulkan gagasan utamanya dengan kalimatmu sendiri lalu catat hal paling berkesan menggunakan tombol <span className="font-medium">Buat Ringkasan</span> atau <span className="font-medium">Tulis Resensi Buku</span> di bawah.
              </p>
            </section>

            {/* Chapter completion & navigation footer */}
            <div className={`mt-10 pt-8 border-t ${currentTheme.border}`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateProgress(book.id, chapterIndex, true)}
                    className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border inline-flex items-center gap-2 transition-colors whitespace-nowrap ${
                      isChapterCompleted
                        ? 'bg-emerald-900 text-white border-emerald-900'
                        : `${currentTheme.border} hover:bg-black/5`
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {isChapterCompleted ? 'Bab Ini Sudah Dibaca' : 'Tandai Bab Selesai'}
                    </span>
                  </button>

                  {onOpenSummary && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProgress(book.id, chapterIndex, true);
                        onOpenSummary(book, `Bab ${chapter.number}: ${chapter.title}`);
                      }}
                      className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border inline-flex items-center gap-2 transition-colors whitespace-nowrap ${currentTheme.border} hover:bg-black/5`}
                    >
                      <span>Buat Ringkasan</span>
                    </button>
                  )}

                  {onOpenReview && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProgress(book.id, chapterIndex, true);
                        onOpenReview(book);
                      }}
                      className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border inline-flex items-center gap-2 transition-colors whitespace-nowrap ${currentTheme.border} hover:bg-black/5`}
                    >
                      <span>Tulis Resensi Buku</span>
                    </button>
                  )}
                </div>

                <span className={`text-xs font-mono tabular-nums ${currentTheme.muted}`}>
                  Progres gulir: {scrollDepth}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={chapterIndex === 0}
                  onClick={() => goToChapter(chapterIndex - 1)}
                  className={`p-4 rounded-md border text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${currentTheme.border} hover:bg-black/5`}
                >
                  <div className={`text-xs flex items-center gap-1 ${currentTheme.muted}`}>
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Bab Sebelumnya</span>
                  </div>
                  <div className="mt-1 text-sm font-medium truncate">
                    {chapterIndex > 0 ? book.chapters[chapterIndex - 1].title : 'Awal Buku'}
                  </div>
                </button>

                {chapterIndex < book.chapters.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => goToChapter(chapterIndex + 1)}
                    className={`p-4 rounded-md border text-right transition-colors ${currentTheme.border} hover:bg-black/5`}
                  >
                    <div className={`text-xs flex items-center justify-end gap-1 ${currentTheme.muted}`}>
                      <span>Bab Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="mt-1 text-sm font-medium truncate">
                      {book.chapters[chapterIndex + 1].title}
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProgress(book.id, chapterIndex, true);
                      onBack();
                    }}
                    className="p-4 rounded-md bg-[#1E3A8A] text-white text-right hover:bg-[#172554] transition-colors"
                  >
                    <div className="text-xs text-blue-100">Selesai Membaca</div>
                    <div className="mt-1 text-sm font-medium truncate">
                      Kembali ke Katalog
                    </div>
                  </button>
                )}
              </div>
            </div>
          </article>

          {/* Margin Notes & Saved Quotes Sidebar */}
          {showNotesPanel && (
            <aside
              className={`lg:col-span-4 rounded-md border p-5 sm:p-6 lg:sticky lg:top-20 ${currentTheme.panel} ${currentTheme.border}`}
            >
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/10">
                <h2 className="font-serif text-xl font-semibold">Catatan Pembaca</h2>
                <span className={`text-xs font-mono tabular-nums ${currentTheme.muted}`}>
                  {bookNotes.length} entri
                </span>
              </div>

              <form onSubmit={handleSaveNote} className="mt-4">
                <label htmlFor="reader-note-input" className="sr-only">
                  Tulis catatan pribadi untuk bab ini
                </label>
                <textarea
                  id="reader-note-input"
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={`Tulis refleksi untuk Bab ${chapter.number}...`}
                  className={`w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] ${currentTheme.page} ${currentTheme.border}`}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteInput.trim()}
                    className="px-4 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded-md hover:bg-[#172554] disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {bookNotes.length === 0 ? (
                  <p className={`text-xs leading-relaxed ${currentTheme.muted}`}>
                    Belum ada catatan atau kutipan tersimpan untuk buku ini. Tandai kutipan penting atau tulis pemikiran Anda di atas.
                  </p>
                ) : (
                  bookNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded border text-sm ${currentTheme.page} ${currentTheme.border}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[11px] font-mono ${currentTheme.muted}`}>
                          Bab {note.chapterIndex + 1} · {note.chapterTitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.id)}
                          aria-label="Hapus catatan"
                          className={`p-1 rounded hover:bg-black/5 ${currentTheme.muted}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {note.quote && (
                        <p className="font-serif italic text-sm mb-2 opacity-90">
                          “{note.quote}”
                        </p>
                      )}
                      <p className="text-xs leading-relaxed opacity-85">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};
