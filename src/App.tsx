import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  Check,
  LayoutGrid,
  List,
  ArrowRight,
  X,
  Trash2,
  Plus,
  Star,
  Link2,
  FileText,
  ExternalLink,
  Copy,
  Pencil,
} from 'lucide-react';
import { BOOKS_CATALOG, HERO_LIBRARY_IMAGE } from './data/books';
import {
  Book,
  BookGenre,
  BookReview,
  BookSummary,
  ReadingNote,
  ReadingProgress,
  SortOption,
} from './types/library';
import { Header } from './components/Header';
import { BookCover } from './components/BookCover';
import { BookDetailModal } from './components/BookDetailModal';
import { ReaderView } from './components/ReaderView';
import { AddBookModal } from './components/AddBookModal';
import { ExternalSummaryModal } from './components/ExternalSummaryModal';
import {
  buildLibraryShareUrl,
  copyTextToClipboard,
  decodeSharedBook,
} from './utils/shareLink';

const STORAGE_SAVED_KEY = 'pustaka_aksara_saved_v1';
const STORAGE_PROGRESS_KEY = 'pustaka_aksara_progress_v1';
const STORAGE_NOTES_KEY = 'pustaka_aksara_notes_v1';
const STORAGE_TEACHER_BOOKS_KEY = 'pustaka_aksara_teacher_books_v1';
const STORAGE_REVIEWS_KEY = 'pustaka_aksara_reviews_v1';
const STORAGE_SUMMARIES_KEY = 'pustaka_aksara_summaries_v1';

export default function App() {
  const [activeSection, setActiveSection] = useState<
    'beranda' | 'katalog' | 'pilihan' | 'rak'
  >('beranda');
  const [selectedGenre, setSelectedGenre] = useState<BookGenre>(BookGenre.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('kurasi');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [heroImgError, setHeroImgError] = useState(false);

  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<
    'daftar-isi' | 'ringkasan' | 'resensi'
  >('daftar-isi');
  const [openReviewComposerOnOpen, setOpenReviewComposerOnOpen] = useState(false);
  const [openSummaryComposerOnOpen, setOpenSummaryComposerOnOpen] = useState(false);
  const [initialSummaryScope, setInitialSummaryScope] = useState('Seluruh Buku');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [addBookMode, setAddBookMode] = useState<'manual' | 'link'>('manual');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [teacherOnlyFilter, setTeacherOnlyFilter] = useState(false);
  const [isExternalSummaryOpen, setIsExternalSummaryOpen] = useState(false);
  const [editingExternalSummary, setEditingExternalSummary] =
    useState<BookSummary | null>(null);
  const [summarySourceFilter, setSummarySourceFilter] = useState<
    'semua' | 'katalog' | 'luar'
  >('semua');
  const [copiedSummaryId, setCopiedSummaryId] = useState<string | null>(null);
  const [readingState, setReadingState] = useState<{
    book: Book;
    chapterIndex: number;
  } | null>(null);

  const [teacherBooks, setTeacherBooks] = useState<Book[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_TEACHER_BOOKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_REVIEWS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [summaries, setSummaries] = useState<BookSummary[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SUMMARIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      return raw ? JSON.parse(raw) : ['senja-sunda-kelapa', 'etika-ruang-sunyi'];
    } catch {
      return [];
    }
  });

  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<ReadingNote[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_NOTES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [shelfTab, setShelfTab] = useState<
    'tersimpan' | 'riwayat' | 'catatan' | 'ringkasan' | 'resensi'
  >('tersimpan');
  const [libraryLinkCopied, setLibraryLinkCopied] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const pilihanRef = useRef<HTMLElement>(null);
  const katalogRef = useRef<HTMLElement>(null);
  const rakRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progressMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [progressMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_TEACHER_BOOKS_KEY,
        JSON.stringify(teacherBooks)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [teacherBooks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SUMMARIES_KEY, JSON.stringify(summaries));
    } catch {
      // Ignore storage quota errors
    }
  }, [summaries]);

  const allBooks = useMemo(
    () => [...teacherBooks, ...BOOKS_CATALOG],
    [teacherBooks]
  );

  const summariesByBookId = useMemo(() => {
    const map: Record<string, BookSummary[]> = {};
    for (const s of summaries) {
      if (!map[s.bookId]) map[s.bookId] = [];
      map[s.bookId].push(s);
    }
    return map;
  }, [summaries]);

  // Deep-link bootstrap: support ?buku=<id>&bab=<num>&data=<base64>
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bookParam = params.get('buku');
      const chapterParam = params.get('bab');
      const dataParam = params.get('data');

      let resolvedBook: Book | undefined;

      if (dataParam) {
        const decoded = decodeSharedBook(dataParam);
        if (decoded) {
          resolvedBook = decoded;
          setTeacherBooks((prev) =>
            prev.some((b) => b.id === decoded.id) ? prev : [decoded, ...prev]
          );
        }
      }

      if (!resolvedBook && bookParam) {
        resolvedBook = [...teacherBooks, ...BOOKS_CATALOG].find(
          (b) => b.id === bookParam
        );
      }

      if (resolvedBook) {
        if (chapterParam) {
          const idx = Math.max(
            0,
            Math.min(
              resolvedBook.chapters.length - 1,
              (parseInt(chapterParam, 10) || 1) - 1
            )
          );
          setReadingState({ book: resolvedBook, chapterIndex: idx });
        } else {
          setDetailBook(resolvedBook);
        }
      }
    } catch {
      // Ignore malformed query params
    }
  }, []);

  const handleCopyLibraryLink = async () => {
    const url = buildLibraryShareUrl();
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setLibraryLinkCopied(true);
      setTimeout(() => setLibraryLinkCopied(false), 2500);
    }
  };

  const reviewsByBookId = useMemo(() => {
    const map: Record<string, BookReview[]> = {};
    for (const r of reviews) {
      if (!map[r.bookId]) map[r.bookId] = [];
      map[r.bookId].push(r);
    }
    return map;
  }, [reviews]);

  const handleToggleSave = (bookId: string) => {
    setSavedIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleUpdateProgress = (
    bookId: string,
    chapterIndex: number,
    completed = false
  ) => {
    setProgressMap((prev) => {
      const existing = prev[bookId];
      const completedSet = new Set(existing?.completedChapters ?? []);
      if (completed) completedSet.add(chapterIndex);
      return {
        ...prev,
        [bookId]: {
          bookId,
          chapterIndex,
          scrollProgress: 0,
          lastReadAt: Date.now(),
          completedChapters: Array.from(completedSet).sort((a, b) => a - b),
        },
      };
    });
  };

  const handleAddNote = (noteData: Omit<ReadingNote, 'id' | 'createdAt'>) => {
    const newNote: ReadingNote = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleStartReading = (book: Book, chapterIndex = 0) => {
    setDetailBook(null);
    setReadingState({ book, chapterIndex });
  };

  const handleOpenAddBook = (mode: 'manual' | 'link' = 'manual') => {
    setEditingBook(null);
    setAddBookMode(mode);
    setIsAddBookOpen(true);
  };

  const handleSaveTeacherBook = (book: Book) => {
    setTeacherBooks((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.map((b) => (b.id === book.id ? book : b));
      }
      return [book, ...prev];
    });
    setSelectedGenre(BookGenre.ALL);
    setTeacherOnlyFilter(false);
    setSearchQuery('');
    setTimeout(() => {
      katalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEditTeacherBook = (book: Book) => {
    setDetailBook(null);
    setEditingBook(book);
    setIsAddBookOpen(true);
  };

  const handleDeleteTeacherBook = (bookId: string) => {
    setTeacherBooks((prev) => prev.filter((b) => b.id !== bookId));
    setSavedIds((prev) => prev.filter((id) => id !== bookId));
    setDetailBook(null);
  };

  const handleOpenBookDetail = (
    book: Book,
    tab: 'daftar-isi' | 'ringkasan' | 'resensi' = 'daftar-isi',
    openComposer = false,
    summaryScope = 'Seluruh Buku'
  ) => {
    setDetailModalTab(tab);
    setOpenReviewComposerOnOpen(tab === 'resensi' && openComposer);
    setOpenSummaryComposerOnOpen(tab === 'ringkasan' && openComposer);
    setInitialSummaryScope(summaryScope);
    setDetailBook(book);
  };

  const handleAddSummary = (
    summaryData: Omit<BookSummary, 'id' | 'createdAt'>
  ) => {
    const newSummary: BookSummary = {
      ...summaryData,
      id: `sum-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    setSummaries((prev) => [newSummary, ...prev]);
  };

  const handleUpdateSummary = (updated: BookSummary) => {
    setSummaries((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSummary = (summaryId: string) => {
    setSummaries((prev) => prev.filter((s) => s.id !== summaryId));
  };

  const handleOpenExternalSummary = (summaryToEdit?: BookSummary) => {
    setEditingExternalSummary(summaryToEdit || null);
    setIsExternalSummaryOpen(true);
  };

  const handleSaveExternalSummary = (saved: BookSummary) => {
    setSummaries((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s));
      }
      return [saved, ...prev];
    });
    setEditingExternalSummary(null);
    setShelfTab('ringkasan');
    if (summarySourceFilter === 'katalog') {
      setSummarySourceFilter('semua');
    }
    setTimeout(() => {
      rakRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopySummaryText = async (
    item: BookSummary,
    bookTitleText: string,
    bookAuthorText?: string
  ) => {
    const lines = [
      `Ringkasan Bacaan: ${bookTitleText}`,
      bookAuthorText ? `Pengarang/Sumber: ${bookAuthorText}` : '',
      `Siswa: ${item.studentName}${item.studentClass ? ` (Kelas ${item.studentClass})` : ''}`,
      `Cakupan: ${item.scope}`,
      item.externalBookUrl ? `Tautan Sumber: ${item.externalBookUrl}` : '',
      '',
      item.summaryText,
      item.keyPoints.length > 0
        ? `\nPoin Gagasan Utama:\n${item.keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}`
        : '',
    ]
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n');

    const ok = await copyTextToClipboard(lines);
    if (ok) {
      setCopiedSummaryId(item.id);
      setTimeout(() => setCopiedSummaryId(null), 2200);
    }
  };

  const handleAddReview = (reviewData: Omit<BookReview, 'id' | 'createdAt'>) => {
    const newReview: BookReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleUpdateReview = (updated: BookReview) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const scrollToSection = (section: 'beranda' | 'katalog' | 'pilihan' | 'rak') => {
    setActiveSection(section);
    const map = {
      beranda: heroRef,
      pilihan: pilihanRef,
      katalog: katalogRef,
      rak: rakRef,
    };
    map[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { [BookGenre.ALL]: allBooks.length };
    for (const book of allBooks) {
      counts[book.genre] = (counts[book.genre] || 0) + 1;
    }
    return counts;
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allBooks.filter((book) => {
      if (teacherOnlyFilter && !book.isTeacherAdded) return false;
      const matchesGenre =
        selectedGenre === BookGenre.ALL || book.genre === selectedGenre;
      if (!matchesGenre) return false;
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.subtitle.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q) ||
        book.accessionNumber.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (sortBy === 'judul') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    } else if (sortBy === 'terbaru') {
      sorted.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'singkat') {
      sorted.sort((a, b) => a.totalReadMinutes - b.totalReadMinutes);
    }
    return sorted;
  }, [allBooks, selectedGenre, searchQuery, sortBy, teacherOnlyFilter]);

  const featuredLead = BOOKS_CATALOG[0];
  const featuredSecondary = BOOKS_CATALOG.filter((b) => b.featured).slice(1, 5);

  const recentProgressList = useMemo(() => {
    return Object.values(progressMap)
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .map((prog) => ({
        progress: prog,
        book: allBooks.find((b) => b.id === prog.bookId),
      }))
      .filter((item): item is { progress: ReadingProgress; book: Book } =>
        Boolean(item.book)
      );
  }, [progressMap, allBooks]);

  const savedBooks = useMemo(
    () => allBooks.filter((b) => savedIds.includes(b.id)),
    [savedIds, allBooks]
  );

  // If currently inside ReaderView, render the dedicated distraction-free Reading Room
  if (readingState) {
    return (
      <ReaderView
        book={readingState.book}
        initialChapterIndex={readingState.chapterIndex}
        progress={progressMap[readingState.book.id]}
        isSaved={savedIds.includes(readingState.book.id)}
        notes={notes}
        onBack={() => setReadingState(null)}
        onToggleSave={handleToggleSave}
        onUpdateProgress={handleUpdateProgress}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onOpenReview={(book) => {
          setReadingState(null);
          handleOpenBookDetail(book, 'resensi', true);
        }}
        onOpenSummary={(book, scope) => {
          setReadingState(null);
          handleOpenBookDetail(book, 'ringkasan', true, scope);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-stone-900 flex flex-col">
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAddBook={() => handleOpenAddBook('manual')}
        savedCount={savedIds.length}
      />

      <main className="flex-1">
        {/* Hero Section: Institutional Editorial Marquee */}
        <section
          ref={heroRef}
          className="border-b border-stone-200 bg-[#F8F6F1]"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-between py-2">
                <div>
                  <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
                    Gerakan Literasi Digital Sekolah & Masyarakat
                  </p>
                  <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-stone-900 leading-[1.08] text-balance">
                    Tingkatkan literasi membaca lewat bacaan bermutu yang siap dipahami
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                    Dirancang untuk meningkatkan budaya literasi, daya nalar, dan keterampilan merangkum melalui koleksi sastra maritim, sejarah Nusantara, sains populer, filsafat keseharian, esai pengembangan diri, hingga dongeng anak. Seluruh bab tersedia lengkap untuk dibaca langsung di ruang baca bebas gangguan.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToSection('katalog')}
                    className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A]"
                  >
                    <span>Jelajahi Katalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {recentProgressList.length > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleStartReading(
                          recentProgressList[0].book,
                          recentProgressList[0].progress.chapterIndex
                        )
                      }
                      className="px-5 py-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
                      <span>
                        Lanjutkan: {recentProgressList[0].book.title}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenBookDetail(featuredLead)}
                      className="px-5 py-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      Baca Pilihan Kurator
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyLibraryLink}
                    className="px-4 py-3 bg-transparent hover:bg-stone-200/70 text-stone-700 text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    {libraryLinkCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span className="text-emerald-800">Tautan Disalin</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        <span>Salin Tautan Perpustakaan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-sm overflow-hidden border border-stone-200 bg-[#EBE6DF]">
                  {!heroImgError ? (
                    <img
                      src={HERO_LIBRARY_IMAGE}
                      alt="Ruang baca perpustakaan Pustaka Aksara dengan rak buku kayu dan cahaya matahari pagi"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EBE6DF] to-[#DCD5C9]">
                      <BookOpen className="w-10 h-10 text-stone-500 mb-3" />
                      <p className="font-serif text-2xl text-stone-800">
                        Ruang Baca Pustaka Aksara
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        Koleksi digital terbuka sepanjang waktu
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Operational Utility Ribbon (4-column KPI strip below hero split) */}
            <div className="mt-10 pt-6 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums">
                  {allBooks.length} Judul
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  Koleksi terkurasi & kontribusi guru
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums">
                  6 Bidang Ilmu
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  Sastra, sejarah, sains, filsafat, esai, dongeng
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums">
                  {allBooks.reduce((acc, b) => acc + b.chapters.length, 0)} Bab
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  Siap dibaca langsung tanpa batas
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums">
                  {teacherBooks.length} Buku Guru
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  Ditambahkan langsung untuk kelas
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Reading Strip (visible when user has started any book) */}
        {recentProgressList.length > 0 && (
          <section className="border-b border-stone-200 bg-[#F2EFE8]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xs font-mono tracking-widest uppercase text-stone-500">
                  Sedang Anda Baca
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShelfTab('riwayat');
                    scrollToSection('rak');
                  }}
                  className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap"
                >
                  Lihat seluruh riwayat
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProgressList.slice(0, 3).map(({ book, progress }) => {
                  const pct = Math.round(
                    ((progress.completedChapters.length || 0.5) / book.chapters.length) *
                      100
                  );
                  return (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => handleStartReading(book, progress.chapterIndex)}
                      className="flex items-center gap-4 p-3.5 bg-[#F8F6F1] border border-stone-200 rounded-md text-left hover:border-stone-400 transition-colors group"
                    >
                      <div className="w-12 shrink-0">
                        <BookCover book={book} size="sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif text-base font-semibold text-stone-900 truncate group-hover:text-[#1E3A8A] transition-colors">
                          {book.title}
                        </div>
                        <div className="mt-0.5 text-xs text-stone-500 tabular-nums truncate">
                          Bab {progress.chapterIndex + 1} dari {book.chapters.length} ·{' '}
                          {pct}% selesai
                        </div>
                        <div className="mt-2 h-1 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1E3A8A]"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Pilihan Kurator (Editorial 3-Tier Showcase) */}
        <section
          ref={pilihanRef}
          className="border-b border-stone-200 bg-[#F8F6F1]"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
                  Kurasi Edisi Musim Ini
                </p>
                <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
                  Pilihan Kurator
                </h2>
              </div>
              <p className="text-sm text-stone-600 max-w-md">
                Lima judul utama dengan sampul ilustrasi khusus yang dipilih dari berbagai disiplin ilmu untuk menemani waktu baca Anda.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Tier 1: Lead Featured Book */}
              <div className="lg:col-span-5 bg-[#EBE6DF]/60 border border-stone-200 rounded-md p-6 sm:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                  <div
                    className="sm:col-span-5 cursor-pointer"
                    onClick={() => handleOpenBookDetail(featuredLead)}
                  >
                    <BookCover book={featuredLead} size="lg" />
                  </div>
                  <div className="sm:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-stone-500 tabular-nums">
                        {featuredLead.genre} · {featuredLead.year} ·{' '}
                        {featuredLead.totalReadMinutes} mnt
                      </div>
                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-stone-900 text-balance leading-tight">
                        <button
                          type="button"
                          onClick={() => handleOpenBookDetail(featuredLead)}
                          className="text-left hover:text-[#1E3A8A] transition-colors"
                        >
                          {featuredLead.title}
                        </button>
                      </h3>
                      <div className="mt-1.5 text-sm font-medium text-stone-700">
                        {featuredLead.author}
                      </div>
                      <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-4">
                        {featuredLead.synopsis}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleStartReading(featuredLead, 0)}
                        className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                      >
                        Baca Sekarang
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenBookDetail(featuredLead)}
                        className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                      >
                        Lihat Daftar Isi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier 2: Secondary Featured Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredSecondary.map((book) => {
                  const isSaved = savedIds.includes(book.id);
                  return (
                    <article
                      key={book.id}
                      className="flex gap-4 p-4 bg-white border border-stone-200 rounded-md hover:border-stone-400 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenBookDetail(book)}
                        className="w-24 sm:w-28 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded-sm"
                      >
                        <BookCover book={book} size="sm" />
                      </button>

                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] text-stone-500 tabular-nums truncate">
                            {book.genre} · {book.totalReadMinutes} mnt
                          </div>
                          <h3 className="mt-1 font-serif text-lg font-semibold text-stone-900 leading-snug line-clamp-2">
                            <button
                              type="button"
                              onClick={() => handleOpenBookDetail(book)}
                              className="text-left hover:text-[#1E3A8A] transition-colors"
                            >
                              {book.title}
                            </button>
                          </h3>
                          <p className="mt-1 text-xs text-stone-600 truncate">
                            {book.author}
                          </p>
                          <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {book.subtitle}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartReading(book, 0)}
                            className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap"
                          >
                            Baca Bab 1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSave(book.id)}
                            aria-label={
                              isSaved
                                ? `Hapus ${book.title} dari rak`
                                : `Simpan ${book.title} ke rak`
                            }
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors"
                          >
                            {isSaved ? (
                              <Check className="w-3.5 h-3.5 text-[#1E3A8A]" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Katalog Lengkap & Pencarian */}
        <section ref={katalogRef} className="border-b border-stone-200 bg-[#F8F6F1]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
                  Indeks Koleksi Perpustakaan
                </p>
                <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
                  Katalog Lengkap
                </h2>
              </div>

              {/* Search, Sort & View Mode Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenAddBook('link')}
                  className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 text-sm font-medium rounded-md inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Link2 className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                  <span>Tambah via Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddBook('manual')}
                  className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Tambah Buku</span>
                </button>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul, pengarang, atau nomor..."
                    aria-label="Cari buku dalam katalog"
                    className="w-full pl-9 pr-8 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Bersihkan pencarian"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="sr-only">
                    Urutkan buku
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="py-2 px-3 bg-white border border-stone-300 rounded-md text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    <option value="kurasi">Urutan Kurasi</option>
                    <option value="judul">Judul A–Z</option>
                    <option value="terbaru">Terbitan Terbaru</option>
                    <option value="singkat">Bacaan Tersingkat</option>
                  </select>

                  <div
                    className="flex items-center p-0.5 bg-stone-200/70 rounded-md border border-stone-200"
                    role="group"
                    aria-label="Mode tampilan katalog"
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Tampilan kisi"
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      aria-label="Tampilan daftar"
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Segmented Genre Filter Tabs */}
            <div className="mt-6 flex items-center gap-1.5 p-1 bg-[#EBE6DF] rounded-md overflow-x-auto border border-stone-200">
              {Object.values(BookGenre).map((genre) => {
                const active = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${
                      active
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {genre} ({genreCounts[genre] || 0})
                  </button>
                );
              })}
            </div>

            {/* Results summary line & Teacher collection filter */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 tabular-nums">
              <div className="flex items-center gap-4">
                <span>
                  Menampilkan {filteredBooks.length} dari {allBooks.length} koleksi
                </span>
                {teacherBooks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTeacherOnlyFilter((prev) => !prev)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      teacherOnlyFilter
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    Khusus Koleksi Guru ({teacherBooks.length})
                  </button>
                )}
              </div>
              {(selectedGenre !== BookGenre.ALL || searchQuery || teacherOnlyFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenre(BookGenre.ALL);
                    setSearchQuery('');
                    setTeacherOnlyFilter(false);
                  }}
                  className="text-[#1E3A8A] font-medium hover:underline"
                >
                  Atur ulang filter
                </button>
              )}
            </div>

            {/* Catalog Display */}
            {filteredBooks.length === 0 ? (
              <div className="mt-10 py-16 px-6 text-center bg-white border border-stone-200 rounded-md">
                <p className="font-serif text-2xl text-stone-800">
                  Tidak ada buku yang sesuai dengan pencarian Anda
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Coba gunakan kata kunci lain, lihat seluruh kategori, atau catat ringkasan jika buku tersebut Anda baca secara online di luar katalog ini.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenre(BookGenre.ALL);
                      setSearchQuery('');
                      setTeacherOnlyFilter(false);
                    }}
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-md hover:bg-[#172554] transition-colors whitespace-nowrap"
                  >
                    Tampilkan Semua Buku
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenExternalSummary()}
                    className="px-4 py-2 bg-white border border-stone-300 text-stone-900 text-sm font-medium rounded-md hover:bg-stone-100 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Catat Ringkasan Bacaan Luar</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  const isSaved = savedIds.includes(book.id);
                  const prog = progressMap[book.id];
                  return (
                    <article
                      key={book.id}
                      className="flex flex-col justify-between bg-white border border-stone-200 rounded-md p-4 hover:border-stone-400 transition-colors"
                    >
                      <div>
                        <button
                          type="button"
                          onClick={() => handleOpenBookDetail(book)}
                          className="w-full block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded-sm"
                        >
                          <BookCover book={book} size="md" />
                        </button>

                        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-stone-500 tabular-nums">
                          <span className="truncate">
                            {book.genre}
                            {book.externalUrl
                              ? ' · Tautan Digital'
                              : book.isTeacherAdded
                              ? ' · Koleksi Guru'
                              : ''}
                          </span>
                          <span className="shrink-0">
                            {(reviewsByBookId[book.id]?.length || 0) > 0
                              ? `${(
                                  reviewsByBookId[book.id].reduce(
                                    (s, r) => s + r.rating,
                                    0
                                  ) / reviewsByBookId[book.id].length
                                ).toFixed(1)} ★ · `
                              : ''}
                            {book.totalReadMinutes} mnt
                          </span>
                        </div>

                        <h3 className="mt-1.5 font-serif text-xl font-semibold text-stone-900 leading-snug line-clamp-2">
                          <button
                            type="button"
                            onClick={() => handleOpenBookDetail(book)}
                            className="text-left hover:text-[#1E3A8A] transition-colors"
                          >
                            {book.title}
                          </button>
                        </h3>

                        <p className="mt-1 text-xs font-medium text-stone-600 truncate">
                          {book.author}
                        </p>

                        <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {book.synopsis}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStartReading(book, prog ? prog.chapterIndex : 0)
                          }
                          className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap"
                        >
                          {prog ? `Lanjutkan Bab ${prog.chapterIndex + 1}` : 'Baca Buku'}
                        </button>

                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10px] text-stone-400 tabular-nums">
                            {book.chapters.length} bab
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleSave(book.id)}
                            aria-label={
                              isSaved
                                ? `Hapus ${book.title} dari rak`
                                : `Simpan ${book.title} ke rak`
                            }
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors"
                          >
                            {isSaved ? (
                              <Check className="w-3.5 h-3.5 text-[#1E3A8A]" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Editorial Archive List View (Tier 3 Pattern) */
              <div className="mt-6 bg-white border border-stone-200 rounded-md divide-y divide-stone-200">
                {filteredBooks.map((book) => {
                  const isSaved = savedIds.includes(book.id);
                  const prog = progressMap[book.id];
                  return (
                    <div
                      key={book.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleOpenBookDetail(book)}
                          className="w-14 shrink-0"
                        >
                          <BookCover book={book} size="sm" />
                        </button>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 tabular-nums">
                            <span className="font-mono text-stone-400">
                              {book.accessionNumber}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{book.genre}</span>
                            {book.isTeacherAdded && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#1E3A8A] font-medium">
                                  Koleksi Guru
                                </span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{book.year}</span>
                            <span aria-hidden="true">·</span>
                            <span>{book.chapters.length} bab</span>
                            <span aria-hidden="true">·</span>
                            <span>{book.totalReadMinutes} menit</span>
                          </div>
                          <h3 className="mt-1 font-serif text-xl font-semibold text-stone-900 truncate">
                            <button
                              type="button"
                              onClick={() => handleOpenBookDetail(book)}
                              className="hover:text-[#1E3A8A] transition-colors text-left"
                            >
                              {book.title}
                            </button>
                          </h3>
                          <p className="text-xs text-stone-600 truncate">
                            {book.author} — {book.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSave(book.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                            isSaved
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {isSaved ? 'Tersimpan' : 'Simpan'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStartReading(book, prog ? prog.chapterIndex : 0)
                          }
                          className="px-3.5 py-1.5 text-xs font-medium bg-[#1E3A8A] text-white rounded hover:bg-[#172554] transition-colors whitespace-nowrap"
                        >
                          {prog ? `Lanjutkan Bab ${prog.chapterIndex + 1}` : 'Baca'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Strip for external online reading summary */}
            <div className="mt-10 p-5 sm:p-6 bg-[#F2EFE8] border border-stone-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
                  Jurnal Literasi Lintas Sumber
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-stone-900">
                  Sudah membaca buku bacaan online di luar katalog ini?
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  Siswa dapat menuliskan judul, tautan sumber, gagasan utama, dan ringkasan dari buku elektronik atau bacaan online lain yang telah dibaca.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenExternalSummary()}
                className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Masukkan Ringkasan Bacaan Luar</span>
              </button>
            </div>
          </div>
        </section>

        {/* Rak Saya (Personal Shelf, Reading History & Notes) */}
        <section ref={rakRef} className="bg-[#F2EFE8]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-300/70">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-stone-500">
                  Arsip Pribadi Pembaca
                </p>
                <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
                  Rak Saya
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E5E0D5] rounded-md border border-stone-300/70">
                <button
                  type="button"
                  onClick={() => setShelfTab('tersimpan')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                    shelfTab === 'tersimpan'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Tersimpan ({savedBooks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShelfTab('riwayat')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                    shelfTab === 'riwayat'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Riwayat Baca ({recentProgressList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShelfTab('catatan')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                    shelfTab === 'catatan'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Catatan & Kutipan ({notes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShelfTab('ringkasan')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                    shelfTab === 'ringkasan'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Ringkasan Siswa ({summaries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShelfTab('resensi')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                    shelfTab === 'resensi'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Resensi Siswa ({reviews.length})
                </button>
              </div>
            </div>

            <div className="mt-8">
              {shelfTab === 'tersimpan' && (
                <>
                  {savedBooks.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8F6F1] border border-stone-200 rounded-md">
                      <p className="font-serif text-xl text-stone-800">
                        Rak simpanan Anda masih kosong
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Tekan ikon penanda pada buku mana pun di katalog untuk menyimpannya di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {savedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="bg-[#F8F6F1] border border-stone-200 rounded-md p-4 flex items-center gap-4"
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenBookDetail(book)}
                            className="w-16 shrink-0"
                          >
                            <BookCover book={book} size="sm" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] text-stone-500 truncate">
                              {book.genre}
                            </div>
                            <h3 className="font-serif text-base font-semibold text-stone-900 truncate">
                              <button
                                type="button"
                                onClick={() => handleOpenBookDetail(book)}
                                className="hover:text-[#1E3A8A] text-left"
                              >
                                {book.title}
                              </button>
                            </h3>
                            <p className="text-xs text-stone-500 truncate">
                              {book.author}
                            </p>
                            <div className="mt-2.5 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleStartReading(book, 0)}
                                className="text-xs font-medium text-[#1E3A8A] hover:underline"
                              >
                                Baca
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleSave(book.id)}
                                className="text-xs text-stone-500 hover:text-stone-800"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {shelfTab === 'riwayat' && (
                <>
                  {recentProgressList.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8F6F1] border border-stone-200 rounded-md">
                      <p className="font-serif text-xl text-stone-800">
                        Belum ada riwayat membaca
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Buka salah satu buku dari katalog untuk mulai melacak kemajuan bab Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#F8F6F1] border border-stone-200 rounded-md divide-y divide-stone-200">
                      {recentProgressList.map(({ book, progress }) => (
                        <div
                          key={book.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="text-xs text-stone-500 tabular-nums">
                              {book.genre} · {progress.completedChapters.length} dari{' '}
                              {book.chapters.length} bab selesai
                            </div>
                            <h3 className="mt-0.5 font-serif text-xl font-semibold text-stone-900">
                              {book.title}
                            </h3>
                            <p className="text-xs text-stone-600">
                              Terakhir di Bab {progress.chapterIndex + 1}:{' '}
                              {book.chapters[progress.chapterIndex]?.title}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartReading(book, progress.chapterIndex)
                            }
                            className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium rounded-md hover:bg-[#172554] transition-colors whitespace-nowrap self-start sm:self-center"
                          >
                            Lanjutkan Membaca
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {shelfTab === 'catatan' && (
                <>
                  {notes.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8F6F1] border border-stone-200 rounded-md">
                      <p className="font-serif text-xl text-stone-800">
                        Belum ada catatan atau kutipan tersimpan
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Saat membaca sebuah bab, gunakan panel Catatan Pembaca di sisi kanan untuk menyimpan kutipan atau pemikiran Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {notes.map((note) => {
                        const parentBook = allBooks.find(
                          (b) => b.id === note.bookId
                        );
                        return (
                          <div
                            key={note.id}
                            className="p-5 bg-[#F8F6F1] border border-stone-200 rounded-md flex flex-col justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="font-serif text-lg font-semibold text-stone-900">
                                    {parentBook?.title ?? 'Koleksi Pustaka'}
                                  </div>
                                  <div className="text-xs text-stone-500">
                                    Bab {note.chapterIndex + 1} · {note.chapterTitle}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNote(note.id)}
                                  aria-label="Hapus catatan"
                                  className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-200/60"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {note.quote && (
                                <blockquote className="mt-3 py-2 border-y border-stone-200 font-serif italic text-base text-stone-800">
                                  “{note.quote}”
                                </blockquote>
                              )}

                              <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                                {note.content}
                              </p>
                            </div>

                            {parentBook && (
                              <div className="pt-2 border-t border-stone-200/70">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartReading(parentBook, note.chapterIndex)
                                  }
                                  className="text-xs font-medium text-[#1E3A8A] hover:underline"
                                >
                                  Buka kembali bab ini
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {shelfTab === 'ringkasan' && (() => {
                const externalCount = summaries.filter(
                  (s) => s.isExternalBook || !allBooks.some((b) => b.id === s.bookId)
                ).length;
                const catalogCount = summaries.length - externalCount;
                const visibleSummaries = summaries.filter((s) => {
                  const isExt =
                    Boolean(s.isExternalBook) ||
                    !allBooks.some((b) => b.id === s.bookId);
                  if (summarySourceFilter === 'luar') return isExt;
                  if (summarySourceFilter === 'katalog') return !isExt;
                  return true;
                });

                return (
                  <div className="space-y-6">
                    {/* Action & Source Filter Header */}
                    <div className="p-4 sm:p-5 bg-[#F8F6F1] border border-stone-200 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-stone-900">
                          Arsip Ringkasan Bacaan Siswa
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                          Menghimpun ringkasan buku dari katalog perpustakaan maupun buku bacaan online dari sumber luar.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {summaries.length > 0 && (
                          <div className="inline-flex items-center p-0.5 bg-[#E5E0D5] rounded-md border border-stone-300/70">
                            <button
                              type="button"
                              onClick={() => setSummarySourceFilter('semua')}
                              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                                summarySourceFilter === 'semua'
                                  ? 'bg-white text-stone-900 shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Semua ({summaries.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setSummarySourceFilter('katalog')}
                              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                                summarySourceFilter === 'katalog'
                                  ? 'bg-white text-stone-900 shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Katalog ({catalogCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setSummarySourceFilter('luar')}
                              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap tabular-nums ${
                                summarySourceFilter === 'luar'
                                  ? 'bg-white text-stone-900 shadow-xs'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Bacaan Luar ({externalCount})
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenExternalSummary()}
                          className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-medium rounded-md inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          <Plus className="w-4 h-4 shrink-0" />
                          <span>Ringkasan Bacaan Luar</span>
                        </button>
                      </div>
                    </div>

                    {visibleSummaries.length === 0 ? (
                      <div className="p-10 text-center bg-[#F8F6F1] border border-stone-200 rounded-md">
                        <p className="font-serif text-xl text-stone-800">
                          {summaries.length === 0
                            ? 'Belum ada ringkasan buku dari siswa'
                            : 'Belum ada ringkasan pada kategori ini'}
                        </p>
                        <p className="mt-1.5 text-sm text-stone-500 max-w-lg mx-auto">
                          Buka buku dari katalog untuk merangkum bacaan perpustakaan, atau masukkan ringkasan dari buku bacaan online yang sudah kamu baca di luar katalog.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenExternalSummary()}
                          className="mt-5 px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Masukkan Ringkasan Bacaan Online</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {visibleSummaries.map((item) => {
                          const parentBook = allBooks.find(
                            (b) => b.id === item.bookId
                          );
                          const isExternal =
                            Boolean(item.isExternalBook) || !parentBook;
                          const displayTitle = isExternal
                            ? item.externalBookTitle || 'Bacaan Online Luar'
                            : parentBook?.title || 'Buku Katalog';
                          const displayAuthor = isExternal
                            ? item.externalBookAuthor
                            : parentBook?.author;

                          return (
                            <article
                              key={item.id}
                              className="p-5 bg-[#F8F6F1] border border-stone-200 rounded-md flex flex-col justify-between gap-3"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-xs text-stone-500 tabular-nums">
                                      <span className="font-medium text-stone-800">
                                        {item.studentName}
                                      </span>
                                      {item.studentClass &&
                                        ` · Kelas ${item.studentClass}`}
                                      {' · '}
                                      {item.wordCount} kata
                                      {' · '}
                                      {new Date(item.createdAt).toLocaleDateString(
                                        'id-ID',
                                        {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        }
                                      )}
                                      {isExternal && (
                                        <>
                                          {' · '}
                                          <span className="font-medium text-[#1E3A8A]">
                                            Bacaan Online Luar
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    <h3 className="mt-1 font-serif text-lg font-semibold text-stone-900">
                                      {displayTitle}
                                    </h3>

                                    <div className="mt-0.5 text-xs text-stone-600">
                                      {displayAuthor && (
                                        <span>{displayAuthor} · </span>
                                      )}
                                      {isExternal && item.externalBookGenre && (
                                        <span>{item.externalBookGenre} · </span>
                                      )}
                                      <span className="text-[#1E3A8A] font-medium">
                                        Cakupan: {item.scope}
                                      </span>
                                    </div>

                                    {isExternal && item.externalBookUrl && (
                                      <a
                                        href={item.externalBookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#1E3A8A] hover:underline break-all"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                        <span>Buka tautan bacaan sumber</span>
                                      </a>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSummary(item.id)}
                                    aria-label="Hapus ringkasan"
                                    className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-stone-200/60 shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <p className="mt-3 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                                  {item.summaryText}
                                </p>

                                {item.keyPoints.length > 0 && (
                                  <div className="mt-3 pt-2.5 border-t border-stone-200">
                                    <div className="text-xs font-semibold text-stone-800 mb-1">
                                      Poin Gagasan Utama
                                    </div>
                                    <ol className="list-decimal list-inside space-y-0.5 text-xs text-stone-600">
                                      {item.keyPoints.map((pt, idx) => (
                                        <li key={idx}>{pt}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2.5 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3">
                                {isExternal ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenExternalSummary(item)
                                    }
                                    className="text-xs font-medium text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>Sunting ringkasan</span>
                                  </button>
                                ) : parentBook ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenBookDetail(
                                        parentBook,
                                        'ringkasan',
                                        false
                                      )
                                    }
                                    className="text-xs font-medium text-[#1E3A8A] hover:underline"
                                  >
                                    Lihat & sunting di detail buku
                                  </button>
                                ) : (
                                  <span />
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopySummaryText(
                                      item,
                                      displayTitle,
                                      displayAuthor
                                    )
                                  }
                                  className="text-xs font-medium text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                                >
                                  {copiedSummaryId === item.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                                      <span className="text-emerald-800">
                                        Ringkasan disalin
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Salin ringkasan</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {shelfTab === 'resensi' && (
                <>
                  {reviews.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8F6F1] border border-stone-200 rounded-md">
                      <p className="font-serif text-xl text-stone-800">
                        Belum ada resensi buku dari siswa
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Buka buku mana saja dari katalog lalu pilih tab Resensi Siswa untuk menulis ulasan dan penilaian buku.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {reviews.map((rev) => {
                        const parentBook = allBooks.find((b) => b.id === rev.bookId);
                        return (
                          <article
                            key={rev.id}
                            className="p-5 bg-[#F8F6F1] border border-stone-200 rounded-md flex flex-col justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-xs text-stone-500 tabular-nums">
                                    <span className="font-medium text-stone-800">
                                      {rev.studentName}
                                    </span>
                                    {rev.studentClass && ` · Kelas ${rev.studentClass}`}
                                    {' · '}
                                    {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </div>
                                  <h3 className="mt-1 font-serif text-lg font-semibold text-stone-900">
                                    {rev.title}
                                  </h3>
                                  {parentBook && (
                                    <div className="text-xs text-[#1E3A8A] font-medium">
                                      Buku: {parentBook.title}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 tabular-nums">
                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                    {rev.rating}.0
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReview(rev.id)}
                                    aria-label="Hapus resensi"
                                    className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-stone-200/60"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                                {rev.content}
                              </p>

                              {rev.takeaway && (
                                <p className="mt-2.5 pt-2.5 border-t border-stone-200 text-xs text-stone-600">
                                  <span className="font-semibold text-stone-800">
                                    Pelajaran:{' '}
                                  </span>
                                  {rev.takeaway}
                                </p>
                              )}
                            </div>

                            {parentBook && (
                              <div className="pt-2 border-t border-stone-200/70">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenBookDetail(parentBook, 'resensi', false)
                                  }
                                  className="text-xs font-medium text-[#1E3A8A] hover:underline"
                                >
                                  Lihat resensi di detail buku
                                </button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#F8F6F1] border-t border-stone-200 py-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-serif text-xl font-semibold text-stone-900">
              Pustaka Aksara
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Perpustakaan digital untuk meningkatkan budaya literasi melalui sastra, sejarah, sains, filsafat, dan dongeng Nusantara.
            </p>
            <button
              type="button"
              onClick={handleCopyLibraryLink}
              className="mt-3 text-xs font-medium text-[#1E3A8A] hover:underline inline-flex items-center gap-1.5"
            >
              {libraryLinkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800">Tautan akses disalin ke papan klip</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Salin tautan akses perpustakaan</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600">
            {Object.values(BookGenre)
              .filter((g) => g !== BookGenre.ALL)
              .map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    setSelectedGenre(genre);
                    scrollToSection('katalog');
                  }}
                  className="hover:text-stone-900 hover:underline whitespace-nowrap"
                >
                  {genre}
                </button>
              ))}
          </div>
        </div>
      </footer>

      {/* Book Accession Detail Modal */}
      <BookDetailModal
        book={detailBook}
        progress={detailBook ? progressMap[detailBook.id] : undefined}
        isSaved={detailBook ? savedIds.includes(detailBook.id) : false}
        reviews={detailBook ? reviewsByBookId[detailBook.id] || [] : []}
        summaries={detailBook ? summariesByBookId[detailBook.id] || [] : []}
        initialTab={detailModalTab}
        initialReviewComposerOpen={openReviewComposerOnOpen}
        initialSummaryComposerOpen={openSummaryComposerOnOpen}
        initialSummaryScope={initialSummaryScope}
        onClose={() => {
          setDetailBook(null);
          setOpenReviewComposerOnOpen(false);
          setOpenSummaryComposerOnOpen(false);
        }}
        onStartReading={handleStartReading}
        onToggleSave={handleToggleSave}
        onEditBook={handleEditTeacherBook}
        onDeleteBook={handleDeleteTeacherBook}
        onAddReview={handleAddReview}
        onUpdateReview={handleUpdateReview}
        onDeleteReview={handleDeleteReview}
        onAddSummary={handleAddSummary}
        onUpdateSummary={handleUpdateSummary}
        onDeleteSummary={handleDeleteSummary}
      />

      {/* Teacher Add/Edit Book Modal */}
      <AddBookModal
        isOpen={isAddBookOpen}
        editingBook={editingBook}
        initialMode={addBookMode}
        nextCatalogIndex={teacherBooks.length + 1}
        onClose={() => {
          setIsAddBookOpen(false);
          setEditingBook(null);
        }}
        onSaveBook={handleSaveTeacherBook}
      />

      {/* Student External Online Book Summary Modal */}
      <ExternalSummaryModal
        isOpen={isExternalSummaryOpen}
        editingSummary={editingExternalSummary}
        onClose={() => {
          setIsExternalSummaryOpen(false);
          setEditingExternalSummary(null);
        }}
        onSaveSummary={handleSaveExternalSummary}
      />
    </div>
  );
}
