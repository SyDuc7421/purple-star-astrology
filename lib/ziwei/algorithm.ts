/**
 * Zi Wei Dou Shu chart calculation algorithm — built on iztro open-source library
 * Thuật toán tính toán lá số Tử Vi Đẩu Số — xây dựng trên thư viện mã nguồn mở iztro
 * https://github.com/SylarLong/iztro
 */

import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, DaXianSiHua, ZiweiChart } from './types';
import { BRANCHES, STEMS } from './constants';
// Si Hua flying-star tools are exported only; no longer called during chart generation
// Các công cụ phi tinh Tứ Hóa chỉ được export ra ngoài; không còn được gọi trong quá trình lập lá số
// (Ni Haixia, "Tian Ji 03": the four Si Hua transformations are always fixed)
// (Ni Haixia, "Tian Ji 03": bốn hóa của Tứ Hóa luôn cố định)
// import { detectSelfSihua, getSiHuaByStem } from './sihua';

// ─── Lunar calendar info (kept for compatibility) ───────────────
// ─── Thông tin âm lịch (giữ lại để tương thích) ───────────────
export function getLunarInfo(year: number, month: number, day: number): LunarInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const yearStem = STEMS.indexOf(lunar.getYearGan());
  const yearBranch = BRANCHES.indexOf(lunar.getYearZhi());
  const rawMonth = lunar.getMonth();
  return {
    lunarYear: lunar.getYear(),
    lunarMonth: Math.abs(rawMonth),
    lunarDay: lunar.getDay(),
    yearStem: yearStem >= 0 ? yearStem : 0,
    yearBranch: yearBranch >= 0 ? yearBranch : 0,
    isLeapMonth: rawMonth < 0,
  };
}

// ─── Brightness mapping ──────────────────────────────────────────
// ─── Ánh xạ độ sáng sao ──────────────────────────────────────────
function mapBrightness(b?: string): 'bright' | 'normal' | 'dim' {
  if (!b) return 'normal';
  if (b === '庙' || b === '旺') return 'bright';
  if (b === '陷' || b === '不') return 'dim';
  return 'normal';
}

// ─── Star type mapping ───────────────────────────────────────────
// ─── Ánh xạ loại sao ───────────────────────────────────────────
const SHA_STARS = new Set(['擎羊', '陀罗', '火星', '铃星', '地空', '地劫',
  '天空', '旬空', '截路', '大耗', '天使', '天伤']);
const LUCKY_STARS = new Set(['文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '禄存', '天马', '天官', '天福', '天才', '天寿', '三台', '八座', '恩光',
  '天贵', '台辅', '龙池', '凤阁', '红鸾', '天喜', '孤辰', '寡宿']);

function mapStarType(starName: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(starName)) return 'sha';
  if (LUCKY_STARS.has(starName)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t === '主星' || t === 'major') return 'major';
  if (t === '煞星' || t === 'tough') return 'sha';
  if (t === '吉星' || t === 'soft' || t === '禄存' || t === '天马') return 'lucky';
  return 'minor';
}

// ─── Wu Xing ju name → number ───────────────────────────────────
// ─── Tên Ngũ Hành Cục → số ───────────────────────────────────
function parseWuxingJu(name: string): number {
  if (name.includes('二')) return 2;
  if (name.includes('三')) return 3;
  if (name.includes('四')) return 4;
  if (name.includes('五')) return 5;
  if (name.includes('六')) return 6;
  return 3;
}

// ─── Main function: generate birth chart ─────────────────────────
// ─── Hàm chính: tạo lá số sinh ─────────────────────────
export function generateChart(birthInfo: BirthInfo): ZiweiChart {
  const { year, month, day, hour, gender } = birthInfo;

  // Call iztro to generate the chart
  // Gọi iztro để tạo lá số
  const solarDate = `${year}-${month}-${day}`;
  const iztroGender = gender === 'male' ? '男' : '女';
  const astrolabe = astro.bySolar(solarDate, hour, iztroGender, true, 'zh-CN');

  // ── Assemble the 12 palaces ──
  // ── Tổng hợp 12 cung ──
  const palaces: Palace[] = astrolabe.palaces.map(p => {
    const branch = BRANCHES.indexOf(p.earthlyBranch as string);
    const stem   = STEMS.indexOf(p.heavenlyStem as string);

    // Merge all stars: major + minor + auxiliary
    // Gộp tất cả các sao: chính tinh + phụ tinh + sao bổ trợ
    const allStars: Star[] = [
      ...(p.majorStars ?? []).map(s => ({
        name:       s.name as string,
        type:       'major' as const,
        brightness: mapBrightness(s.brightness as string),
        siHua:      s.mutagen as Star['siHua'],
      })),
      ...(p.minorStars ?? []).map(s => ({
        name:  s.name as string,
        type:  mapStarType(s.name as string, s.type as string),
        siHua: s.mutagen as Star['siHua'],
      })),
      ...(p.adjectiveStars ?? []).map(s => ({
        name:  s.name as string,
        type:  'minor' as const,
        siHua: s.mutagen as Star['siHua'],
      })),
    ];

    const range = p.decadal?.range;
    return {
      branch:        branch >= 0 ? branch : 0,
      stem:          stem >= 0 ? stem : 0,
      name:          p.name as string,
      stars:         allStars,
      daXianAge:     range ? [range[0], range[1]] as [number, number] : undefined,
      isMingGong:    p.name === '命宫',
      isShenGong:    p.isBodyPalace ?? false,
      isCurrentDaXian: false,
    };
  });

  // ── Current age & Da Xian ──
  // ── Tuổi hiện tại & Đại Hạn ──
  const currentYear = new Date().getFullYear();
  const currentAge  = currentYear - year;

  palaces.forEach(p => {
    if (p.daXianAge && currentAge >= p.daXianAge[0] && currentAge <= p.daXianAge[1]) {
      p.isCurrentDaXian = true;
    }
  });

  // ── Borrowed-palace structured fields (codex P0: prevent UI layer from reverse-looking up borrowed palace from natural language) ──
  // ── Các trường dữ liệu có cấu trúc cho cung mượn sao (codex P0: ngăn tầng UI tra ngược cung mượn sao từ văn bản tự nhiên) ──
  palaces.forEach(p => {
    p.oppositeBranch = (p.branch + 6) % 12;
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    if (p.isEmpty) {
      const oppPalace = palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        p.borrowedStars = oppPalace.stars.filter(s => s.type === 'major').map(s => s.name);
      }
    }
  });

  // ── Key palace branches ──
  // ── Địa chi của các cung trọng yếu ──
  const mingGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfSoulPalace as string);
  const shenGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfBodyPalace as string);
  const wuxingJuName   = astrolabe.fiveElementsClass as string;
  const wuxingJu       = parseWuxingJu(wuxingJuName);

  // ── Zi Wei star position ──
  // ── Vị trí sao Tử Vi ──
  const ziweiPalace = palaces.find(p => p.stars.some(s => s.name === '紫微' && s.type === 'major'));
  const ziweiPos    = ziweiPalace?.branch ?? 0;

  // ── Da Xian array (Ni Haixia "Tian Ji" orthodox: Si Hua fixed, Da Xian tracks palace movement only) ──
  // ── Mảng Đại Hạn (theo chính thống "Tian Ji" của Ni Haixia: Tứ Hóa cố định, Đại Hạn chỉ theo dõi sự dịch chuyển cung) ──
  // No longer generating daXians[].siHua / stemIndex / stemName (flying-star fields retired)
  // Không còn tạo daXians[].siHua / stemIndex / stemName (các trường phi tinh đã bị loại bỏ)
  const daXians: DaXian[] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => ({
      startAge:    p.daXianAge![0],
      endAge:      p.daXianAge![1],
      palaceBranch: p.branch,
      palaceName:   p.name,
    }));

  // Palace-stem self-transformation retired (Ni Haixia does not endorse the flying-star self-Hua theory)
  // Đã loại bỏ tự hóa theo Thiên Can cung (Ni Haixia không công nhận thuyết tự hóa của phái phi tinh)

  const currentDaXianIndex = daXians.findIndex(
    dx => currentAge >= dx.startAge && currentAge <= dx.endAge,
  );

  // ── Lunar info ──
  // ── Thông tin âm lịch ──
  const lunarInfo = getLunarInfo(year, month, day);

  return {
    birthInfo,
    lunarInfo,
    mingGongBranch: mingGongBranch >= 0 ? mingGongBranch : 0,
    shenGongBranch: shenGongBranch >= 0 ? shenGongBranch : 0,
    wuxingJu,
    wuxingJuName,
    ziweiPos,
    palaces,
    daXians,
    currentAge,
    currentDaXianIndex,
  };
}
