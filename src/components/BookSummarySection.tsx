import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Check } from 'lucide-react';
import { BookSummary, Chapter } from '../types/library';
import { copyTextToClipboard } from '../utils/shareLink';

interface BookSummarySectionProps {
  bookId: string;
  bookTitle: string;
  chapters: Chapter[];
  summaries: BookSummary[];
  initialComposerOpen?: boolean;
  initialScope?: string;
  onAddSummary: (summary: Omit<BookSummary, 'id' | 'createdAt'>) => void;
  onUpdateSummary: (summary: BookSummary) => void;
  onDeleteSummary: (summaryId: string) => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const BookSummarySection: React.FC<BookSummarySectionProps> = ({
  bookId,
  bookTitle,
  chapters,
  summaries,
  initialComposerOpen = false,
  initialScope = 'Seluruh Buku',
  onAddSummary,
  onUpdateSummary,
  onDeleteSummary,
}) => {
  const [isComposerOpen, setIsComposerOpen] = useState(initialComposerOpen);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [scope, setScope] = useState(initialScope);
  const [summaryText, setSummaryText] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scopeOptions = [
    'Seluruh Buku',
    ...chapters.map((ch) => `Bab ${ch.number}: ${ch.title}`),
  ];

  const resetForm = () => {
    setEditingId(null);
    setStudentName('');
    setStudentClass('');
    setScope(initialScope);
    setSummaryText('');
    setKeyPointsText('');
    setErrorMsg('');
    setIsComposerOpen(false);
  };

  const handleStartEdit = (item: BookSummary) => {
    setEditingId(item.id);
    setStudentName(item.studentName);
    setStudentClass(item.studentClass);
    setScope(item.scope);
    setSummaryText(item.summaryText);
    setKeyPointsText(item.keyPoints.join('\n'));
    setErrorMsg('');
    setIsComposerOpen(true);
  };

  const handleCopySummary = async (item: BookSummary) => {
    const formatted = [
      `Ringkasan Buku: ${bookTitle}`,
      `Bagian: ${item.scope}`,
      `Nama Siswa: ${item.studentName}${item.studentClass ? ` (Kelas ${item.studentClass})` : ''}`,
      '',
      item.summaryText,
      ...(item.keyPoints.length > 0
        ? ['', 'Poin Penting:', ...item.keyPoints.map((p, i) => `${i + 1}. ${p}`)]
        : []),
    ].join('\n');

    const ok = await copyTextToClipboard(formatted);
    if (ok) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (summaryText.trim().length < 30) {
      setErrorMsg(
        'Tuliskan ringkasan isi buku minimal 30 karakter agar gagasan utamanya tersampaikan jelas.'
      );
      return;
    }

    const parsedPoints = keyPointsText
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(Boolean);

    const words = countWords(summaryText);

    if (editingId) {
      const existing = summaries.find((s) => s.id === editingId);
      if (existing) {
        onUpdateSummary({
          ...existing,
          studentName: studentName.trim(),
          studentClass: studentClass.trim(),
          scope,
          summaryText: summaryText.trim(),
          keyPoints: parsedPoints,
          wordCount: words,
          updatedAt: Date.now(),
        });
      }
    } else {
      onAddSummary({
        bookId,
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        scope,
        summaryText: summaryText.trim(),
        keyPoints: parsedPoints,
        wordCount: words,
      });
    }
    resetForm();
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="space-y-6">
      {/* Header & trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            Ringkasan Bacaan Siswa ({summaries.length})
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {summaries.length > 0
              ? 'Daftar ringkasan isi buku dan gagasan pokok yang ditulis oleh siswa.'
              : 'Belum ada ringkasan untuk buku ini. Tuliskan inti sari bacaan Anda dengan bahasa sendiri.'}
          </p>
        </div>

        {!isComposerOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setIsComposerOpen(true);
            }}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Ringkasan</span>
          </button>
        )}
      </div>

      {/* Composer Form */}
      {isComposerOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white border border-stone-300 rounded-md space-y-4"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <h4 className="font-serif text-lg font-semibold text-stone-900">
              {editingId
                ? 'Sunting Ringkasan Buku'
                : `Buat Ringkasan untuk "${bookTitle}"`}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              Tutup
            </button>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-900"
            >
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="summary-student-name"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Nama Lengkap Siswa <span className="text-red-700">*</span>
              </label>
              <input
                id="summary-student-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Bagas Pratama"
                className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="summary-student-class"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Kelas / Rombel
              </label>
              <input
                id="summary-student-class"
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Contoh: VIII-B"
                className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="summary-scope"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Bagian yang Diringkas
              </label>
              <select
                id="summary-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                {scopeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="summary-body"
                className="block text-xs font-medium text-stone-700"
              >
                Ringkasan Isi Buku (dengan bahasa sendiri){' '}
                <span className="text-red-700">*</span>
              </label>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                {countWords(summaryText)} kata
              </span>
            </div>
            <textarea
              id="summary-body"
              rows={5}
              required
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="Ceritakan kembali alur utama, peristiwa penting, atau penjelasan pokok dari buku yang sudah kamu baca..."
              className="w-full px-3 py-2.5 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label
              htmlFor="summary-keypoints"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Poin-Poin Gagasan Utama (Opsional, pisahkan tiap poin dengan baris baru)
            </label>
            <textarea
              id="summary-keypoints"
              rows={3}
              value={keyPointsText}
              onChange={(e) => setKeyPointsText(e.target.value)}
              placeholder={'Contoh:\nTokoh utama menemukan peta kuno di ruang kapal\nPelayaran mengandalkan pembacaan arah angin dan bintang'}
              className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-md transition-colors"
            >
              {editingId ? 'Simpan Perubahan' : 'Kirim Ringkasan'}
            </button>
          </div>
        </form>
      )}

      {/* Summaries List */}
      {summaries.length > 0 && (
        <div className="space-y-4">
          {summaries.map((item) => (
            <article
              key={item.id}
              className="p-4 sm:p-5 bg-white border border-stone-200 rounded-md space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 tabular-nums">
                    <span className="font-medium text-stone-900">
                      {item.studentName}
                    </span>
                    {item.studentClass && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Kelas {item.studentClass}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{formatDate(item.createdAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.wordCount} kata</span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-[#1E3A8A]">
                    Cakupan: {item.scope}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopySummary(item)}
                    aria-label="Salin teks ringkasan"
                    title="Salin teks ringkasan"
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    aria-label="Sunting ringkasan"
                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmDeleteId(confirmDeleteId === item.id ? null : item.id)
                    }
                    aria-label="Hapus ringkasan"
                    className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {confirmDeleteId === item.id && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-xs text-red-900">
                  <span>Hapus ringkasan ini?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSummary(item.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2.5 py-1 bg-red-800 text-white rounded font-medium hover:bg-red-900"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {item.summaryText}
              </p>

              {item.keyPoints.length > 0 && (
                <div className="pt-3 border-t border-stone-100">
                  <div className="text-xs font-semibold text-stone-700 mb-1.5">
                    Poin Gagasan Utama
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
                    {item.keyPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
