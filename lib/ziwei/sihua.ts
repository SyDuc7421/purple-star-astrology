/**
 * Si Hua utility module — mapping for birth year stem / Da Xian palace stem /
 *                         annual stem / monthly stem four-transformation
 *                         + palace-stem self-Hua detection + origin palace tracing
 *
 * Core of Ni Haixia's "Tian Ji" system:
 *   Natal Si Hua    = four transformations of the birth year's heavenly stem (static baseline)
 *   Da Xian Si Hua  = four transformations of the Da Xian palace's own stem (10-year dynamic)
 *   Liu Nian Si Hua = four transformations of the current year's stem (annual dynamic)
 *   Self-Hua        = when a palace's stem transformation falls on a star already in that palace
 *   Origin palace   = the palace whose stem triggered a given transformation ("source palace")
 */

import type { ZiweiChart, Palace, SiHua } from './types';
import { SI_HUA_TABLE, STEMS } from './constants';

// ─── 1) Get four Si Hua stars by heavenly stem index ────────────
/** Stem index 0-9 → { 禄, 权, 科, 忌 } star names */
export function getSiHuaByStem(stemIndex: number): Record<SiHua, string> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return { 禄: '', 权: '', 科: '', 忌: '' };
  return { 禄: arr[0], 权: arr[1], 科: arr[2], 忌: arr[3] };
}

/** Star name → Si Hua type (determined by a given heavenly stem) */
export function buildStarSiHuaMap(stemIndex: number): Record<string, SiHua> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return {};
  return { [arr[0]]: '禄', [arr[1]]: '权', [arr[2]]: '科', [arr[3]]: '忌' };
}

// ─── 2) Gregorian year → year pillar heavenly stem index ────────
/** Gregorian year → year pillar heavenly stem index (0=甲, ... 9=癸) */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** Gregorian year → year pillar earthly branch index (0=子, ... 11=亥) */
export function getYearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

// ─── 3) Da Xian Si Hua: use the Da Xian palace's own stem ───────
/**
 * Da Xian palace-stem four transformations
 * @param chart natal chart
 * @param dxIndex Da Xian index (chart.daXians[dxIndex])
 * @returns the four Si Hua stars for that Da Xian period
 */
export function getDaXianSiHua(
  chart: ZiweiChart,
  dxIndex: number,
): { stemIndex: number; stemName: string; transforms: Record<SiHua, string> } | null {
  const dx = chart.daXians[dxIndex];
  if (!dx) return null;
  const dxPalace = chart.palaces.find(p => p.branch === dx.palaceBranch);
  if (!dxPalace) return null;
  const stemIndex = dxPalace.stem;
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 4) Liu Nian (annual) Si Hua ────────────────────────────────
export function getLiuNianSiHua(year: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  const stemIndex = getYearStemIndex(year);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 5) Liu Yue (monthly) Si Hua (month pillar stem, derived from year stem + month) ──
/**
 * Monthly heavenly stem (Wu Hu Dun rule:
 *   甲/己 years start from 丙寅, 乙/庚 from 戊寅, 丙/辛 from 庚寅,
 *   丁/壬 from 壬寅, 戊/癸 from 甲寅)
 * month: lunar month 1-12
 */
export function getLiuYueStemIndex(yearStem: number, month: number): number {
  // Wu Hu Dun: heavenly stem of the first lunar month (Yin month)
  const startStemOfYin: Record<number, number> = {
    0: 2, 5: 2,  // 甲/己 → 丙
    1: 4, 6: 4,  // 乙/庚 → 戊
    2: 6, 7: 6,  // 丙/辛 → 庚
    3: 8, 8: 8,  // 丁/壬 → 壬
    4: 0, 9: 0,  // 戊/癸 → 甲
  };
  const yinStem = startStemOfYin[yearStem] ?? 0;
  // From Yin (first month) to the target month (1-12)
  return (yinStem + ((month - 1) % 12) + 10) % 10;
}

export function getLiuYueSiHua(yearStem: number, month: number): {
  stemIndex: number;
  stemName: string;
  transforms: Record<SiHua, string>;
} {
  const stemIndex = getLiuYueStemIndex(yearStem, month);
  return {
    stemIndex,
    stemName: STEMS[stemIndex] ?? '',
    transforms: getSiHuaByStem(stemIndex),
  };
}

// ─── 6) Palace-stem self-Hua detection ──────────────────────────
/**
 * Self-Hua: the four transformations triggered by a palace's own stem,
 * where the transformed star happens to be in that same palace.
 * e.g. palace stem is 甲 (廉/破/武/阳), if the palace contains '廉贞' as a major star,
 * that palace has a "self Hua-Lu"
 */
export interface SelfSihua {
  siHua: SiHua;        // 禄/权/科/忌 transformation type
  starName: string;    // the transformed star
}

export function detectSelfSihua(palace: Palace): SelfSihua[] {
  const transforms = getSiHuaByStem(palace.stem);
  const found: SelfSihua[] = [];
  const palaceStarNames = new Set(palace.stars.map(s => s.name));
  (['禄', '权', '科', '忌'] as SiHua[]).forEach(sh => {
    const starName = transforms[sh];
    if (starName && palaceStarNames.has(starName)) {
      found.push({ siHua: sh, starName });
    }
  });
  return found;
}

// ─── 7) Origin palace tracing ───────────────────────────────────
/**
 * Origin palace: for a given star + Si Hua type, find which palace's stem "flies" it in.
 *
 * Commonly used in Ni Haixia's system: tracing the origin palace of Hua Ji —
 * the palace whose stem triggers the Hua Ji is the root-cause palace for the issue.
 *
 * @param chart natal chart
 * @param starName the transformed star name (e.g. "太阴")
 * @param sihua   Si Hua type (e.g. "忌")
 * @returns palaces that trigger this transformation (usually one; multiple if two palaces share the same stem)
 */
export function findIncomingPalaces(
  chart: ZiweiChart,
  starName: string,
  sihua: SiHua,
): Palace[] {
  const result: Palace[] = [];
  chart.palaces.forEach(p => {
    const transforms = getSiHuaByStem(p.stem);
    if (transforms[sihua] === starName) {
      result.push(p);
    }
  });
  return result;
}

/**
 * Compute the self-Hua list for every palace in the chart
 */
export function buildAllSelfSihua(chart: ZiweiChart): Record<number, SelfSihua[]> {
  const result: Record<number, SelfSihua[]> = {};
  chart.palaces.forEach(p => {
    const list = detectSelfSihua(p);
    if (list.length > 0) result[p.branch] = list;
  });
  return result;
}

// ─── 8) Overlay: combined view of multiple Si Hua layers ────────
/**
 * Generate a combined view of a star's multi-layer Si Hua.
 * Used to display simultaneously on a palace: natal / Da Xian / Liu Nian transformations.
 * Priority: natal < Da Xian < Liu Nian (all are shown)
 */
export interface SiHuaOverlay {
  native?: SiHua;    // natal (birth year stem)
  daXian?: SiHua;    // Da Xian
  liuNian?: SiHua;   // Liu Nian (annual)
  liuYue?: SiHua;    // Liu Yue (monthly)
}

export function buildOverlayForStar(
  starName: string,
  nativeMap: Record<string, SiHua>,
  daXianMap?: Record<string, SiHua>,
  liuNianMap?: Record<string, SiHua>,
  liuYueMap?: Record<string, SiHua>,
): SiHuaOverlay {
  return {
    native: nativeMap[starName],
    daXian: daXianMap?.[starName],
    liuNian: liuNianMap?.[starName],
    liuYue: liuYueMap?.[starName],
  };
}
