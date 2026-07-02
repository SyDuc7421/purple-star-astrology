/**
 * Classical texts library · home page
 * Trang chủ thư viện cổ thư
 *
 * Lists all collected classical texts + global search entry
 * Liệt kê toàn bộ cổ thư đã sưu tầm + lối vào tìm kiếm toàn cục
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';

export const metadata = {
  title: 'Ni Haixia Methodology · Classical Texts Library · Zi Wei Dou Shu Quan Ji / Quan Shu / Gu Sui Fu',
  description: 'Full-text search of authoritative Zi Wei Dou Shu classical texts: Zi Wei Dou Shu Quan Ji, Quan Shu, Gu Sui Fu — cited sources from Ni Haixia Tian Ji',
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top bar */}
      {/* Thanh trên cùng */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← Back to home
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.3em' }}>
          Classical Texts · CLASSICS
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          Chart →
        </Link>
      </div>

      {/* Hero */}
      {/* Phần giới thiệu nổi bật */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.4em' }}>NI HAI XIA · CURRICULUM</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          Ni Haixia Methodology · Classical Texts
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.1em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Authoritative full-text search of Zi Wei Dou Shu classical texts<br />
          <strong style={{ color: 'var(--ac)' }}>{ALL_BOOKS.length}</strong> classical texts · <strong style={{ color: 'var(--ac)' }}>{TOTAL_PARAGRAPHS}</strong> passages
        </p>
      </div>

      {/* Search */}
      {/* Tìm kiếm */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* Classical text list */}
      {/* Danh sách cổ thư */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                《{book.title}》
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{book.chapters.length} chapters</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} passages</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                Browse →
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        {/* Ghi chú cuối trang */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '8px' }}>
            About this library
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            All collected texts are in the public domain (Ming-dynasty editions).<br />
            Content is continuously being expanded — full editions of Zi Wei Dou Shu Quan Ji and Ni Haixia's Tian Ji citation index will be added.<br />
            Please contact us if you find any errors.
          </div>
        </div>
      </div>
    </div>
  );
}
