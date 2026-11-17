import { Book } from '../types/library';

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Utf8(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function buildLibraryShareUrl(): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function buildBookShareUrl(book: Book, chapterIndex?: number): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('buku', book.id);
  if (typeof chapterIndex === 'number' && chapterIndex >= 0) {
    url.searchParams.set('bab', String(chapterIndex + 1));
  }

  // For teacher-added books without oversized uploaded images, embed payload so students can open it directly
  if (book.isTeacherAdded) {
    try {
      const shareableBook: Book = {
        ...book,
        coverImage:
          book.coverImage && book.coverImage.length < 4000
            ? book.coverImage
            : undefined,
      };
      const encoded = toBase64Utf8(JSON.stringify(shareableBook));
      if (encoded.length < 14000) {
        url.searchParams.set('data', encoded);
      }
    } catch {
      // Fallback to ID-only link
    }
  }

  return url.toString();
}

export function decodeSharedBook(encoded: string): Book | null {
  try {
    const json = fromBase64Utf8(encoded);
    const parsed = JSON.parse(json) as Book;
    if (
      parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.chapters) &&
      parsed.chapters.length > 0
    ) {
      return {
        ...parsed,
        isTeacherAdded: true,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy textarea fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
