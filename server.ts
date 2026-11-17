import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }
  const ipv4Match = lower.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }
  return false;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveTitleFromUrl(parsedUrl: URL): string {
  const segments = parsedUrl.pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || parsedUrl.hostname;
  const cleaned = decodeURIComponent(last)
    .replace(/\.(pdf|epub|html?|php|aspx)$/i, '')
    .replace(/[-_+]+/g, ' ')
    .trim();
  if (!cleaned || cleaned.length < 3) {
    return `Buku Digital (${parsedUrl.hostname})`;
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function extractMetaTag(html: string, key: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      'i'
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${key}["']`,
      'i'
    ),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }
  return '';
}

function extractParagraphsFromHtml(html: string): string[] {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ');

  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = pRegex.exec(withoutNoise)) !== null) {
    const plain = decodeHtmlEntities(match[1].replace(/<[^>]+>/g, ' '));
    if (plain.length >= 45) {
      paragraphs.push(plain);
    }
    if (paragraphs.length >= 24) break;
  }
  return paragraphs;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/fetch-book-link', async (req, res) => {
    const rawUrl = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
    if (!rawUrl) {
      res.status(400).json({ error: 'Tautan buku wajib diisi.' });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      res.status(400).json({ error: 'Format tautan tidak valid. Pastikan diawali https:// atau http://' });
      return;
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      res.status(400).json({ error: 'Hanya tautan http:// atau https:// yang didukung.' });
      return;
    }

    if (isBlockedHostname(parsedUrl.hostname)) {
      res.status(400).json({ error: 'Alamat jaringan lokal tidak diizinkan.' });
      return;
    }

    const fallbackTitle = deriveTitleFromUrl(parsedUrl);
    const isPdfByPath = /\.pdf($|\?)/i.test(parsedUrl.pathname + parsedUrl.search);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PustakaAksara/1.0)',
          Accept: 'text/html,application/xhtml+xml,text/plain,application/pdf,*/*',
        },
      });
      clearTimeout(timer);

      const contentType = (response.headers.get('content-type') || '').toLowerCase();

      if (contentType.includes('application/pdf') || isPdfByPath) {
        res.json({
          ok: true,
          sourceType: 'pdf',
          title: fallbackTitle,
          author: parsedUrl.hostname.replace(/^www\./, ''),
          publisher: parsedUrl.hostname.replace(/^www\./, ''),
          synopsis: `Dokumen buku digital (PDF) yang ditautkan dari ${parsedUrl.hostname}. Klik tombol Buka Buku Digital untuk membaca dokumen penuh atau baca ringkasan pengantar di Ruang Baca.`,
          externalUrl: response.url || parsedUrl.toString(),
          paragraphs: [
            `Buku digital ini bersumber dari dokumen eksternal pada tautan: ${response.url || parsedUrl.toString()}.`,
            'Siswa dapat membuka dokumen asli secara langsung melalui tombol Buka Buku Digital di bagian atas halaman ini, lalu kembali ke Ruang Baca untuk mencatat poin penting, menulis ringkasan, dan membuat resensi.',
          ],
        });
        return;
      }

      if (contentType.includes('text/plain')) {
        const text = await response.text();
        const lines = text
          .split(/\n\s*\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 20)
          .slice(0, 30);
        res.json({
          ok: true,
          sourceType: 'tautan',
          title: fallbackTitle,
          author: parsedUrl.hostname.replace(/^www\./, ''),
          publisher: parsedUrl.hostname.replace(/^www\./, ''),
          synopsis: lines[0]?.slice(0, 220) || `Bacaan teks digital dari ${parsedUrl.hostname}.`,
          externalUrl: response.url || parsedUrl.toString(),
          paragraphs: lines.length > 0 ? lines : [`Bacaan teks dari ${parsedUrl.toString()}.`],
        });
        return;
      }

      if (contentType.includes('text/html') || contentType.includes('application/xhtml')) {
        const html = await response.text();
        const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const ogTitle = extractMetaTag(html, 'og:title');
        const rawTitle =
          ogTitle ||
          (titleTagMatch?.[1] ? decodeHtmlEntities(titleTagMatch[1]) : '') ||
          fallbackTitle;

        const ogDesc =
          extractMetaTag(html, 'og:description') ||
          extractMetaTag(html, 'description');
        const authorMeta =
          extractMetaTag(html, 'author') ||
          extractMetaTag(html, 'article:author') ||
          parsedUrl.hostname.replace(/^www\./, '');
        const siteName =
          extractMetaTag(html, 'og:site_name') ||
          parsedUrl.hostname.replace(/^www\./, '');

        const paragraphs = extractParagraphsFromHtml(html);

        res.json({
          ok: true,
          sourceType: 'tautan',
          title: rawTitle.slice(0, 140),
          author: authorMeta.slice(0, 100),
          publisher: siteName.slice(0, 100),
          synopsis:
            ogDesc ||
            paragraphs[0]?.slice(0, 240) ||
            `Buku atau materi bacaan digital yang ditautkan dari ${siteName}.`,
          externalUrl: response.url || parsedUrl.toString(),
          paragraphs:
            paragraphs.length > 0
              ? paragraphs
              : [
                  `Materi bacaan digital ini tersedia pada tautan: ${response.url || parsedUrl.toString()}.`,
                  'Gunakan tombol Buka Buku Digital untuk melihat versi lengkap halaman aslinya, lalu catat ringkasan dan resensi Anda di Pustaka Aksara.',
                ],
        });
        return;
      }

      res.json({
        ok: true,
        sourceType: 'tautan',
        title: fallbackTitle,
        author: parsedUrl.hostname.replace(/^www\./, ''),
        publisher: parsedUrl.hostname.replace(/^www\./, ''),
        synopsis: `Sumber buku digital eksternal dari ${parsedUrl.hostname}.`,
        externalUrl: parsedUrl.toString(),
        paragraphs: [
          `Buku digital ini terhubung ke tautan sumber: ${parsedUrl.toString()}.`,
          'Buka tautan sumber untuk membaca naskah penuh, lalu gunakan Ruang Baca untuk mencatat refleksi dan ringkasan.',
        ],
      });
    } catch {
      res.json({
        ok: false,
        fallback: true,
        sourceType: isPdfByPath ? 'pdf' : 'tautan',
        title: fallbackTitle,
        author: parsedUrl.hostname.replace(/^www\./, ''),
        publisher: parsedUrl.hostname.replace(/^www\./, ''),
        synopsis: `Tautan buku digital dari ${parsedUrl.hostname}. Informasi otomatis tidak dapat diambil langsung dari situs tujuan, namun tautan tetap dapat disimpan dan dibuka oleh siswa.`,
        externalUrl: parsedUrl.toString(),
        paragraphs: [
          `Materi bacaan digital ini ditautkan dari: ${parsedUrl.toString()}.`,
          'Silakan klik tombol Buka Buku Digital untuk mengakses bahan bacaan lengkap pada sumber aslinya.',
        ],
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pustaka Aksara server running on port ${PORT}`);
  });
}

startServer();
