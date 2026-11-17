export enum BookGenre {
  ALL = 'Semua',
  SASTRA = 'Sastra & Fiksi',
  SEJARAH = 'Sejarah & Budaya',
  SAINS = 'Sains & Teknologi',
  FILSAFAT = 'Filsafat & Pemikiran',
  PENGEMBANGAN = 'Pengembangan Diri',
  DONGENG = 'Cerita Anak & Dongeng',
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  readMinutes: number;
  pullQuote?: string;
  paragraphs: string[];
}

export interface Book {
  id: string;
  accessionNumber: string;
  title: string;
  subtitle: string;
  author: string;
  genre: Exclude<BookGenre, BookGenre.ALL>;
  year: number;
  pages: number;
  totalReadMinutes: number;
  language: string;
  publisher: string;
  featured?: boolean;
  coverImage?: string;
  coverPalette: {
    bg: string;
    accent: string;
    text: string;
    border: string;
  };
  synopsis: string;
  chapters: Chapter[];
  isTeacherAdded?: boolean;
  externalUrl?: string;
  sourceType?: 'naskah' | 'tautan' | 'pdf';
  createdAt?: number;
}

export interface ReadingProgress {
  bookId: string;
  chapterIndex: number;
  scrollProgress: number;
  lastReadAt: number;
  completedChapters: number[];
}

export interface ReadingNote {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  content: string;
  quote?: string;
  createdAt: number;
}

export interface BookReview {
  id: string;
  bookId: string;
  studentName: string;
  studentClass: string;
  rating: number;
  title: string;
  content: string;
  takeaway?: string;
  createdAt: number;
}

export interface BookSummary {
  id: string;
  bookId: string;
  studentName: string;
  studentClass: string;
  scope: string;
  summaryText: string;
  keyPoints: string[];
  wordCount: number;
  createdAt: number;
  updatedAt?: number;
  isExternalBook?: boolean;
  externalBookTitle?: string;
  externalBookAuthor?: string;
  externalBookGenre?: Exclude<BookGenre, BookGenre.ALL>;
  externalBookUrl?: string;
}

export type ReaderTheme = 'kertas' | 'sepia' | 'malam';
export type ReaderFontSize = 'kecil' | 'sedang' | 'besar';
export type SortOption = 'kurasi' | 'judul' | 'terbaru' | 'singkat';
