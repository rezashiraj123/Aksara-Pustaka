import React, { useState, useEffect } from 'react';
import { X, Link2, Loader2, FileText } from 'lucide-react';
import { BookGenre, BookSummary } from '../types/library';

interface ExternalSummaryModalProps {
  isOpen: boolean;
  editingSummary?: BookSummary | null;
  onClose: () => void;
  onSaveSummary: (summary: BookSummary) => void;
}

const GENRE_OPTIONS = Object.values(BookGenre).filter(
  (g): g is Exclude<BookGenre, BookGenre.ALL> => g !== BookGenre.ALL
);

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const ExternalSummaryModal: React.FC<ExternalSummaryModalProps> = ({
  isOpen,
  editingSummary,
  onClose,
  onSaveSummary,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookGenre, setBookGenre] = useState<Exclude<BookGenre, BookGenre.ALL>>(
    BookGenre.SASTRA
  );
  const [bookUrl, setBookUrl] = useState('');
  const [scope, setScope] = useState('Seluruh Buku');
  const [summaryText, setSummaryText] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchHint, setFetchHint] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    setFetchHint('');
    setIsFetchingUrl(false);

    if (editingSummary) {
      setStudentName(editingSummary.studentName);
      setStudentClass(editingSummary.studentClass);
      setBookTitle(editingSummary.externalBookTitle || '');
      setBookAuthor(editingSummary.externalBookAuthor || '');
      setBookGenre(editingSummary.externalBookGenre || BookGenre.SASTRA);
      setBookUrl(editingSummary.externalBookUrl || '');
      setScope(editingSummary.scope || 'Seluruh Buku');
      setSummaryText(editingSummary.summaryText);
      setKeyPointsText(editingSummary.keyPoints.join('\n'));
    } else {
      setStudentName('');
      setStudentClass('');
      setBookTitle('');
      setBookAuthor('');
      setBookGenre(BookGenre.SASTRA);
      setBookUrl('');
      setScope('Seluruh Buku');
      setSummaryText('');
      setKeyPointsText('');
    }
  }, [isOpen, editingSummary]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFetchBookInfo = async () => {
    const raw = bookUrl.trim();
    if (!raw) {
      setErrorMsg('Tempelkan tautan bacaan online terlebih dahulu.');
      return;
    }

    try {
      new URL(raw);
    } catch {
      setErrorMsg('Format tautan tidak valid. Pastikan diawali https:// atau http://');
      return;
    }

    setErrorMsg('');
    setFetchHint('');
    setIsFetchingUrl(true);

    try {
      const res = await fetch('/api/fetch-book-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Tidak dapat mengambil info dari tautan.');
        return;
      }

      if (data.title && !bookTitle.trim()) setBookTitle(data.title);
      if (data.author && !bookAuthor.trim()) setBookAuthor(data.author);
      setFetchHint(
        data.fallback
          ? 'Tautan dicatat. Silakan lengkapi judul buku dan pengarang secara manual.'
          : 'Judul dan sumber bacaan berhasil diambil dari tautan.'
      );
    } catch {
      setFetchHint('Tautan dicatat. Silakan lengkapi judul buku secara manual.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!bookTitle.trim()) {
      setErrorMsg('Judul buku atau bacaan online yang dibaca wajib diisi.');
      return;
    }
    if (bookUrl.trim()) {
      try {
        new URL(bookUrl.trim());
      } catch {
        setErrorMsg('Format tautan bacaan tidak valid. Pastikan diawali https:// atau http://');
        return;
      }
    }
    if (summaryText.trim().length < 30) {
      setErrorMsg(
        'Tuliskan ringkasan isi bacaan minimal 30 karakter agar gagasan utamanya jelas.'
      );
      return;
    }

    const parsedPoints = keyPointsText
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(Boolean);

    const words = countWords(summaryText);

    const saved: BookSummary = {
      id:
        editingSummary?.id ||
        `sum-ext-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookId: editingSummary?.bookId || 'external-online-book',
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      scope: scope.trim() || 'Seluruh Buku',
      summaryText: summaryText.trim(),
      keyPoints: parsedPoints,
      wordCount: words,
      createdAt: editingSummary?.createdAt || Date.now(),
      updatedAt: editingSummary ? Date.now() : undefined,
      isExternalBook: true,
      externalBookTitle: bookTitle.trim(),
      externalBookAuthor: bookAuthor.trim() || 'Sumber Bacaan Online',
      externalBookGenre: bookGenre,
      externalBookUrl: bookUrl.trim() || undefined,
    };

    onSaveSummary(saved);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="external-summary-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#F8F6F1] text-stone-900 border border-stone-300 rounded-md shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F2EFE8]">
          <div>
            <span className="font-mono text-xs tracking-wider text-stone-500 uppercase">
              Jurnal Literasi Siswa · Bacaan Luar Katalog
            </span>
            <h2
              id="external-summary-modal-title"
              className="font-serif text-xl sm:text-2xl font-semibold text-stone-900"
            >
              {editingSummary
                ? 'Sunting Ringkasan Bacaan Online'
                : 'Masukkan Ringkasan Buku Bacaan Online'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir ringkasan bacaan luar"
            className="p-2 -mr-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-md bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900"
            >
              {errorMsg}
            </div>
          )}

          {/* Optional URL auto-fill */}
          <div className="p-4 bg-[#F2EFE8] border border-stone-300 rounded-md space-y-2.5">
            <label
              htmlFor="ext-book-url"
              className="block text-xs font-medium text-stone-700"
            >
              Tautan / Link Buku Bacaan Online (Opsional — bisa ambil judul otomatis)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="ext-book-url"
                type="url"
                value={bookUrl}
                onChange={(e) => setBookUrl(e.target.value)}
                placeholder="https://buku.kemdikbud.go.id/... atau link e-book / artikel yang kamu baca"
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <button
                type="button"
                disabled={isFetchingUrl}
                onClick={handleFetchBookInfo}
                className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-60 text-stone-900 text-xs font-medium rounded-md inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                {isFetchingUrl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengambil...</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span>Ambil Info</span>
                  </>
                )}
              </button>
            </div>
            {fetchHint && (
              <p className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5">
                {fetchHint}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ext-student-name"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Nama Lengkap Siswa <span className="text-red-700">*</span>
              </label>
              <input
                id="ext-student-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Nadia Azzahra"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="ext-student-class"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Kelas / Rombel
              </label>
              <input
                id="ext-student-class"
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Contoh: VIII-A atau X Merdeka 3"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="ext-book-title"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Judul Buku / Bacaan Online <span className="text-red-700">*</span>
              </label>
              <input
                id="ext-book-title"
                type="text"
                required
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Contoh: Laskar Pelangi / Mengenal Energi Terbarukan"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="ext-book-author"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Pengarang / Platform Sumber
              </label>
              <input
                id="ext-book-author"
                type="text"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                placeholder="Contoh: Andrea Hirata / Let's Read / SIBI"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="ext-book-genre"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Kategori Bidang Ilmu
              </label>
              <select
                id="ext-book-genre"
                value={bookGenre}
                onChange={(e) =>
                  setBookGenre(e.target.value as Exclude<BookGenre, BookGenre.ALL>)
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

            <div className="sm:col-span-2">
              <label
                htmlFor="ext-scope"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Bagian / Cakupan yang Diringkas
              </label>
              <input
                id="ext-scope"
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Contoh: Seluruh Buku, atau Bab 1–3, atau Halaman 1–25"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ext-summary-text"
                className="block text-xs font-medium text-stone-700"
              >
                Ringkasan Isi Bacaan (dengan kalimat sendiri){' '}
                <span className="text-red-700">*</span>
              </label>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {countWords(summaryText)} kata
              </span>
            </div>
            <textarea
              id="ext-summary-text"
              rows={5}
              required
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="Tuliskan inti cerita, informasi utama, atau gagasan penting dari buku bacaan online yang sudah kamu baca..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label
              htmlFor="ext-key-points"
              className="block text-xs font-medium text-stone-700 mb-1.5"
            >
              Poin-Poin Penting / Hal yang Dipelajari (Opsional, pisahkan dengan baris baru)
            </label>
            <textarea
              id="ext-key-points"
              rows={3}
              value={keyPointsText}
              onChange={(e) => setKeyPointsText(e.target.value)}
              placeholder={'Contoh:\nPentingnya menjaga semangat belajar walau fasilitas terbatas\nPersahabatan dan ketekunan mengalahkan rintangan'}
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-stone-500">
              Ringkasan akan tersimpan di Rak Saya pada tab Ringkasan Siswa.
            </span>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-sm font-medium rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-medium rounded-md inline-flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {editingSummary ? 'Simpan Perubahan' : 'Simpan Ringkasan'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
