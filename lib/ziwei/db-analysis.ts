/**
 * lib/ziwei/db-analysis — open-source placeholder (interpretation content DB not open-sourced)
 *
 * The full production version contains detailed astrological judgments for
 * 14 major stars × 13 palace contexts (one-line summary / core judgment /
 * chart basis / classical source), which are proprietary content and not
 * released with the chart engine. This file retains only the type definitions
 * and palace/topic label mappings needed by the SEO knowledge page framework
 * (standard Zi Wei Dou Shu terminology, not proprietary content).
 * STAR_DB is left empty — so the knowledge detail pages produce 0 static routes.
 *
 * The chart engine (star placement algorithm, Si Hua, pattern detection, classical
 * texts) is fully open-source — see lib/ziwei/algorithm.ts, patterns.ts, sihua.ts, etc.
 */

export type TopicKey =
  | 'overview' | 'personality' | 'love' | 'career' | 'wealth' | 'health'
  | 'family' | 'children' | 'move' | 'friends' | 'home' | 'spirit' | 'parents';

// iztro zh-CN palace names: Ming Gong keeps the '宫' character; others do not.
// '交友' (Friends) is called '仆役' in iztro.
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
 * proprietary content, not open-sourced.
 * Left empty here; the SEO knowledge detail pages produce 0 static routes due to `exists=false`,
 * but the list page framework still runs correctly.
 */
export const STAR_DB: Record<string, unknown> = {};
