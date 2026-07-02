/**
 * lib/ziwei/db-analysis — open-source placeholder (interpretation content DB not open-sourced)
 * lib/ziwei/db-analysis — phần giữ chỗ mã nguồn mở (cơ sở dữ liệu nội dung luận giải không mã nguồn mở)
 *
 * The full production version contains detailed astrological judgments for
 * Phiên bản sản xuất đầy đủ chứa các luận giải chiêm tinh chi tiết cho
 * 14 major stars × 13 palace contexts (one-line summary / core judgment /
 * 14 chính tinh × 13 ngữ cảnh cung (tóm tắt một dòng / luận giải cốt lõi /
 * chart basis / classical source), which are proprietary content and not
 * cơ sở lá số / nguồn cổ thư), đây là nội dung độc quyền và không được
 * released with the chart engine. This file retains only the type definitions
 * phát hành cùng bộ máy lập lá số. Tệp này chỉ giữ lại các định nghĩa kiểu
 * and palace/topic label mappings needed by the SEO knowledge page framework
 * và ánh xạ nhãn cung/chủ đề cần thiết cho khung trang kiến thức SEO
 * (standard Zi Wei Dou Shu terminology, not proprietary content).
 * (thuật ngữ Tử Vi Đẩu Số tiêu chuẩn, không phải nội dung độc quyền).
 * STAR_DB is left empty — so the knowledge detail pages produce 0 static routes.
 * STAR_DB được để trống — nên các trang chi tiết kiến thức tạo ra 0 route tĩnh.
 *
 * The chart engine (star placement algorithm, Si Hua, pattern detection, classical
 * Bộ máy lập lá số (thuật toán an sao, Tứ Hóa, phát hiện cách cục, cổ thư)
 * texts) is fully open-source — see lib/ziwei/algorithm.ts, patterns.ts, sihua.ts, etc.
 * là hoàn toàn mã nguồn mở — xem lib/ziwei/algorithm.ts, patterns.ts, sihua.ts, v.v.
 */

export type TopicKey =
  | 'overview' | 'personality' | 'love' | 'career' | 'wealth' | 'health'
  | 'family' | 'children' | 'move' | 'friends' | 'home' | 'spirit' | 'parents';

// iztro zh-CN palace names: Ming Gong keeps the '宫' character; others do not.
// Tên cung tiếng Trung của iztro: Mệnh Cung giữ chữ '宫'; các cung khác thì không.
// '交友' (Friends) is called '仆役' in iztro.
// '交友' (Friends) được gọi là '仆役' trong iztro.
export const TOPIC_PALACE_NAME: Record<TopicKey, string> = {
  overview:    '命宫',
  personality: '命宫',
  love:        '夫妻',
  career:      '官禄',
  wealth:      '财帛',
  health:      '疾厄',
  family:      '兄弟',
  children:    '子女',
  move:        '迁移',
  friends:     '仆役',
  home:        '田宅',
  spirit:      '福德',
  parents:     '父母',
};

export const TOPIC_LABEL: Record<TopicKey, string> = {
  overview:    'Chart Overview',
  personality: 'Personality',
  love:        'Love & Marriage',
  career:      'Career',
  wealth:      'Wealth',
  health:      'Health',
  family:      'Siblings & Partnerships',
  children:    'Children',
  move:        'Travel & Relocation',
  friends:     'Relationships & Benefactors',
  home:        'Property & Real Estate',
  spirit:      'Spirituality & Fortune',
  parents:     'Parents & Elders',
};

/**
 * Interpretation content DB (detailed judgments for 14 major stars × palace contexts) —
 * Cơ sở dữ liệu nội dung luận giải (luận giải chi tiết cho 14 chính tinh × ngữ cảnh cung) —
 * proprietary content, not open-sourced.
 * nội dung độc quyền, không mã nguồn mở.
 * Left empty here; the SEO knowledge detail pages produce 0 static routes due to `exists=false`,
 * Được để trống ở đây; các trang chi tiết kiến thức SEO tạo ra 0 route tĩnh do `exists=false`,
 * but the list page framework still runs correctly.
 * nhưng khung trang danh sách vẫn hoạt động bình thường.
 */
export const STAR_DB: Record<string, unknown> = {};
