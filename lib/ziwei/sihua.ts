/**
 * Si Hua utility module — mapping for birth year stem / Da Xian palace stem /
 * Module tiện ích Tứ Hóa — ánh xạ cho can năm sinh / can cung Đại Hạn /
 *                         annual stem / monthly stem four-transformation
 *                         can lưu niên / can lưu nguyệt tứ hóa
 *                         + palace-stem self-Hua detection + origin palace tracing
 *                         + phát hiện tự hóa theo can cung + truy tìm cung gốc
 *
 * Core of Ni Haixia's "Tian Ji" system:
 * Cốt lõi hệ thống "Tian Ji" của Ni Haixia:
 *   Natal Si Hua    = four transformations of the birth year's heavenly stem (static baseline)
 *   Tứ Hóa Bản Mệnh = tứ hóa của can năm sinh (nền tảng tĩnh)
 *   Da Xian Si Hua  = four transformations of the Da Xian palace's own stem (10-year dynamic)
 *   Tứ Hóa Đại Hạn  = tứ hóa của can cung Đại Hạn (biến động theo chu kỳ 10 năm)
 *   Liu Nian Si Hua = four transformations of the current year's stem (annual dynamic)
 *   Tứ Hóa Lưu Niên = tứ hóa của can năm hiện tại (biến động theo năm)
 *   Self-Hua        = when a palace's stem transformation falls on a star already in that palace
 *   Tự Hóa          = khi tứ hóa của can cung rơi vào một sao đã có sẵn trong chính cung đó
 *   Origin palace   = the palace whose stem triggered a given transformation ("source palace")
 *   Cung gốc        = cung có can kích hoạt một hóa diệu nhất định ("cung nguồn")
 */

import type { ZiweiChart, Palace, SiHua } from './types';
import { SI_HUA_TABLE, STEMS } from './constants';

// ─── 1) Get four Si Hua stars by heavenly stem index ────────────
// ─── 1) Lấy bốn sao Tứ Hóa theo chỉ số can ────────────
/** Stem index 0-9 → { 禄, 权, 科, 忌 } star names */
/** Chỉ số can 0-9 → tên sao { 禄 (Lộc), 权 (Quyền), 科 (Khoa), 忌 (Kỵ) } */
export function getSiHuaByStem(stemIndex: number): Record<SiHua, string> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return { 禄: '', 权: '', 科: '', 忌: '' };
  return { 禄: arr[0], 权: arr[1], 科: arr[2], 忌: arr[3] };
}

/** Star name → Si Hua type (determined by a given heavenly stem) */
/** Tên sao → loại Tứ Hóa (được xác định bởi một can cụ thể) */
export function buildStarSiHuaMap(stemIndex: number): Record<string, SiHua> {
  const arr = SI_HUA_TABLE[stemIndex];
  if (!arr) return {};
  return { [arr[0]]: '禄', [arr[1]]: '权', [arr[2]]: '科', [arr[3]]: '忌' };
}

// ─── 2) Gregorian year → year pillar heavenly stem index ────────
// ─── 2) Năm dương lịch → chỉ số can của trụ năm ────────
/** Gregorian year → year pillar heavenly stem index (0=甲, ... 9=癸) */
/** Năm dương lịch → chỉ số can của trụ năm (0=甲/Giáp, ... 9=癸/Quý) */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** Gregorian year → year pillar earthly branch index (0=子, ... 11=亥) */
/** Năm dương lịch → chỉ số chi của trụ năm (0=子/Tý, ... 11=亥/Hợi) */
export function getYearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

// ─── 3) Da Xian Si Hua: use the Da Xian palace's own stem ───────
// ─── 3) Tứ Hóa Đại Hạn: dùng chính can của cung Đại Hạn ───────
/**
 * Da Xian palace-stem four transformations
 * Tứ hóa theo can của cung Đại Hạn
 * @param chart natal chart
 * @param chart lá số gốc
 * @param dxIndex Da Xian index (chart.daXians[dxIndex])
 * @param dxIndex chỉ số Đại Hạn (chart.daXians[dxIndex])
 * @returns the four Si Hua stars for that Da Xian period
 * @returns bốn sao Tứ Hóa của giai đoạn Đại Hạn đó
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
// ─── 4) Tứ Hóa Lưu Niên (hàng năm) ────────────────────────────────
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
// ─── 5) Tứ Hóa Lưu Nguyệt (hàng tháng) (can trụ tháng, suy ra từ can năm + tháng) ──
/**
 * Monthly heavenly stem (Wu Hu Dun rule:
 * Can của tháng (theo quy tắc Ngũ Hổ Độn:
 *   甲/己 years start from 丙寅, 乙/庚 from 戊寅, 丙/辛 from 庚寅,
 *   năm 甲/己 bắt đầu từ 丙寅, 乙/庚 từ 戊寅, 丙/辛 từ 庚寅,
 *   丁/壬 from 壬寅, 戊/癸 from 甲寅)
 *   丁/壬 từ 壬寅, 戊/癸 từ 甲寅)
 * month: lunar month 1-12
 * month: tháng âm lịch 1-12
 */
export function getLiuYueStemIndex(yearStem: number, month: number): number {
  // Wu Hu Dun: heavenly stem of the first lunar month (Yin month)
  // Ngũ Hổ Độn: can của tháng âm lịch đầu tiên (tháng Dần)
  const startStemOfYin: Record<number, number> = {
    0: 2, 5: 2,  // 甲/己 → 丙
    // Giáp/Kỷ → Bính
    1: 4, 6: 4,  // 乙/庚 → 戊
    // Ất/Canh → Mậu
    2: 6, 7: 6,  // 丙/辛 → 庚
    // Bính/Tân → Canh
    3: 8, 8: 8,  // 丁/壬 → 壬
    // Đinh/Nhâm → Nhâm
    4: 0, 9: 0,  // 戊/癸 → 甲
    // Mậu/Quý → Giáp
  };
  const yinStem = startStemOfYin[yearStem] ?? 0;
  // From Yin (first month) to the target month (1-12)
  // Từ tháng Dần (tháng đầu tiên) đến tháng mục tiêu (1-12)
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
// ─── 6) Phát hiện Tự Hóa theo can cung ──────────────────────────
/**
 * Self-Hua: the four transformations triggered by a palace's own stem,
 * Tự Hóa: tứ hóa được kích hoạt bởi chính can của cung đó,
 * where the transformed star happens to be in that same palace.
 * mà ngôi sao được hóa lại đúng nằm trong chính cung ấy.
 * e.g. palace stem is 甲 (廉/破/武/阳), if the palace contains '廉贞' as a major star,
 * ví dụ: can cung là 甲/Giáp (廉/破/武/阳), nếu cung có chứa '廉贞' (Liêm Trinh) là chính tinh,
 * that palace has a "self Hua-Lu"
 * thì cung đó có "Tự Hóa Lộc"
 */
export interface SelfSihua {
  siHua: SiHua;        // 禄/权/科/忌 transformation type
  // loại tứ hóa 禄(Lộc)/权(Quyền)/科(Khoa)/忌(Kỵ)
  starName: string;    // the transformed star
  // sao được hóa
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
// ─── 7) Truy tìm cung gốc ───────────────────────────────────
/**
 * Origin palace: for a given star + Si Hua type, find which palace's stem "flies" it in.
 * Cung gốc: với một sao + loại Tứ Hóa cho trước, tìm can của cung nào "phi hóa" vào đó.
 *
 * Commonly used in Ni Haixia's system: tracing the origin palace of Hua Ji —
 * Thường dùng trong hệ thống của Ni Haixia: truy tìm cung gốc của Hóa Kỵ —
 * the palace whose stem triggers the Hua Ji is the root-cause palace for the issue.
 * cung có can kích hoạt Hóa Kỵ chính là cung gốc rễ của vấn đề.
 *
 * @param chart natal chart
 * @param chart lá số gốc
 * @param starName the transformed star name (e.g. "太阴")
 * @param starName tên sao được hóa (ví dụ "太阴"/Thái Âm)
 * @param sihua   Si Hua type (e.g. "忌")
 * @param sihua   loại Tứ Hóa (ví dụ "忌"/Kỵ)
 * @returns palaces that trigger this transformation (usually one; multiple if two palaces share the same stem)
 * @returns các cung kích hoạt hóa diệu này (thường chỉ một; có thể nhiều nếu hai cung cùng chung một can)
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
 * Tính danh sách Tự Hóa cho từng cung trong lá số
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
// ─── 8) Overlay: góc nhìn tổng hợp nhiều lớp Tứ Hóa ────────
/**
 * Generate a combined view of a star's multi-layer Si Hua.
 * Tạo góc nhìn tổng hợp các lớp Tứ Hóa của một sao.
 * Used to display simultaneously on a palace: natal / Da Xian / Liu Nian transformations.
 * Dùng để hiển thị đồng thời trên một cung: hóa diệu bản mệnh / Đại Hạn / Lưu Niên.
 * Priority: natal < Da Xian < Liu Nian (all are shown)
 * Thứ tự ưu tiên: bản mệnh < Đại Hạn < Lưu Niên (tất cả đều được hiển thị)
 */
export interface SiHuaOverlay {
  native?: SiHua;    // natal (birth year stem)
  // bản mệnh (can năm sinh)
  daXian?: SiHua;    // Da Xian
  // Đại Hạn
  liuNian?: SiHua;   // Liu Nian (annual)
  // Lưu Niên (hàng năm)
  liuYue?: SiHua;    // Liu Yue (monthly)
  // Lưu Nguyệt (hàng tháng)
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
