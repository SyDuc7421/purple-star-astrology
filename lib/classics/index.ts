/**
 * Classical texts query library — entry point
 * Thư viện truy vấn cổ thư — điểm khởi đầu
 *
 * Loads all classical text data + provides query/search API
 * Tải toàn bộ dữ liệu cổ thư + cung cấp API truy vấn/tìm kiếm
 * Data is statically bundled as JSON; zero DB dependency, zero network requests
 * Dữ liệu được đóng gói tĩnh dưới dạng JSON; không phụ thuộc DB, không cần yêu cầu mạng
 */

import type { Book, Paragraph, SearchHit } from './types';
import { guSuiFu } from './data/gusuifu';
import { ziWeiQuanJi } from './data/quanji';
import { ziWeiQuanShu } from './data/quanshu';

/** All indexed classical texts */
/** Tất cả các cổ thư đã được lập chỉ mục */
export const ALL_BOOKS: Book[] = [
  guSuiFu,
  ziWeiQuanJi,
  ziWeiQuanShu,
];

/** Total paragraph count (for homepage stats) */
/** Tổng số đoạn văn (dùng cho thống kê trang chủ) */
export const TOTAL_PARAGRAPHS = ALL_BOOKS.reduce(
  (sum, b) => sum + b.chapters.reduce((s, c) => s + c.paragraphs.length, 0),
  0,
);

/** Get book by slug */
/** Lấy sách theo slug */
export function getBookBySlug(slug: string): Book | null {
  return ALL_BOOKS.find(b => b.slug === slug) ?? null;
}

/** Get chapter by chapter index */
/** Lấy chương theo chỉ số chương */
export function getChapter(bookSlug: string, chapterIdx: number) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;
  const chapter = book.chapters[chapterIdx];
  if (!chapter) return null;
  return { book, chapter, chapterIdx };
}

/** Get paragraph by id (includes book and chapter info) */
/** Lấy đoạn văn theo id (bao gồm thông tin sách và chương) */
export function getParagraphById(id: string) {
  for (const book of ALL_BOOKS) {
    for (let i = 0; i < book.chapters.length; i++) {
      const ch = book.chapters[i];
      const p = ch.paragraphs.find(p => p.id === id);
      if (p) {
        return { book, chapter: ch, chapterIdx: i, paragraph: p };
      }
    }
  }
  return null;
}

/**
 * Full-text search
 * Tìm kiếm toàn văn
 *
 * Simple substring match (no tokenization; works for Chinese)
 * Khớp chuỗi con đơn giản (không phân tách từ; hoạt động với chữ Hán)
 * Case-insensitive; traditional/simplified conversion not yet supported
 * Không phân biệt hoa thường; chưa hỗ trợ chuyển đổi phồn thể/giản thể
 */
export function searchClassics(query: string, limit = 30): SearchHit[] {
  const q = query.trim();
  if (q.length < 1) return [];

  const hits: SearchHit[] = [];
  for (const book of ALL_BOOKS) {
    for (const chapter of book.chapters) {
      for (const p of chapter.paragraphs) {
        const idx = p.text.indexOf(q);
        if (idx < 0) continue;

        // Extract surrounding context (40 chars before and after)
        // Trích xuất ngữ cảnh xung quanh (40 ký tự trước và sau)
        const start = Math.max(0, idx - 40);
        const end = Math.min(p.text.length, idx + q.length + 40);
        const before = p.text.slice(start, idx);
        const matched = p.text.slice(idx, idx + q.length);
        const after = p.text.slice(idx + q.length, end);

        const snippet = (start > 0 ? '…' : '')
          + escapeHtml(before)
          + `<mark>${escapeHtml(matched)}</mark>`
          + escapeHtml(after)
          + (end < p.text.length ? '…' : '');

        hits.push({
          bookSlug: book.slug,
          bookTitle: book.title,
          chapterTitle: chapter.title,
          paragraphId: p.id,
          snippet,
          text: p.text,
        });

        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export type { Book, Chapter, Paragraph, SearchHit } from './types';
