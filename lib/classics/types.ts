/**
 * Classical texts query library — type definitions
 *
 * Design: all texts are statically bundled as JSON (public domain, no copyright risk)
 * Loaded into memory once at Next.js startup, zero DB dependency
 */

export interface Paragraph {
  /** Unique paragraph id (used for anchor navigation) */
  id: string;
  /** Paragraph index within the chapter */
  idx: number;
  /** Original classical text */
  text: string;
  /** Modern translation (optional, to be filled in future) */
  translation?: string;
  /** Ni Haixia annotations (optional, with source notes) */
  niNote?: string;
}

export interface Chapter {
  /** Chapter title (e.g. "Volume 1", "General Theory") */
  title: string;
  /** Chapter subtitle / intro (optional) */
  subtitle?: string;
  paragraphs: Paragraph[];
}

export interface Book {
  /** Book title */
  title: string;
  /** Book slug (for URLs, e.g. 'guisuifu') */
  slug: string;
  /** Dynasty */
  dynasty: string;
  /** Author(s) (use "Unknown" or multiple names when applicable) */
  author: string;
  /** Introduction */
  intro: string;
  /** Approximate total character count */
  wordCount: number;
  chapters: Chapter[];
}

export interface SearchHit {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  paragraphId: string;
  /** Highlighted snippet (contains <mark> tags) */
  snippet: string;
  /** Original text */
  text: string;
}
