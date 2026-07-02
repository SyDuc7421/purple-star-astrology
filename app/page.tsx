'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';

// ─── Scroll entrance wrapper ────────────────────────────────
// Wrapper cuộn vào khung hình (hiệu ứng xuất hiện khi cuộn trang)
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // Previous version had a 1px solid line + 12px gradient shadow — created a harsh visible border on theme switch.
  // Phiên bản trước dùng đường viền solid 1px + bóng gradient 12px — tạo viền rõ khi đổi theme.
  // Switched to a softer 24px gradient + low opacity for smoother section transitions.
  // Đã chuyển sang gradient 24px mềm hơn + độ mờ thấp để chuyển đoạn mượt hơn.
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── Theme toggle button ────────────────────────────────────
// Nút chuyển đổi theme
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  );
}

// ─── Major star data ────────────────────────────────────────
// Dữ liệu chính tinh
const STARS = [
  { name: '紫微' }, { name: '天机' }, { name: '太阳' }, { name: '武曲' },
  { name: '天同' }, { name: '廉贞' }, { name: '天府' }, { name: '太阴' },
  { name: '贪狼' }, { name: '巨门' }, { name: '天相' }, { name: '天梁' },
  { name: '七杀' }, { name: '破军' },
];

// ─── Feature modules ────────────────────────────────────────
// Các module tính năng
const FEATURES = [
  {
    tag: 'Chart Engine',
    title: 'Authentic Ni Haixia\nZi Wei Dou Shu',
    subtitle: 'No shortcuts — strictly following Ni Haixia\'s transmitted system',
    points: [
      'Na Yin Wu Xing chart generation — no online shortcut algorithms',
      'Ming Gong counted backward from birth time, Shen Gong forward — strictly aligned with teaching rules',
      '14 major stars and Si Hua calculated by the original method — fully verifiable structure',
    ],
  },
  {
    tag: 'Chart Display',
    title: 'Full 14 Major Stars\n& Si Hua',
    subtitle: 'Clear structure — see the main axes and key points at a glance',
    points: [
      'All 14 major stars placed in palaces — relationships clearly readable',
      'Support and sha stars shown on the same screen — no key info missed',
      'Miao/Wang/Li/Xian brightness tiers for quick strength identification',
      "Click any major star to see Ni Haixia's detailed interpretation of that star",
    ],
  },
  {
    tag: 'AI Reading',
    title: 'Deep Reading\nBeyond Calculation',
    subtitle: 'Ni Haixia knowledge base × Claude AI',
    points: [
      'Chart analysis: starting from the Ming Gong major star, combined with three-direction palaces, for a comprehensive personality and life-pattern judgment',
      'Six dimensions: career direction, love & marriage, wealth patterns, health cautions, family relations, children affinity',
      "Da Xian & Liu Nian tracking: current 10-year period highlights, this year's palace-specific tips and action advice",
      'Free follow-up questions: ask your chart directly — e.g. "Can I change jobs this year?" or "When is my best marriage timing?"',
    ],
  },
  {
    tag: 'Pattern Detection',
    title: 'Auto-Detect\nChart Patterns',
    subtitle: 'Discover what the star combinations reveal',
    points: [
      'Auto-identifies 11 classic patterns: Zi Fu together, Sha Po Lang, Ji Yue Tong Liang, Lian Xiang, Wu Qu Qi Sha, and more',
      'Precise detection of special patterns like Zuo You flanking Ming Gong and Ri Yue flanking, with standard Ni Haixia system interpretations',
      'Auto-flags special Si Hua entries into Ming Gong and Qian Yi Gong, highlighting life issues that need attention',
      "Patterns layered by auspiciousness level, so you can see your chart's strengths and challenges at a glance",
    ],
  },
];

// ─── 4 learning modules (timeline after hero) ──────────────
// 4 module học tập (dòng thời gian sau phần hero)
const SECTIONS = [
  {
    key: 'ziwei',
    name: '紫微',
    en: 'Zi Wei',
    desc: '14 major stars · 13 palaces · AI reading',
    status: 'ready' as const,
    when: 'May',
    icon: '◉',  // filled circle + inner dot, Zi Wei star visual
    // hình tròn đặc + chấm bên trong, biểu tượng sao Tử Vi
    note: '',
  },
  {
    key: 'tianji',
    name: '天纪',
    en: 'Tian Ji',
    desc: 'Zi Wei · Zhou Yi · Qi Men Dun Jia',
    status: 'soon' as const,
    when: 'Jun',
    icon: '⊙',  // circle + inner dot (ancient "sun"), same width as ◉
    // hình tròn + chấm bên trong ("mặt trời" cổ), cùng độ rộng với ◉
    note: '',
  },
  {
    key: 'diji',
    name: '地纪',
    en: 'Di Ji',
    desc: "Ni Haixia's unfinished work · annotated by disciples",
    status: 'soon' as const,
    when: 'Jun',
    icon: '⊞',  // square + grid (earth/field visual), same width as ⊙
    // hình vuông + lưới (biểu tượng đất/ruộng), cùng độ rộng với ⊙
    note: 'Manuscript study',
  },
  {
    key: 'renji',
    name: '人纪',
    en: 'Ren Ji',
    desc: 'Nei Jing · Shang Han · Jin Kui · Acupuncture',
    status: 'soon' as const,
    when: 'Jul',
    icon: '⊕',  // circle + cross (medicine / yin-yang), same width as ⊙/⊞
    // hình tròn + dấu cộng (y học / âm dương), cùng độ rộng với ⊙/⊞
    note: '',
  },
];

// ─── Ni Haixia core teachings ──────────────────────────────
// Các giáo lý cốt lõi của Ni Haixia
const NI_TEACHINGS = [
  {
    title: 'Ming Gong is the root, Three Directions the function',
    body: "Ni Haixia always stressed that reading a chart must start with Ming Gong. Its major stars determine a person's foundational pattern and innate character; the Three Directions (Wealth, Career, Travel) determine where they can apply themselves. The four palaces working together form the complete life picture.",
  },
  {
    title: 'Borrow stars from the opposite palace — never ignore it',
    body: "Ni Haixia's distinctive insight was the emphasis on the opposite palace. Any empty palace must be read by borrowing stars from its opposite; the palace across from Ming Gong is Qian Yi Gong, and they influence each other — a key point many beginners overlook.",
  },
  {
    title: 'Si Hua are the hands of fate',
    body: 'Stars are just the foundation; Si Hua (Hua Lu, Hua Quan, Hua Ke, Hua Ji) decide whether fortune is good or bad. The same star with Hua Lu versus Hua Ji produces completely different life trajectories. Ni Haixia repeatedly emphasized: without looking at Si Hua, a chart reading is only half complete.',
  },
  {
    title: 'Da Xian spans ten years — fortune has seasons',
    body: 'Ni Haixia divided life into 12 Da Xian periods of 10 years each. He believed that experiences differ completely depending on which Da Xian palace you are in. Knowing your current period and which stars occupy that palace is key to grasping your present fortune.',
  },
];

// ─── Theme color helper ─────────────────────────────────────
// Hàm hỗ trợ màu theme
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    // nav uses the same opaque color as bgBase to avoid color banding from semi-transparent overlays
    // nav dùng cùng màu đặc như bgBase để tránh hiện tượng dải màu (banding) từ lớp phủ bán trong suốt
    navBg:        d ? '#020810'                                : '#f5efe0',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    // Light-mode text uses cool-gray (Plan A): warm bg + cool text = no visual fatigue
    // Chế độ sáng dùng chữ xám lạnh (Phương án A): nền ấm + chữ lạnh = không gây mỏi mắt
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    textFaint:    d ? 'rgba(240,246,255,0.56)'                : '#9da4b3',
    // Cool accent (Plan B): echoes the dark-mode quan blue; used for glow / links / highlights
    // Màu nhấn lạnh (Phương án B): gợi lại màu xanh "quyền" của chế độ tối; dùng cho hiệu ứng sáng / liên kết / điểm nhấn
    accent:       d ? '#3a78d4'                               : '#3a5a82',
    accentSoft:   d ? 'rgba(58,120,212,0.18)'                 : 'rgba(58,90,130,0.10)',
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    // Light-mode glow uses actual blue/purple — adds cool-tone accent to the overall atmosphere
    // Hiệu ứng sáng ở chế độ sáng dùng xanh dương/tím thực — thêm điểm nhấn tông lạnh cho tổng thể không khí
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(58,90,130,0.06)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(96,80,140,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
  };
}

// ─── Si Hua brief descriptions ─────────────────────────────
// Mô tả ngắn gọn về Tứ Hóa
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  '化禄': { attr: 'Auspicious·Augment', brief: 'Fortune star enters the palace, boosting wealth and blessings. Things run smoothly and abilities are enhanced — the most welcome transformation star.' },
  '化权': { attr: 'Auspicious·Authority', brief: 'Power star enters the palace, governing control and leadership. Its palace is assertive and decisive; thrives in Career and Life palaces, conferring real authority.' },
  '化科': { attr: 'Auspicious·Reputation', brief: 'Prestige star enters the palace, governing reputation and benefactor affinity. Favors scholarly fame and exam luck — good for academics, exams, and public roles.' },
  '化忌': { attr: 'Inauspicious·Obstruction', brief: 'Obstacle star enters the palace, governing fixations and blockages. Its palace needs special attention — the life lesson of that palace becomes a major trial.' },
};

// ─── Major star brief descriptions ─────────────────────────
// Mô tả ngắn gọn về chính tinh
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  '紫微': { attr: 'Earth·Emperor Star', brief: 'Imperial noble star, ruling over all others. Natives carry an air of aloofness and command authority — a natural leader suited to standing alone at the top.' },
  '天机': { attr: 'Wood·Wisdom Star', brief: 'Longevity-benefiting star, governing intellect and change. Clever and resourceful with a subtle mind — suited to planning, consulting, and technical work.' },
  '太阳': { attr: 'Fire·Career Lord', brief: 'Career lord star, governing reputation and fame. Generous and image-conscious — favorable for officialdom and public service. Strong in male charts; upright and brilliant when in Miao.' },
  '武曲': { attr: 'Metal·Wealth Lord', brief: 'Wealth lord star, governing finance and decisiveness. Strong-willed and action-oriented — suited to finance, military, police, and accounting. A solitary star; benefits from late marriage.' },
  '天同': { attr: 'Water·Fortune Star', brief: 'Fortune and virtue star, governing enjoyment and social relations. Gentle-natured with excellent people skills — values quality of life, emotionally sensitive, fortune improves in later years.' },
  '廉贞': { attr: 'Fire·Talent Star', brief: 'Secondary romance star, governing talent and passion. Gifted and emotionally rich — suited to the arts and politics. Multi-talented but should guard against romantic entanglements.' },
  '天府': { attr: 'Earth·Treasury Star', brief: 'South Dipper lord star, governing treasury and savings. Steady and conservative with strong financial management — the stabilizing force of a chart, suited to finance and administration.' },
  '太阴': { attr: 'Water·Property Lord', brief: 'Property lord star, governing wealth and feminine energy. Delicate and sensitive — especially favorable for women. Benefits real estate and savings; suited to arts or service industries.' },
  '贪狼': { attr: 'Wood-Water·Romance', brief: 'Romance star governing desire and talent. Multi-talented with strong desires and an active social life — suited to art, public relations, and commerce, with excellent people skills.' },
  '巨门': { attr: 'Water·Dispute Star', brief: 'The dark star, governing eloquence and controversy. Outstanding oratory and dialectical ability — suited to law, education, and media. Establish yourself through debate; watch your words.' },
  '天相': { attr: 'Water·Seal Star', brief: 'Seal star governing assistance and official mandate. Skilled at coordination, respects etiquette, upright and law-abiding — suited to advisory, administrative, and legal roles, with good benefactor luck.' },
  '天梁': { attr: 'Earth·Shelter Star', brief: "Shelter star governing maturity and protection. Upright, steady, and compassionate — heaven's protection follows. Suited to medicine, social work, and religious fields." },
  '七杀': { attr: 'Metal-Fire·General Star', brief: 'General star governing fierceness and pioneering. Resolute character with strong drive — suited to entrepreneurship, military, police, and competitive industries. Turns misfortune to fortune.' },
  '破军': { attr: 'Water·Breaker Star', brief: "Breaker star governing change and exploration. Bold in breaking through, unafraid of change — a life of major shifts but with great determination. Suited to pioneering work, going where others haven't." },
};

// ─── Feature visual decorations ────────────────────────────
// Trang trí hình ảnh cho tính năng
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>Ni Haixia Chart Method</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Zi Wei group', stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { group: 'Tian Fu group', stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-widest mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Si Hua Stars</div>
          <div className="flex gap-2 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'What is my career fortune this year?' },
      { role: 'ai', text: 'Tian Ji Hua Lu in Ming Gong. This year\'s Da Xian runs through the Career Palace, with Zuo Fu supporting from the three-direction palaces — a benefactor aids your career. A good time to actively expand...' },
      { role: 'user', text: 'When is my love fortune at its best?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Sha Po Lang pattern', desc: 'Pioneering and ambitious', ok: true },
      { name: 'Lian Xiang pattern', desc: 'Administrative and official', ok: true },
      { name: 'Hua Ji in Ming', desc: 'Psychological themes to watch', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          Auto-identifies 11 classic patterns
        </div>
      </div>
    );
  }

  return null;
}

// ─── Home page ─────────────────────────────────────────────
// Trang chủ
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Sync body/html bg to home theme color to eliminate color bleed through semi-transparent nav
  // Đồng bộ nền body/html theo màu theme trang chủ để loại bỏ hiện tượng lem màu qua nav bán trong suốt
  // useLayoutEffect ensures sync before browser paint, preventing desync with root div transition
  // useLayoutEffect đảm bảo đồng bộ trước khi trình duyệt vẽ, tránh lệch pha với transition của div gốc
  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      {/* User announcement — full-screen on first visit, home loads after close */}
      {/* Thông báo cho người dùng — hiển thị toàn màn hình lần truy cập đầu tiên, trang chủ tải sau khi đóng */}
      <AnnouncementModal />

      <StarField />

      {/* Global glow */}
      {/* Hiệu ứng sáng toàn cục */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── Top nav ── same color as hero (c.bgBase), no blur or border, zero color banding */}
      {/* ── Thanh điều hướng trên cùng ── cùng màu với hero (c.bgBase), không làm mờ hay viền, không dải màu */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2"
        style={{
          background: c.navBg,
        }}>
        <div className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] font-medium transition-colors duration-300 flex-shrink-0"
          style={{ color: c.goldSolid }}>
          Zi Wei Chart
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.navBorder}`, color: c.textMuted }}>
            Union Chart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
            Cast Chart
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      {/* ══ PHẦN HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }} className="text-center w-full mx-auto mt-10">
          {/* Tag row */}
          {/* Hàng nhãn thẻ */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.45em] transition-colors duration-300" style={{ color: c.tagText }}>
              Zi Wei Dou Shu · Ni Haixia System
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* Main title */}
          {/* Tiêu đề chính */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{
                fontSize: 'clamp(56px, 10vw, 124px)',
                letterSpacing: '0.07em',
              }}>
              Zi Wei Chart
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}>
            Zi Wei as the gate · Heaven, Earth, Human as the path · Ni Haixia as the teacher
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}>
            AI guidance · Knowledge and action as one
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}>
            Enter your birth date and time to generate your Zi Wei Dou Shu chart — Tian Ji, Di Ji, and Ren Ji learning modules open in sequence.
          </motion.p>

          {/* CTA */}
          {/* Nút kêu gọi hành động (CTA) */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              Cast Your Chart
            </motion.button>
          </motion.div>

          {/* 14 major stars */}
          {/* 14 chính tinh */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[540px] mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
                <span className="text-[11px] tracking-wide" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Launch announcement sticky note — absolutely positioned right on desktop */}
        {/* Ghi chú thông báo ra mắt — định vị tuyệt đối bên phải trên desktop */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            right: 'clamp(2%, 6vw, 8%)',
            top: '54%',
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(196,90,45,0.18), 0 2px 6px rgba(196,90,45,0.1)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '14px' }}>5/1 — 5/8</span>
              <span> Limited-time gift</span>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              All features + AI chat
              <strong style={{ color: '#c45a2d' }}> completely free</strong>
            </div>
          </div>
        </motion.div>

        {/* Launch announcement sticky note — normal flow on mobile (centered below hero) */}
        {/* Ghi chú thông báo ra mắt — luồng hiển thị thường trên mobile (căn giữa bên dưới hero) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:hidden mx-auto mt-8 mb-2 pointer-events-none"
          style={{
            maxWidth: 'min(280px, 84vw)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #fff5e3 0%, #ffe1c0 100%)',
            border: '2px dashed rgba(232,132,62,0.45)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 6px 18px rgba(196,90,45,0.16), 0 2px 4px rgba(196,90,45,0.08)',
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px', lineHeight: 1 }}>🎁</div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              <span style={{ color: '#c45a2d', fontWeight: 700, fontSize: '13px' }}>5/1 — 5/8</span>
              <span> Limited-time gift</span>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.7, color: '#8b3a1a', fontWeight: 500 }}>
              All features + AI <strong style={{ color: '#c45a2d' }}>completely free</strong>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint (absolutely positioned, does not affect hero opacity calc) */}
        {/* Gợi ý cuộn trang (định vị tuyệt đối, không ảnh hưởng đến tính toán độ mờ của hero) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: c.scrollText }}>Explore more</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ Philosophical quote ══════════════════════════════════ */}
      {/* ══ Trích dẫn triết lý ══════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}>命</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>Fate · Fortune · Perspective</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'The meaning of glimpsing fate in advance', size: 'clamp(17px, 2.2vw, 28px)', color: 'rgba(215,228,252,0.72)', delay: 0.1 },
              { text: 'lies not in predicting the future', size: 'clamp(21px, 2.6vw, 32px)', color: 'rgba(220,232,250,0.74)', delay: 0.25 },
              { text: 'but in continuously knowing yourself', size: 'clamp(24px, 3vw, 40px)', color: 'rgba(218,230,248,0.8)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}>
              and ultimately writing your own life story
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 4 learning module timeline ══════════════════════════ */}
      {/* ══ Dòng thời gian 4 module học tập ══════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.15em]" style={{ color: c.textPrimary }}>
            Ni Haixia Methodology · Unfolding in sequence
          </div>
          <div className="text-xs lg:text-sm tracking-[0.1em]" style={{ color: c.textMuted }}>
            Starting with Zi Wei, then opening Tian Ji / Di Ji / Ren Ji modules in turn
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* Horizontal connector line (desktop only) */}
          {/* Đường nối ngang (chỉ trên desktop) */}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* Vertical connector line (mobile only) — dots sit on the line, subway-map style */}
          {/* Đường nối dọc (chỉ trên mobile) — các chấm nằm trên đường, kiểu bản đồ tàu điện ngầm */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* Node circle */}
                  {/* Vòng tròn nút */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#10b981', boxShadow: '0 2px 6px rgba(16,185,129,0.4)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* Text group: single column on mobile; stacked centered on desktop */}
                  {/* Nhóm văn bản: một cột trên mobile; xếp chồng căn giữa trên desktop */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* Top row: time label + module name + note (inline on mobile; stacked on desktop) */}
                    {/* Hàng trên: nhãn thời gian + tên module + ghi chú (cùng dòng trên mobile; xếp chồng trên desktop) */}
                    <div className="flex items-baseline gap-2 lg:flex-col lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.25em] lg:mb-1.5"
                        style={{ color: ready ? '#10b981' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.15em]"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {/* Desktop-only note (already shown inline on mobile top row) */}
                    {/* Ghi chú chỉ hiển thị trên desktop (đã hiển thị cùng dòng trên mobile) */}
                    {s.note && (
                      <div className="hidden lg:block text-[9px] tracking-[0.15em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    {/* Description */}
                    {/* Mô tả */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Feature details ══════════════════════════════════════ */}
      {/* ══ Chi tiết tính năng ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Text area */}
                {/* Khu vực văn bản */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* Visual decoration area */}
                {/* Khu vực trang trí hình ảnh */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ Heaven·Earth·Human three-part theory ═════════════════ */}
      {/* ══ Học thuyết ba phần Thiên·Địa·Nhân ═════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                天 · 地 · 人
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Ni Haixia's core view of fate: destiny is never the whole of life.<br />
                He divided the forces that shape a life into three equally important dimensions.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: '天', label: 'Innate Destiny', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Zi Wei Dou Shu reveals a person\'s innate chart pattern — star placements determined by birth time, Wu Xing number, and Ming Gong major stars. This is only one-third of fate; it is the backdrop of life, not the whole picture.', sub: 'Chart · Stars · Wu Xing' },
              { glyph: '地', label: 'Geographic Environment', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: 'Your geographic environment — city, country, feng shui layout, family background, and social structure — together form the second dimension of fate. The same chart, born in different places, can yield vastly different life experiences.', sub: 'Region · Feng Shui · Environment' },
              { glyph: '人', label: 'Human Will', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Personal will, mindset, choices, and actions are the most active force for changing fate. Ni Haixia emphasized: understanding your chart is for living better, not for waiting on fate. Improving yourself is the strongest way to break through.', sub: 'Will · Choice · Action' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                "Fate is not the whole of life — add geography and human intention, and then it is."
              </p>
              <p className="mt-2 text-[10px] tracking-widest" style={{ color: c.tagText }}>— Ni Haixia</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ Ni Haixia biography ══════════════════════════════════ */}
      {/* ══ Tiểu sử Ni Haixia ══════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Master Ni Haixia
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                One of the most influential masters of Chinese medicine and divination in the modern Chinese-speaking world<br />
                Founder of Han Tang Chinese Medical College in the US · Transmitted the "Ren Ji" and "Tian Ji" teaching systems
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Born', value: '1954', sub: 'Taiwan' },
                  { label: 'Passed', value: '2012', sub: 'Jan 31 · Age 58' },
                  { label: 'Legacy', value: 'Zi Wei Dou Shu', sub: 'Classical TCM · Yi Jing' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Biography</strong>: Ni Haixia (1954–2012) was born in Taiwan, where he studied under several renowned Chinese medicine masters in his early years, specializing in the classical formula school (<em>Shang Han Lun</em> lineage). He moved to the US in midlife to practice medicine and founded <strong>Han Tang Chinese Medical College</strong>, systematically teaching Chinese medicine and traditional divination for over twenty years. He passed away from liver cancer in Taiwan on January 31, 2012, at the age of 58.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Teaching Systems</strong>: Ni Haixia organized his life's learning into two major public teaching series. <strong>"Ren Ji"</strong> covers the <em>Zhen Jiu Da Cheng</em>, <em>Shen Nong Ben Cao Jing</em>, <em>Huang Di Nei Jing</em>, <em>Shang Han Lun</em>, and <em>Jin Kui Yao Lue</em> — the "Record of Humanity," laying a complete path for studying Chinese medicine. <strong>"Tian Ji"</strong> covers Zi Wei Dou Shu and the <em>Yi Jing</em> — the "Record of Heaven," a systematized body of divination research. Together, they represent Ni Haixia's most complete transmitted legacy.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Zi Wei Stance</strong>: Ni Haixia clearly belonged to the <strong>Southern San He school</strong> of Zi Wei Dou Shu, advocating "Ming Gong as the root, Three Directions as the function, and Si Hua as the framework." In his <em>Tian Ji</em> lectures he stated: "<em>Flying stars (Si Hua) flying here and there are too complicated — I don't do that; the great way is simple.</em>" This stance clearly distinguished him from the more complex Flying Stars school.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Scholarly Approach</strong>: Ni Haixia opposed rote memorization of mnemonics, emphasizing "understanding principles beats memorizing" and "verifiable logic beats mysticism." This approach transformed Zi Wei Dou Shu from a closed master-apprentice tradition into a systematic, verifiable, and learnable modern body of knowledge.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Contemporary Influence</strong>: Ni Haixia's lecture videos are widely circulated on Bilibili, YouTube, and major platforms — recognized by the new generation of divination and Chinese medicine enthusiasts as essential introductory material. He is not only a transmitter of Zi Wei Dou Shu, but one of the key figures who brought traditional divination and Chinese medicine into the modern knowledge ecosystem.
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  All interpretations on this platform are based on Ni Haixia's public <em>Tian Ji</em> lecture notes, the Ming-dynasty <em>Zi Wei Dou Shu Quan Shu</em>, and traditional San He school classics — provided for cultural and personal enrichment only. Ni Haixia himself has no commercial relationship with this platform.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Union chart entry ══════════════════════════════════════ */}
      {/* ══ Lối vào lá số hợp đôi ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Zi Wei Union Chart
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Enter two people's birth details — AI analyzes spouse palace interaction, Ming Gong compatibility, and three-direction palace overlap based on the Ni Haixia system,<br className="hidden md:block" />
                then provides a love-compatibility score, partnership feasibility, and the best relationship advice.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Love Compatibility Analysis', 'Business Partnership Assessment', 'Parent-Child Affinity Reading', 'Pre-marriage Compatibility Check'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-widest rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Start Union Chart Analysis
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ Final CTA ══════════════════════════════════════════════ */}
      {/* ══ Nút kêu gọi hành động cuối trang ══════════════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6" style={{ color: c.tagText }}>Begin your chart journey</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Your Zi Wei Chart<br />Awaits Your Reading
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Enter your birth date and time — your personal chart is generated in seconds,<br />
            then AI provides a deep reading following the Ni Haixia system
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Cast Chart (Free)
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Zi Wei Dou Shu Knowledge Base →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Classical Texts Library →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      {/* Chân trang */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

        {/* 4 module nav slots (live + coming soon) */}
        {/* 4 ô điều hướng module (đã hoạt động + sắp ra mắt) */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.3em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            Ni Haixia Methodology · Academic System
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.1em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] tracking-wider"
                    style={{ color: ready ? '#10b981' : c.textMuted }}>
                    {ready ? '✓ Live' : `Opens ${s.when}`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            Zi Wei Chart · Based on the Ni Haixia authentic system · For reference only — your fate is in your own hands
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            This platform is based on Chinese traditional cultural research, provided for learning reference only.<br className="sm:hidden" />
            It does not constitute medical, investment, legal, or major life-decision advice.
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Terms of Service</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
