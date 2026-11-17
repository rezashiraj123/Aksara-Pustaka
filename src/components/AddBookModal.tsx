import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  ImageOff,
  Link2,
  Loader2,
} from 'lucide-react';
import { Book, BookGenre, Chapter } from '../types/library';
import { BookCover } from './BookCover';
import { decodeSharedBook } from '../utils/shareLink';

interface AddBookModalProps {
  isOpen: boolean;
  editingBook?: Book | null;
  initialMode?: 'manual' | 'link';
  nextCatalogIndex: number;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
}

interface DraftChapter {
  id: string;
  title: string;
  pullQuote: string;
  bodyText: string;
}

const COVER_PALETTES: {
  name: string;
  palette: Book['coverPalette'];
}[] = [
  {
    name: 'Biru Lapis',
    palette: {
      bg: '#1E3A8A',
      accent: '#93C5FD',
      text: '#F8FAFC',
      border: '#1D4ED8',
    },
  },
  {
    name: 'Hijau Rimba',
    palette: {
      bg: '#14532D',
      accent: '#A7F3D0',
      text: '#ECFDF5',
      border: '#166534',
    },
  },
  {
    name: 'Perunggu Tua',
    palette: {
      bg: '#78350F',
      accent: '#FDE68A',
      text: '#FFFBEB',
      border: '#92400E',
    },
  },
  {
    name: 'Arang Klasik',
    palette: {
      bg: '#292524',
      accent: '#D6D3D1',
      text: '#FAFAF9',
      border: '#44403C',
    },
  },
  {
    name: 'Toska Dalam',
    palette: {
      bg: '#134E4A',
      accent: '#99F6E4',
      text: '#F0FDFA',
      border: '#115E59',
    },
  },
  {
    name: 'Marun Pustaka',
    palette: {
      bg: '#7F1D1D',
      accent: '#FECACA',
      text: '#FEF2F2',
      border: '#991B1B',
    },
  },
];

const GENRE_OPTIONS = Object.values(BookGenre).filter(
  (g): g is Exclude<BookGenre, BookGenre.ALL> => g !== BookGenre.ALL
);

function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 170));
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  editingBook,
  initialMode = 'manual',
  nextCatalogIndex,
  onClose,
  onSaveBook,
}) => {
  const [entryMode, setEntryMode] = useState<'manual' | 'link'>(initialMode);
  const [bookLinkInput, setBookLinkInput] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [sourceType, setSourceType] = useState<'naskah' | 'tautan' | 'pdf'>('naskah');
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [linkStatusMsg, setLinkStatusMsg] = useState('');

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Exclude<BookGenre, BookGenre.ALL>>(
    BookGenre.SASTRA
  );
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [publisher, setPublisher] = useState('Koleksi Guru Pustaka Aksara');
  const [language, setLanguage] = useState('Bahasa Indonesia');
  const [synopsis, setSynopsis] = useState('');
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [chapters, setChapters] = useState<DraftChapter[]>([
    {
      id: 'ch-1',
      title: 'Pendahuluan',
      pullQuote: '',
      bodyText: '',
    },
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    setLinkStatusMsg('');
    setIsFetchingLink(false);
    if (editingBook) {
      setEntryMode(editingBook.externalUrl ? 'link' : 'manual');
      setBookLinkInput(editingBook.externalUrl || '');
      setExternalUrl(editingBook.externalUrl || '');
      setSourceType(editingBook.sourceType || (editingBook.externalUrl ? 'tautan' : 'naskah'));
      setTitle(editingBook.title);
      setSubtitle(editingBook.subtitle);
      setAuthor(editingBook.author);
      setGenre(editingBook.genre);
      setYear(editingBook.year);
      setPublisher(editingBook.publisher);
      setLanguage(editingBook.language);
      setSynopsis(editingBook.synopsis);
      setCoverImage(editingBook.coverImage);
      const matchedPalette = COVER_PALETTES.findIndex(
        (p) => p.palette.bg === editingBook.coverPalette.bg
      );
      setSelectedPaletteIdx(matchedPalette >= 0 ? matchedPalette : 0);
      setChapters(
        editingBook.chapters.map((ch) => ({
          id: ch.id,
          title: ch.title,
          pullQuote: ch.pullQuote || '',
          bodyText: ch.paragraphs.join('\n\n'),
        }))
      );
    } else {
      setEntryMode(initialMode);
      setBookLinkInput('');
      setExternalUrl('');
      setSourceType(initialMode === 'link' ? 'tautan' : 'naskah');
      setTitle('');
      setSubtitle('');
      setAuthor('');
      setGenre(BookGenre.SASTRA);
      setYear(new Date().getFullYear());
      setPublisher('Koleksi Guru Pustaka Aksara');
      setLanguage('Bahasa Indonesia');
      setSynopsis('');
      setSelectedPaletteIdx(0);
      setCoverImage(undefined);
      setChapters([
        {
          id: `ch-${Date.now()}-1`,
          title: '',
          pullQuote: '',
          bodyText: '',
        },
      ]);
    }
  }, [isOpen, editingBook, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accessionNumber =
    editingBook?.accessionNumber ||
    `PA-GR-${String(nextCatalogIndex).padStart(3, '0')}`;

  const previewBook: Book = {
    id: editingBook?.id || 'preview',
    accessionNumber,
    title: title.trim() || 'Judul Buku Baru',
    subtitle: subtitle.trim() || 'Subjudul atau ringkasan materi bacaan',
    author: author.trim() || 'Nama Guru / Pengarang',
    genre,
    year: Number(year) || new Date().getFullYear(),
    pages: Math.max(
      12,
      chapters.reduce(
        (sum, c) =>
          sum + Math.max(4, Math.ceil(c.bodyText.trim().split(/\s+/).filter(Boolean).length / 45)),
        0
      )
    ),
    totalReadMinutes: chapters.reduce(
      (sum, c) => sum + estimateReadMinutes(c.bodyText),
      0
    ),
    language: language.trim() || 'Bahasa Indonesia',
    publisher: publisher.trim() || 'Koleksi Guru Pustaka Aksara',
    coverImage,
    coverPalette: COVER_PALETTES[selectedPaletteIdx].palette,
    synopsis: synopsis.trim(),
    chapters: [],
    isTeacherAdded: true,
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar sampul maksimal 1,5 MB agar tersimpan lancar.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `ch-${Date.now()}-${prev.length + 1}`,
        title: '',
        pullQuote: '',
        bodyText: '',
      },
    ]);
  };

  const handleRemoveChapter = (idx: number) => {
    if (chapters.length <= 1) return;
    setChapters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChapterChange = (
    idx: number,
    field: keyof Omit<DraftChapter, 'id'>,
    value: string
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === idx ? { ...ch, [field]: value } : ch))
    );
  };

  const handleFillTemplate = () => {
    setTitle('Mengenal Ekosistem Mangrove Nusantara');
    setSubtitle('Materi Bacaan Biologi & Pelestarian Pesisir untuk Pelajar');
    setAuthor('Ibu Sari Wulandari, S.Pd.');
    setGenre(BookGenre.SAINS);
    setSynopsis(
      'Buku bacaan pengayaan bagi siswa mengenai peran penting hutan bakau dalam menahan abrasi, menyerap karbon biru, serta menjadi rumah bagi beragam biota laut pesisir Indonesia.'
    );
    setSelectedPaletteIdx(1);
    setChapters([
      {
        id: `ch-${Date.now()}-1`,
        title: 'Benteng Hijau di Tepi Pantai',
        pullQuote:
          'Akar mangrove yang kokoh adalah perisai alami terbaik bagi desa-desa pesisir dari terjangan ombak besar.',
        bodyText:
          'Di sepanjang garis pantai tropis Indonesia, hutan mangrove tumbuh di perbatasan unik antara daratan dan lautan. Berbeda dengan pohon darat biasa, mangrove mampu hidup di tanah berlumpur dengan kadar garam tinggi dan pasang surut air laut yang terus berubah.\n\nSistem akar tunjang dan akar napasnya yang saling bertaut bekerja seperti jaring alami yang meredam energi gelombang laut. Dengan begitu, garis pantai terlindungi dari pengikisan atau abrasi sekaligus membantu menangkap endapan lumpur subur.\n\nBagi pelajar yang tinggal jauh dari pesisir sekalipun, memahami ekosistem mangrove mengajarkan bagaimana setiap makhluk hidup memiliki peran saling menjaga dalam keseimbangan alam.',
      },
      {
        id: `ch-${Date.now()}-2`,
        title: 'Laboratorium Kehidupan Biota Laut',
        pullQuote:
          'Menjaga satu hektare hutan bakau berarti merawat masa depan ribuan ikan, kepiting, dan burung air.',
        bodyText:
          'Di balik rimbunnya daun mangrove dan tenangnya perairan di sela akar, beraneka ragam anak ikan, udang, dan kepiting bakau berlindung dari pemangsa besar. Karena itulah mangrove sering dijuluki sebagai ruang asuhan alami bagi kekayaan laut kita.\n\nSelain menjaga keanekaragaman hayati, hutan mangrove juga menyimpan cadangan karbon hingga beberapa kali lebih banyak dibandingkan hutan daratan biasa. Menanam dan merawat bibit bakau bersama komunitas sekolah adalah langkah nyata merawat bumi.',
      },
    ]);
    setErrorMsg('');
  };

  const handleFetchFromLink = async () => {
    const raw = bookLinkInput.trim();
    if (!raw) {
      setErrorMsg('Tempelkan tautan buku digital terlebih dahulu.');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      setErrorMsg(
        'Format tautan tidak valid. Pastikan dimulai dengan https:// atau http://'
      );
      return;
    }

    setErrorMsg('');
    setLinkStatusMsg('');

    // Check if it is a Pustaka Aksara shared book link (?data=...)
    const sharedData = parsed.searchParams.get('data');
    if (sharedData) {
      const decoded = decodeSharedBook(sharedData);
      if (decoded) {
        setTitle(decoded.title);
        setSubtitle(decoded.subtitle);
        setAuthor(decoded.author);
        setGenre(decoded.genre);
        setYear(decoded.year);
        setPublisher(decoded.publisher);
        setLanguage(decoded.language);
        setSynopsis(decoded.synopsis);
        setExternalUrl(decoded.externalUrl || '');
        setSourceType(decoded.sourceType || 'naskah');
        setChapters(
          decoded.chapters.map((ch) => ({
            id: ch.id,
            title: ch.title,
            pullQuote: ch.pullQuote || '',
            bodyText: ch.paragraphs.join('\n\n'),
          }))
        );
        setLinkStatusMsg(
          'Naskah lengkap berhasil diimpor dari tautan berbagi Pustaka Aksara.'
        );
        return;
      }
    }

    setIsFetchingLink(true);
    try {
      const res = await fetch('/api/fetch-book-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: parsed.toString() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal membaca tautan buku.');
        return;
      }

      setExternalUrl(data.externalUrl || parsed.toString());
      setSourceType(data.sourceType === 'pdf' ? 'pdf' : 'tautan');
      if (data.title) setTitle(data.title);
      if (data.author) setAuthor(data.author);
      if (data.publisher) setPublisher(data.publisher);
      if (data.synopsis) setSynopsis(data.synopsis);
      if (Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
        setChapters([
          {
            id: `ch-${Date.now()}-1`,
            title: data.sourceType === 'pdf' ? 'Pengantar Buku Digital' : 'Isi Bacaan dari Tautan',
            pullQuote: '',
            bodyText: data.paragraphs.join('\n\n'),
          },
        ]);
      }

      if (data.fallback) {
        setLinkStatusMsg(
          'Tautan buku disimpan. Situs tujuan membatasi pengambilan teks otomatis, silakan lengkapi atau sunting judul & sinopsis di bawah sebelum menerbitkan.'
        );
      } else {
        setLinkStatusMsg(
          'Informasi buku digital berhasil diambil dari tautan. Tinjau kembali isinya sebelum diterbitkan ke katalog.'
        );
      }
    } catch {
      setExternalUrl(parsed.toString());
      setSourceType('tautan');
      setLinkStatusMsg(
        'Tautan sumber dicatat. Silakan lengkapi judul, pengarang, sinopsis, dan ringkasan pengantar di bawah.'
      );
    } finally {
      setIsFetchingLink(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul buku wajib diisi.');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Nama pengarang atau guru penyusun wajib diisi.');
      return;
    }
    if (!synopsis.trim()) {
      setErrorMsg('Sinopsis singkat buku wajib diisi agar siswa memahami isi bacaan.');
      return;
    }

    const formattedChapters: Chapter[] = chapters.map((ch, idx) => {
      const paragraphs = ch.bodyText
        .split(/\n\s*\n|\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      return {
        id: ch.id || `ch-${Date.now()}-${idx + 1}`,
        number: idx + 1,
        title: ch.title.trim() || `Bab ${idx + 1}`,
        readMinutes: estimateReadMinutes(ch.bodyText),
        pullQuote: ch.pullQuote.trim() || undefined,
        paragraphs,
      };
    });

    const emptyChapterIndex = formattedChapters.findIndex(
      (c) => c.paragraphs.length === 0
    );
    if (emptyChapterIndex !== -1) {
      setErrorMsg(
        `Isi bacaan pada Bab ${emptyChapterIndex + 1} belum diisi. Tuliskan minimal satu paragraf.`
      );
      return;
    }

    const totalMinutes = formattedChapters.reduce(
      (acc, c) => acc + c.readMinutes,
      0
    );

    const trimmedExternalUrl = externalUrl.trim();
    const bookToSave: Book = {
      id:
        editingBook?.id ||
        `guru-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      accessionNumber,
      title: title.trim(),
      subtitle:
        subtitle.trim() || `Materi bacaan ${genre.toLowerCase()} oleh ${author.trim()}`,
      author: author.trim(),
      genre,
      year: Number(year) || new Date().getFullYear(),
      pages: previewBook.pages,
      totalReadMinutes: totalMinutes,
      language: language.trim() || 'Bahasa Indonesia',
      publisher: publisher.trim() || 'Koleksi Guru Pustaka Aksara',
      coverImage,
      coverPalette: COVER_PALETTES[selectedPaletteIdx].palette,
      synopsis: synopsis.trim(),
      chapters: formattedChapters,
      isTeacherAdded: true,
      externalUrl: trimmedExternalUrl || undefined,
      sourceType: trimmedExternalUrl ? sourceType : 'naskah',
      createdAt: editingBook?.createdAt || Date.now(),
    };

    onSaveBook(bookToSave);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#F8F6F1] text-stone-900 border border-stone-300 rounded-md shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F2EFE8]">
          <div>
            <span className="font-mono text-xs tracking-wider text-stone-500 uppercase">
              Ruang Kontribusi Guru · {accessionNumber}
            </span>
            <h2
              id="add-book-modal-title"
              className="font-serif text-xl sm:text-2xl font-semibold text-stone-900"
            >
              {editingBook ? 'Sunting Buku Bacaan' : 'Tambah Buku Bacaan Baru'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!editingBook && (
              <button
                type="button"
                onClick={handleFillTemplate}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-[#1E3A8A] bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Muat Contoh Materi
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup formulir tambah buku"
              className="p-2 -mr-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-200/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* Segmented Entry Mode Switcher */}
          {!editingBook && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-200">
              <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded-md border border-stone-200">
                <button
                  type="button"
                  onClick={() => setEntryMode('link')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                    entryMode === 'link'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Tambah melalui Link Buku</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('manual')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                    entryMode === 'manual'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Tulis Naskah Manual</span>
                </button>
              </div>
              <span className="text-xs text-stone-500">
                {entryMode === 'link'
                  ? 'Tempel tautan PDF, portal buku digital, artikel, atau tautan berbagi Pustaka Aksara.'
                  : 'Susun naskah bacaan per bab secara langsung di sini.'}
              </span>
            </div>
          )}

          {/* Link Fetch Panel */}
          {entryMode === 'link' && (
            <div className="mb-7 p-5 bg-[#F2EFE8] border border-stone-300 rounded-md space-y-3">
              <label
                htmlFor="book-link-input"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
              >
                Tautan Buku Digital (URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="book-link-input"
                  type="url"
                  value={bookLinkInput}
                  onChange={(e) => setBookLinkInput(e.target.value)}
                  placeholder="https://buku.kemdikbud.go.id/... atau tautan PDF / artikel literasi"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
                <button
                  type="button"
                  disabled={isFetchingLink}
                  onClick={handleFetchFromLink}
                  className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-60 text-white text-xs sm:text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  {isFetchingLink ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengambil Info...</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      <span>Ambil Info Buku</span>
                    </>
                  )}
                </button>
              </div>
              {linkStatusMsg && (
                <p className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
                  {linkStatusMsg}
                </p>
              )}
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-md bg-red-50 border border-red-200 text-sm text-red-900"
            >
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Cover Preview & Appearance */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-[#EBE6DF] p-5 rounded-sm border border-stone-200">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-3">
                  Pratinjau Sampul
                </div>
                <BookCover book={previewBook} size="md" />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">
                  Warna Sampul Hardcover
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COVER_PALETTES.map((item, idx) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedPaletteIdx(idx)}
                      className={`px-2 py-1.5 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                        selectedPaletteIdx === idx
                          ? 'border-[#1E3A8A] bg-white text-stone-900 ring-1 ring-[#1E3A8A]'
                          : 'border-stone-300 bg-[#F2EFE8] text-stone-700 hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.palette.bg }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-stone-700 mb-2">
                  Unggah Gambar Sampul (Opsional)
                </span>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 rounded-md text-xs font-medium text-stone-800 inline-flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Gambar (Maks. 1,5 MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="sr-only"
                    />
                  </label>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage(undefined)}
                      title="Gunakan sampul tipografi"
                      className="p-2 bg-white border border-stone-300 hover:bg-stone-100 rounded-md text-stone-600"
                    >
                      <ImageOff className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Book Metadata & Chapters */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="book-title"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Judul Buku <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="book-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Mengenal Ekosistem Mangrove Nusantara"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="book-subtitle"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Subjudul / Keterangan Singkat
                  </label>
                  <input
                    id="book-subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Contoh: Materi Bacaan Pengayaan Kelas VII"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="book-author"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Pengarang / Guru Penyusun <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="book-author"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: Bapak Budi Santoso, M.Pd."
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="book-genre"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Kategori Bidang Ilmu
                  </label>
                  <select
                    id="book-genre"
                    value={genre}
                    onChange={(e) =>
                      setGenre(e.target.value as Exclude<BookGenre, BookGenre.ALL>)
                    }
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="book-publisher"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Penerbit / Nama Sekolah
                  </label>
                  <input
                    id="book-publisher"
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="book-year"
                      className="block text-xs font-medium text-stone-700 mb-1.5"
                    >
                      Tahun
                    </label>
                    <input
                      id="book-year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="book-lang"
                      className="block text-xs font-medium text-stone-700 mb-1.5"
                    >
                      Bahasa
                    </label>
                    <input
                      id="book-lang"
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="book-external-url"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Tautan Sumber Buku Digital (Opsional)
                  </label>
                  <input
                    id="book-external-url"
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://... (diisi otomatis saat mengambil dari link buku)"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="book-synopsis"
                    className="block text-xs font-medium text-stone-700 mb-1.5"
                  >
                    Sinopsis Buku <span className="text-red-700">*</span>
                  </label>
                  <textarea
                    id="book-synopsis"
                    rows={3}
                    required
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Tuliskan ringkasan isi buku agar siswa mendapat gambaran sebelum membaca..."
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Chapters Builder */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-stone-900">
                      Naskah Bab Bacaan ({chapters.length} Bab)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pisahkan antarparagraf dengan menekan Enter agar tampil rapi di ruang baca.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Bab</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      className="p-4 sm:p-5 bg-white border border-stone-200 rounded-md space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-medium text-[#1E3A8A] tabular-nums">
                          BAB {String(idx + 1).padStart(2, '0')} · ±{' '}
                          {estimateReadMinutes(ch.bodyText)} menit baca
                        </span>
                        {chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveChapter(idx)}
                            className="text-xs text-stone-500 hover:text-red-700 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Bab</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Judul Bab
                        </label>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) =>
                            handleChapterChange(idx, 'title', e.target.value)
                          }
                          placeholder={`Judul Bab ${idx + 1}`}
                          className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Kutipan Penting / Pesan Utama (Opsional)
                        </label>
                        <input
                          type="text"
                          value={ch.pullQuote}
                          onChange={(e) =>
                            handleChapterChange(idx, 'pullQuote', e.target.value)
                          }
                          placeholder="Kalimat sorotan yang akan ditampilkan di tengah bab..."
                          className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Isi Naskah Bacaan <span className="text-red-700">*</span>
                        </label>
                        <textarea
                          rows={6}
                          value={ch.bodyText}
                          onChange={(e) =>
                            handleChapterChange(idx, 'bodyText', e.target.value)
                          }
                          placeholder="Tuliskan atau tempel teks bacaan di sini..."
                          className="w-full px-3 py-2.5 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="mt-8 pt-5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Buku yang ditambahkan akan langsung muncul di Katalog dan dapat dibaca seluruh siswa.
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {editingBook ? 'Simpan Perubahan' : 'Terbitkan ke Katalog'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
