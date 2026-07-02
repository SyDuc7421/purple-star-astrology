/**
 * /knowledge/[star]/[topic] — SEO landing page
 * /knowledge/[star]/[topic] — Trang landing SEO
 *
 * 14 major stars × 13 topics = 182 independent URLs
 * 14 chính tinh × 13 chủ đề = 182 URL độc lập
 * Each page contains the full 4-section STAR_DB judgment (one-line summary / core judgment / chart basis / classical source)
 * Mỗi trang chứa đầy đủ 4 phần luận giải STAR_DB (tóm tắt một dòng / luận giải cốt lõi / căn cứ lá số / nguồn gốc cổ văn)
 *
 * SEO notes:
 * Ghi chú SEO:
 *  - title contains main keyword (e.g. "Zi Wei in Ming Gong · Ni Haixia system detailed")
 *  - tiêu đề chứa từ khóa chính (ví dụ: "Tử Vi tại Mệnh Cung · Chi tiết theo hệ thống Ni Haixia")
 *  - description uses dingdiao (one-line summary)
 *  - mô tả sử dụng dingdiao (tóm tắt một dòng)
 *  - JSON-LD Article structured data
 *  - dữ liệu có cấu trúc JSON-LD Article
 *  - internal links: same star other 12 palaces + same palace other 13 stars
 *  - liên kết nội bộ: cùng sao ở 12 cung khác + cùng cung với 13 sao khác
 *  - generateStaticParams static generation, zero runtime cost
 *  - generateStaticParams tạo tĩnh, không tốn chi phí runtime
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  STAR_BRIEF_SEO,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';

// Allow dynamic params: if a star/topic combo is not in generateStaticParams list
// Cho phép tham số động: nếu tổ hợp star/topic không có trong danh sách generateStaticParams
// also allow on-demand rendering, avoiding 404s from Chinese URL encoding issues
// vẫn cho phép render theo yêu cầu, tránh lỗi 404 do vấn đề mã hóa URL tiếng Trung
export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  // URL uses pinyin slug instead of Chinese, avoiding Vercel/CDN Chinese routing edge cases
  // URL sử dụng slug pinyin thay vì tiếng Trung, tránh các trường hợp đặc biệt về định tuyến tiếng Trung trên Vercel/CDN
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) return {};

  const title = `${star} in ${data.palaceName} · ${data.topicLabel} · Ni Haixia System`;
  const description = data.parsed.dingdiao
    || `Zi Wei Dou Shu reading for ${star} in ${data.palaceName} — based on Ni Haixia Tian Ji system and classical texts Zi Wei Dou Shu Quan Ji and Gu Sui Fu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    alternates: {
      canonical: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    keywords: [
      'Zi Wei Dou Shu', 'Ni Haixia', star, data.palaceName, data.topicLabel,
      `${star}${data.palaceName}`, `${star} in ${data.palaceName}`,
      `Zi Wei Dou Shu ${star}`, 'Ni Haixia Zi Wei Dou Shu', 'Zi Wei Dou Shu Quan Ji',
    ],
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) notFound();

  // Same star, other topics
  // Cùng sao, các chủ đề khác
  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic && getKnowledge(star, t).exists);
  // Same topic, other stars
  // Cùng chủ đề, các sao khác
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star && getKnowledge(s, topic as TopicKey).exists);

  // JSON-LD
  // Dữ liệu JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${star} in ${data.palaceName} · ${data.topicLabel}`,
    description: data.parsed.dingdiao,
    author: { '@type': 'Organization', name: 'Zi Wei Research · Ni Haixia Authentic System' },
    publisher: {
      '@type': 'Organization',
      name: 'Zi Wei Research',
      url: 'https://wdyziweidoushu666.com',
    },
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    mainEntityOfPage: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    articleSection: 'Zi Wei Dou Shu · Ni Haixia System',
    keywords: ['Zi Wei Dou Shu', star, data.palaceName, data.topicLabel].join(', '),
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top bar */}
      {/* Thanh trên cùng */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← Home
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          Ni Haixia Methodology · Knowledge Base
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          Chart →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        {/* Điều hướng breadcrumb */}
        <nav style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/knowledge" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Knowledge Base</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{star}</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <span style={{ color: 'var(--ac)' }}>{data.palaceName}</span>
        </nav>

        {/* Title area */}
        {/* Khu vực tiêu đề */}
        <header style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.25em', marginBottom: '8px' }}>
            {data.topicLabel} · Ni Haixia System
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em', lineHeight: 1.2 }}>
            {star} in {data.palaceName}
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {STAR_BRIEF_SEO[star]}
            </p>
          )}
        </header>

        {/* 4 content sections */}
        {/* 4 phần nội dung */}
        {data.parsed.dingdiao && (
          <Section title="One-Line Summary" gradient>
            <p style={{ fontSize: '17px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, letterSpacing: '0.04em' }}>
              {data.parsed.dingdiao}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="Core Judgment">
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.lundian}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="Chart Basis">
            <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.yiju}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="Classical Source" minimal>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.chuchu}
            </div>
          </Section>
        )}

        {/* CTA */}
        {/* CTA — Lời kêu gọi hành động */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(212,169,72,0.15) 0%, rgba(184,146,42,0.06) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(184,146,42,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--tx-0)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
            Want to see your own chart's {data.topicLabel}?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            Enter your birth details · Ni Haixia authentic reading · AI companion learning
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
          }}>
            Cast Your Chart →
          </Link>
        </div>

        {/* Internal links: same star, other topics */}
        {/* Liên kết nội bộ: cùng sao, các chủ đề khác */}
        <Section title={`${star} — Other Palace Readings`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(184,146,42,0.25)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
                  }}
                >
                  {star} in {d.palaceName}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Internal links: same topic, other stars */}
        {/* Liên kết nội bộ: cùng chủ đề, các sao khác */}
        <Section title={`Other Stars in ${data.palaceName}`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.25)',
                  borderRadius: '999px',
                  color: 'var(--tx-2)',
                  textDecoration: 'none',
                }}
              >
                {s} in {data.palaceName}
              </Link>
            ))}
          </div>
        </Section>

        {/* Classical texts link */}
        {/* Liên kết đến cổ văn */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'rgba(184,146,42,0.04)',
          border: '1px dashed rgba(184,146,42,0.25)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', letterSpacing: '0.15em', marginBottom: '6px' }}>
            Want to read the original texts?
          </div>
          <Link href="/library" style={{ fontSize: '13px', color: 'var(--ac)', fontWeight: 500, letterSpacing: '0.1em', textDecoration: 'none' }}>
            📜 Browse Classical Texts Library — Zi Wei Dou Shu Quan Ji / Quan Shu / Gu Sui Fu →
          </Link>
        </div>
      </article>

      {/* Footer */}
      {/* Chân trang */}
      <footer style={{ borderTop: '1px solid rgba(184,146,42,0.15)', padding: '20px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
        <div style={{ marginBottom: '6px' }}>Zi Wei Research · Based on the Ni Haixia authentic system · For learning reference only</div>
        <div style={{ opacity: 0.85 }}>This platform does not constitute medical, investment, legal, or major life-decision advice</div>
      </footer>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--ac)',
        fontWeight: 600,
        letterSpacing: '0.2em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(212,169,72,0.12) 0%, rgba(184,146,42,0.04) 100%)'
          : 'white',
        border: '1px solid rgba(184,146,42,0.15)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}
