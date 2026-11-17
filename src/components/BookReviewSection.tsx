import React, { useState } from 'react';
import { Star, Plus, Trash2, Pencil } from 'lucide-react';
import { BookReview } from '../types/library';

interface BookReviewSectionProps {
  bookId: string;
  bookTitle: string;
  reviews: BookReview[];
  initialComposerOpen?: boolean;
  onAddReview: (review: Omit<BookReview, 'id' | 'createdAt'>) => void;
  onUpdateReview: (review: BookReview) => void;
  onDeleteReview: (reviewId: string) => void;
}

export const BookReviewSection: React.FC<BookReviewSectionProps> = ({
  bookId,
  bookTitle,
  reviews,
  initialComposerOpen = false,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
}) => {
  const [isComposerOpen, setIsComposerOpen] = useState(initialComposerOpen);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [takeaway, setTakeaway] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const resetForm = () => {
    setEditingReviewId(null);
    setStudentName('');
    setStudentClass('');
    setRating(5);
    setTitle('');
    setContent('');
    setTakeaway('');
    setErrorMsg('');
    setIsComposerOpen(false);
  };

  const handleStartEdit = (rev: BookReview) => {
    setEditingReviewId(rev.id);
    setStudentName(rev.studentName);
    setStudentClass(rev.studentClass);
    setRating(rev.rating);
    setTitle(rev.title);
    setContent(rev.content);
    setTakeaway(rev.takeaway || '');
    setErrorMsg('');
    setIsComposerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Nama siswa wajib diisi.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Judul resensi wajib diisi.');
      return;
    }
    if (content.trim().length < 20) {
      setErrorMsg('Tuliskan ulasan resensi minimal 20 karakter agar bermakna.');
      return;
    }

    if (editingReviewId) {
      const existing = reviews.find((r) => r.id === editingReviewId);
      if (existing) {
        onUpdateReview({
          ...existing,
          studentName: studentName.trim(),
          studentClass: studentClass.trim(),
          rating,
          title: title.trim(),
          content: content.trim(),
          takeaway: takeaway.trim() || undefined,
        });
      }
    } else {
      onAddReview({
        bookId,
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        rating,
        title: title.trim(),
        content: content.trim(),
        takeaway: takeaway.trim() || undefined,
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
      {/* Header summary & trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
            Resensi Pembaca ({reviews.length})
          </div>
          {avgRating ? (
            <div className="mt-1 flex items-center gap-2 text-sm text-stone-800 tabular-nums">
              <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {avgRating} / 5
              </span>
              <span className="text-stone-400" aria-hidden="true">
                ·
              </span>
              <span className="text-stone-600">Dari {reviews.length} resensi siswa</span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-stone-500">
              Belum ada resensi untuk buku ini. Jadilah siswa pertama yang menulis ulasan.
            </p>
          )}
        </div>

        {!isComposerOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingReviewId(null);
              setIsComposerOpen(true);
            }}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Resensi</span>
          </button>
        )}
      </div>

      {/* Review Composer Form */}
      {isComposerOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white border border-stone-300 rounded-md space-y-4"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <h4 className="font-serif text-lg font-semibold text-stone-900">
              {editingReviewId
                ? 'Sunting Resensi Buku'
                : `Tulis Resensi untuk "${bookTitle}"`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="review-student-name"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Nama Lengkap Siswa <span className="text-red-700">*</span>
              </label>
              <input
                id="review-student-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Anisa Putri"
                className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="review-student-class"
                className="block text-xs font-medium text-stone-700 mb-1"
              >
                Kelas / Rombel
              </label>
              <input
                id="review-student-class"
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Contoh: VIII-A atau XI IPA 2"
                className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div>
            <span className="block text-xs font-medium text-stone-700 mb-1.5">
              Penilaian Buku
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating ?? rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    aria-label={`Beri nilai ${star} dari 5 bintang`}
                    className="p-1 rounded hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        active
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs text-stone-600 tabular-nums">
                {hoverRating ?? rating} dari 5 bintang
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="review-title"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Judul Resensi <span className="text-red-700">*</span>
            </label>
            <input
              id="review-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Petualangan yang Mengajarkan Keberanian"
              className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label
              htmlFor="review-content"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Ulasan & Kesan Membaca <span className="text-red-700">*</span>
            </label>
            <textarea
              id="review-content"
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan bagian mana yang paling menarik, gaya bahasa pengarang, atau alasan kamu merekomendasikan buku ini..."
              className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm leading-relaxed text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label
              htmlFor="review-takeaway"
              className="block text-xs font-medium text-stone-700 mb-1"
            >
              Amanat atau Pelajaran Penting (Opsional)
            </label>
            <input
              id="review-takeaway"
              type="text"
              value={takeaway}
              onChange={(e) => setTakeaway(e.target.value)}
              placeholder="Satu hal berharga yang kamu petik setelah membaca buku ini..."
              className="w-full px-3 py-2 bg-[#F8F6F1] border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
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
              {editingReviewId ? 'Simpan Perubahan' : 'Kirim Resensi'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="p-4 sm:p-5 bg-white border border-stone-200 rounded-md space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 tabular-nums">
                    <span className="font-medium text-stone-900">
                      {rev.studentName}
                    </span>
                    {rev.studentClass && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Kelas {rev.studentClass}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{formatDate(rev.createdAt)}</span>
                  </div>
                  <h4 className="mt-1 font-serif text-lg font-semibold text-stone-900">
                    {rev.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div
                    className="inline-flex items-center gap-0.5 mr-2 text-xs font-medium text-stone-800 tabular-nums"
                    aria-label={`Nilai ${rev.rating} dari 5 bintang`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{rev.rating}.0</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(rev)}
                    aria-label="Sunting resensi"
                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmDeleteId(confirmDeleteId === rev.id ? null : rev.id)
                    }
                    aria-label="Hapus resensi"
                    className="p-1.5 text-stone-400 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {confirmDeleteId === rev.id && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-xs text-red-900">
                  <span>Hapus resensi ini?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteReview(rev.id);
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

              <p className="text-sm text-stone-700 leading-relaxed">{rev.content}</p>

              {rev.takeaway && (
                <div className="pt-2.5 mt-2.5 border-t border-stone-100 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Pelajaran yang dipetik: </span>
                  {rev.takeaway}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
