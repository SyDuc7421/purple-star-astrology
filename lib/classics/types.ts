/**
 * Classical texts query library — type definitions
 * Thư viện truy vấn cổ thư — định nghĩa kiểu dữ liệu
 *
 * Design: all texts are statically bundled as JSON (public domain, no copyright risk)
 * Thiết kế: toàn bộ văn bản được đóng gói tĩnh dưới dạng JSON (thuộc phạm vi công cộng, không có rủi ro bản quyền)
 * Loaded into memory once at Next.js startup, zero DB dependency
 * Được nạp vào bộ nhớ một lần khi Next.js khởi động, không phụ thuộc cơ sở dữ liệu
 */

export interface Paragraph {
  /** Unique paragraph id (used for anchor navigation) */
  /** Id đoạn văn duy nhất (dùng để điều hướng đến neo) */
  id: string;
  /** Paragraph index within the chapter */
  /** Chỉ số đoạn văn trong chương */
  idx: number;
  /** Original classical text */
  /** Nguyên văn cổ thư */
  text: string;
  /** Modern translation (optional, to be filled in future) */
  /** Bản dịch hiện đại (tùy chọn, sẽ được bổ sung trong tương lai) */
  translation?: string;
  /** Ni Haixia annotations (optional, with source notes) */
  /** Chú giải của Ni Haixia (tùy chọn, kèm ghi chú nguồn) */
  niNote?: string;
}

export interface Chapter {
  /** Chapter title (e.g. "Volume 1", "General Theory") */
  /** Tiêu đề chương (ví dụ: "Volume 1", "General Theory") */
  title: string;
  /** Chapter subtitle / intro (optional) */
  /** Phụ đề / phần giới thiệu chương (tùy chọn) */
  subtitle?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  /** Book title */
  /** Tiêu đề sách */
  title: string;
  /** Book slug (for URLs, e.g. 'guisuifu') */
  /** Slug của sách (dùng cho URL, ví dụ: 'guisuifu') */
  slug: string;
  /** Dynasty */
  /** Triều đại */
  dynasty: string;
  /** Author(s) (use "Unknown" or multiple names when applicable) */
  /** (Các) tác giả (dùng "Unknown" hoặc nhiều tên khi áp dụng) */
  author: string;
  /** Introduction */
  /** Giới thiệu */
  intro: string;
  /** Approximate total character count */
  /** Tổng số ký tự ước tính */
  wordCount: number;
  chapters: Chapter[];
}

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  paragraphId: string;
  /** Highlighted snippet (contains <mark> tags) */
  /** Đoạn trích được đánh dấu nổi bật (chứa thẻ <mark>) */
  snippet: string;
  /** Original text */
  /** Nguyên văn */
  text: string;
}
