'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Announcement version — change this to show the modal again to users who already dismissed it
// Phiên bản thông báo — thay đổi giá trị này để hiển thị lại popup cho những người dùng đã đóng nó
const ANNOUNCEMENT_VERSION = '2026-05-01';
const STORAGE_KEY = `announcement_seen_${ANNOUNCEMENT_VERSION}`;

export default function AnnouncementModal() {
  // Default closed; useEffect checks localStorage on the client and decides immediately.
  // Mặc định đóng; useEffect kiểm tra localStorage trên client và quyết định ngay lập tức.
  // Not seen yet → show over the homepage; already seen → don't show again.
  // Chưa xem → hiển thị đè lên trang chủ; đã xem → không hiển thị lại.
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false); // true once hydration check is complete
  // true khi kiểm tra hydration đã hoàn tất

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch { /* localStorage may be disabled, ignore */ }
    // localStorage có thể bị vô hiệu hóa, bỏ qua
    setDecided(true);
  }, []);

  // Lock body scroll when the announcement is open, to prevent scrolling behind it
  // Khóa cuộn của body khi thông báo đang mở, để ngăn cuộn phía sau nó
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* skip */ }
    // bỏ qua
  };

  if (!decided) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // No click-outside-to-close — user must press the button to proceed
          // Không đóng khi click ra ngoài — người dùng phải nhấn nút để tiếp tục
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(20,12,2,0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #fefcf6 0%, #faf3e3 100%)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: 'min(85vh, 760px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(60,30,10,0.4), 0 4px 16px rgba(60,30,10,0.2)',
              border: '1px solid rgba(184,146,42,0.25)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            }}
          >
            {/* Top decoration + close button */}
            {/* Trang trí phía trên + nút đóng */}
            <div style={{
              padding: '22px 28px 14px',
              borderBottom: '1px solid rgba(184,146,42,0.15)',
              background: 'linear-gradient(180deg, rgba(184,146,42,0.08) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#b8922a', opacity: 0.7, marginBottom: '6px' }}>
                A LETTER TO USERS
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#3d2f10', letterSpacing: '0.08em', margin: 0 }}>
                To you, using this platform
              </h2>
              <button
                onClick={close}
aria-label="Close"
                style={{
                  position: 'absolute', top: '14px', right: '16px',
                  width: '28px', height: '28px',
                  background: 'rgba(184,146,42,0.08)',
                  border: '1px solid rgba(184,146,42,0.2)',
                  borderRadius: '50%',
                  color: '#7a5e2a', fontSize: '14px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* Limited-time free banner (most important info, pinned at top) */}
            {/* Banner miễn phí có thời hạn (thông tin quan trọng nhất, ghim ở trên cùng) */}
            <div style={{
              margin: '14px 22px 0',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
              border: '1.5px dashed rgba(232,132,62,0.5)',
              borderRadius: '12px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#c45a2d', marginBottom: '4px', fontWeight: 600 }}>
                LIMITED TIME · Thank You Offer
              </div>
              <div style={{ fontSize: '14px', color: '#8b3a1a', fontWeight: 600, lineHeight: 1.6 }}>
                <span style={{ fontSize: '16px', color: '#c45a2d', fontWeight: 700 }}>May 1 — May 8</span>
                <br />
                All features + AI questions — completely free
              </div>
            </div>

            {/* Body (scrollable) */}
            {/* Nội dung (có thể cuộn) */}
            <div style={{
              padding: '18px 28px 24px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: 1.85,
              color: '#5a4a30',
              flex: 1,
            }}>
              <p style={{ margin: '0 0 12px' }}>
                Honestly, I didn't expect this much traffic.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                When I first built this platform, my intention was simple: in the AI era, take Ni Haixia's system — originally complex and high-barrier — and make it as simple, efficient, and accessible as possible.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Not everyone needs to study for years or read many books before accessing this content. We hope this platform lets people gain insights about themselves, their life stage, and their direction — in a more effortless way.
              </p>
              <p style={{
                margin: '0 0 12px',
                padding: '10px 14px',
                background: 'rgba(184,146,42,0.07)',
                borderLeft: '3px solid rgba(184,146,42,0.45)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: '#7a5e2a',
              }}>
                Ni Haixia once said: "How could humans possibly invent something completely useless?"
              </p>
              <p style={{ margin: '0 0 12px' }}>
                I've always felt this way about the Yi Jing, and it's true of Zi Wei Dou Shu as well. Their real value isn't to trap people in a fixed outcome, but to help us see our personality patterns, life lessons, and direction sooner. Only by seeing can we adjust; only by understanding can we grow.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                As for those who say &ldquo;the fact that you're reading this is itself part of your fate&rdquo; — I'll leave that without comment.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                The account was temporarily taken down by Xiaohongshu — <strong style={{ color: '#c45a2d' }}>regular updates resume from May 3.</strong>
              </p>
              <p style={{ margin: '0 0 16px', color: '#3d2f10', fontWeight: 500 }}>
                Finally, I sincerely wish everyone a growing understanding of themselves, growing love for themselves, and a growing capacity to love those around them.
              </p>
              <p style={{ margin: 0, textAlign: 'right', fontSize: '13px', color: '#7a5e2a' }}>
                — Thank you all 🙏
              </p>
            </div>

            {/* Footer button */}
            {/* Nút ở chân trang */}
            <div style={{
              padding: '14px 22px',
              borderTop: '1px solid rgba(184,146,42,0.15)',
              background: 'rgba(184,146,42,0.04)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
            }}>
              <button
                onClick={close}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #b8922a 0%, #9a7a20 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
                }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
