/**
 * Zi Wei Dou Shu chart pattern detection (v2 strict edition)
 * Phát hiện cách cục Tử Vi Đẩu Số (bản v2 nghiêm ngặt)
 *
 * Design principles:
 * Nguyên tắc thiết kế:
 * 1. Classical text conditions first: each pattern has a three-tier structure
 *    (required / bonus / pattern-breaking) with traceable classical sources
 * 1. Ưu tiên điều kiện theo cổ thư trước: mỗi cách cục có cấu trúc ba tầng
 *    (bắt buộc / cộng điểm / phá cách) có thể truy nguồn cổ thư
 * 2. Ni Haixia's position: no palace-stem self-Hua, Da Xian Si Hua, or
 *    origin-palace tools (flying-star school features)
 * 2. Quan điểm của Ni Haixia: không dùng tự hóa can cung, Tứ Hóa Đại Hạn,
 *    hay công cụ cung gốc (đặc trưng của phái phi tinh)
 * 3. Brightness: uses the `brightness` field (bright = miao/wang, normal, dim = xian)
 * 3. Độ sáng sao: dùng trường `brightness` (sáng = miếu/vượng, bình hòa, tối = hãm)
 * 4. San Fang Si Zheng (Three Directions & Four Directions): Ming Gong + Cai Bo + Guan Lu + Qian Yi
 * 4. Tam Phương Tứ Chính: Mệnh Cung + Cung Tài Bạch + Cung Quan Lộc + Cung Thiên Di
 * 5. Jia Gong (flanking palaces): the two palaces adjacent to Ming Gong
 * 5. Giáp Cung (cung kẹp): hai cung liền kề Mệnh Cung
 *
 * Primary classical sources:
 * Nguồn cổ thư chính:
 *  - "Zi Wei Dou Shu Quan Ji" (transmitted by Chen Tuan, Ming dynasty edition)
 *  - "Zi Wei Dou Shu Quan Ji" (do Chen Tuan truyền lại, bản đời Minh)
 *  - "Zi Wei Dou Shu Quan Shu" (compiled by Luo Honxian, Ming dynasty edition)
 *  - "Zi Wei Dou Shu Quan Shu" (do Luo Honxian biên soạn, bản đời Minh)
 *  - "Gu Sui Fu", "Nu Ming Gu Sui Fu", "Shi Er Gong Zhu Xing De Di He Ge Jue"
 *  - "Gu Sui Fu", "Nu Ming Gu Sui Fu", "Shi Er Gong Zhu Xing De Di He Ge Jue"
 *  - Ni Haixia "Tian Ji" Zi Wei Dou Shu lecture notes
 *  - Ghi chép bài giảng Tử Vi Đẩu Số "Tian Ji" của Ni Haixia
 */

import type { ZiweiChart, Palace, Star } from './types';

// ────────────────── Types ──────────────────
// ────────────────── Kiểu dữ liệu ──────────────────
export interface PatternCondition {
  required: string[];   // must-satisfy conditions (already matched)
                         // điều kiện bắt buộc phải thỏa (đã khớp)
  bonus?: string[];     // bonus conditions (triggered)
                         // điều kiện cộng điểm (đã kích hoạt)
  breaking?: string[];  // pattern-breaking warnings (triggered)
                         // cảnh báo phá cách (đã kích hoạt)
}

export interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];                 // palaces involved
                                      // các cung liên quan
  conditions?: PatternCondition;     // tiered conditions (added in v2)
                                      // điều kiện phân tầng (thêm ở v2)
  source?: string;                   // classical source citation (added in v2)
                                      // trích dẫn nguồn cổ thư (thêm ở v2)
}

// ────────────────── Constants ──────────────────
// ────────────────── Hằng số ──────────────────
const SHA_NAMES = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
const SHA_HARD = ['擎羊', '陀罗', '火星', '铃星'];   // four sha stars
                                                      // bốn sát tinh
const SHA_KONG = ['地空', '地劫'];                  // kong-jie (void) stars
                                                      // sao không-kiếp (hư không)
const ZUO_YOU = ['左辅', '右弼'];
const CHANG_QU = ['文昌', '文曲'];
const KUI_YUE = ['天魁', '天钺'];

// ────────────────── Helper functions ──────────────────
// ────────────────── Hàm hỗ trợ ──────────────────
function getMajorStarNames(palace: Palace): string[] {
  return palace.stars.filter(s => s.type === 'major').map(s => s.name);
}
function findStar(palace: Palace, name: string): Star | undefined {
  return palace.stars.find(s => s.name === name);
}
function hasStar(palace: Palace, name: string): boolean {
  return palace.stars.some(s => s.name === name);
}
function findStarPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === name));
}
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}
function shaCountInPalace(palace: Palace, list: string[] = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}
function hasShaInPalace(palace: Palace, list: string[] = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}
function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
function getDuiGong(chart: ZiweiChart, branch: number): Palace | undefined {
  return getPalaceByBranch(chart, (branch + 6) % 12);
}
function getJiaPalaces(chart: ZiweiChart, branch: number): { prev?: Palace; next?: Palace } {
  return {
    prev: getPalaceByBranch(chart, (branch + 11) % 12),
    next: getPalaceByBranch(chart, (branch + 1) % 12),
  };
}
function sanFangAllStars(chart: ZiweiChart): Set<string> {
  return new Set(getSanFangPalaces(chart).flatMap(p => p.stars.map(s => s.name)));
}
function sanFangShaCount(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  return getSanFangPalaces(chart).reduce((sum, p) => sum + shaCountInPalace(p, list), 0);
}
function isBright(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';
}
function isDim(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';
}
function getStarSiHua(palace: Palace, starName: string): Star['siHua'] | undefined {
  return findStar(palace, starName)?.siHua;
}
const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ────────────────── Positive pattern detectors ──────────────────
// ────────────────── Bộ phát hiện cách cục tốt ──────────────────

/** Jun Chen Qing Hui: Zi Wei in Life Palace, Zuo Fu & You Bi converge (same palace or San Fang) */
/** Quân Thần Khánh Hội: Tử Vi tại Mệnh Cung, Tả Phù & Hữu Bật hội tụ (đồng cung hoặc Tam Phương) */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('左辅');
  const hasYou = sanFangSet.has('右弼');
  if (!hasZuo || !hasYou) return;

  const required = ['紫微入命', '左辅右弼同会三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会文昌或文曲');
  if (sanFangSet.has('天魁') || sanFangSet.has('天钺')) bonus.push('魁钺贵人加照');
  if (getStarSiHua(ming, '紫微') === '权') bonus.push('紫微化权');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('地空地劫双夹会照（紫微忌空劫）');

  patterns.push({
    name: '君臣庆会',
    level: breaking.length ? 'good' : 'excellent',
    description: '紫微入命，左辅右弼同会，帝王得贤臣辅佐，主大富大贵、统御之命。一生贵人不绝，宜走政商高位、跨界领袖之途。',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·君臣庆会格》',
  });
}

/** Zi Fu Tong Gong: Zi Wei + Tian Fu together in Life Palace (Yin or Shen palace only) */
/** Tử Phủ Đồng Cung: Tử Vi + Thiên Phủ cùng tại Mệnh Cung (chỉ tại cung Dần hoặc Thân) */
function detectZiFu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const ziwei = findStarPalace(chart, '紫微');
  const tianfu = findStarPalace(chart, '天府');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['紫微天府同入命宫']
    : ['紫微天府同宫（不在命宫，会照减力）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('左辅右弼同会');
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会昌曲');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('紫府宫坐空劫（破紫府之贵气）');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('紫府宫见双煞同坐');

  patterns.push({
    name: '紫府同宫',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? '紫微天府同入命宫，帝相并临，尊贵之命。主品行端正、衣食无忧、有领导才能，宜担任要职。需要左右辅弼来配合方为完整大格。'
      : '紫微天府同宫但未坐命，主一生有贵人贵气依托，但本身不一定大富贵，需看会照吉煞而定。',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·紫府同宫格》',
  });
}

/** Fu Xiang Chao Yuan: Tian Fu & Tian Xiang each occupy San Fang Si Zheng of the Life Palace */
/** Phủ Tướng Triều Viên: Thiên Phủ & Thiên Tướng mỗi sao chiếm một cung trong Tam Phương Tứ Chính của Mệnh Cung */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, '天府');
  const tianxiang = findStarPalace(chart, '天相');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['天府坐命三方', '天相坐命三方', '两星不同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, '禄存') || hasStar(ming, '化禄')) bonus.push('命宫见禄');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('再会左辅');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命宫坐煞星');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('三方四正煞星过多');

  patterns.push({
    name: '府相朝垣',
    level: breaking.length ? 'good' : 'excellent',
    description: '天府天相分守命宫三方四正，文武并济、权印双辉，主一生衣食丰足、地位崇高。古书云"府相朝垣千钟食禄"，常见于政界、企业管理者。',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·府相朝垣格》',
  });
}

/** Yang Liang Chang Lu: Tai Yang + Tian Liang + Wen Chang + Lu Cun all converge on Life Palace — high nobility pattern */
/** Dương Lương Xương Lộc: Thái Dương + Thiên Lương + Văn Xương + Lộc Tồn cùng hội chiếu Mệnh Cung — cách cục quý hiển */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('太阳') || !sanFangSet.has('天梁') ||
      !sanFangSet.has('文昌') || !sanFangSet.has('禄存')) return;

  const sun = findStarPalace(chart, '太阳')!;
  const liang = findStarPalace(chart, '天梁')!;
  const required = [
    '太阳会命宫三方',
    '天梁会命宫三方',
    '文昌会命宫三方',
    '禄存会命宫三方',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, '太阳')) bonus.push('太阳庙旺');
  if (isBright(liang, '天梁')) bonus.push('天梁庙旺');
  if (sanFangSet.has('化科')) bonus.push('再会化科');
  if (isDim(sun, '太阳')) breaking.push('太阳落陷（阳梁失辉）');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('三方煞重');

  patterns.push({
    name: '阳梁昌禄',
    level: breaking.length ? 'good' : 'excellent',
    description: '太阳、天梁、文昌、禄存四星齐会命宫三方，号称"科举之星"，主清贵显达、考运极佳，宜走学术、文教、研究、专业认证之路，一生功名易就。',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·阳梁昌禄格》',
  });
}

/** Huo Tan / Ling Tan: Tan Lang + Huo Xing or Tan Lang + Ling Xing — same palace or convergence */
/** Hỏa Tham / Linh Tham: Tham Lang + Hỏa Tinh hoặc Tham Lang + Linh Tinh — đồng cung hoặc hội chiếu */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, '贪狼');
  if (!tan) return;
  const huo = findStarPalace(chart, '火星');
  const ling = findStarPalace(chart, '铃星');

  for (const [shaName, shaPalace] of [['火星', huo], ['铃星', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const required = [`贪狼${tan.branch === shaPalace.branch ? '同宫' : '会照'}${shaName}`, '贪狼会照命宫三方'];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, '贪狼')) bonus.push('贪狼庙旺');
    if (getStarSiHua(tan, '贪狼') === '禄' || getStarSiHua(tan, '贪狼') === '权') bonus.push('贪狼化禄/化权');
    if (hasShaInPalace(tan, ['擎羊', '陀罗'])) breaking.push('贪狼宫又见羊陀（破横发之力）');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('贪狼遇空劫（财来财去）');

    patterns.push({
      name: shaName === '火星' ? '火贪格' : '铃贪格',
      level: breaking.length ? 'good' : 'excellent',
      description: `贪狼遇${shaName}${tan.branch === shaPalace.branch ? '同宫' : '三方会照'}，主突发横财、突如其来的机遇。古书云“贪狼遇火铃，必发横财”，但来得快去得也快，宜见好就收。${breaking.length ? '本盘破格条件已触发，发力打折。' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: '《紫微斗数骨髓赋》',
    });
  }
}

/** Wu Tan: Wu Qu + Tan Lang in same palace (Chou or Wei) or opposing */
/** Vũ Tham: Vũ Khúc + Tham Lang đồng cung (tại Sửu hoặc Mùi) hoặc xung chiếu */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const tan = findStarPalace(chart, '贪狼');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const required = [
    wu.branch === tan.branch ? '武曲贪狼同宫（丑/未）' : '武曲贪狼对宫拱照',
    '会照命宫三方',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('火星') || sanFangAllStars(chart).has('铃星'))
    bonus.push('再遇火星/铃星（火贪/铃贪叠加）');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('武曲化禄');
  if (hasShaInPalace(wu, ['擎羊', '陀罗'])) breaking.push('武贪宫见羊陀');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('武贪宫遇空劫');

  patterns.push({
    name: '武贪格',
    level: breaking.length ? 'good' : 'excellent',
    description: '武曲贪狼会命，财星与桃花欲望星交辉，古书云"武贪不发少年人"——三十岁后方能厚积薄发。主中年以后大富大贵，财源由人脉、应酬、欲望管理而来，适合金融、投机、销售、娱乐业。',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数骨髓赋》',
  });
}

/** Sha Po Lang: Qi Sha, Po Jun, Tan Lang gathered across the three directions */
/** Sát Phá Tham: Thất Sát, Phá Quân, Tham Lang hội tụ khắp Tam Phương */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['七杀', '破军', '贪狼'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['七杀、破军、贪狼三星齐入命宫三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('化禄') || sanFangSet.has('化权')) bonus.push('三方有化禄或化权（动得有力）');
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('辅弼同会（变动中得贵人）');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('煞星过重（动而无成）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('命坐空劫（动得辛苦）');

  patterns.push({
    name: '杀破狼',
    level: breaking.length ? 'caution' : 'good',
    description: '七杀、破军、贪狼三星会命，开创闯荡之命格。一生变动多、不甘平凡，宜创业、军警、业务、销售。中年后才能稳定守成，年轻时易因冲动失利。',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·杀破狼》',
  });
}

/** Ji Yue Tong Liang: Tian Ji, Tai Yin, Tian Tong, Tian Liang all in Life/Travel/Wealth/Career palaces */
/** Cơ Nguyệt Đồng Lương: Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương đều tại các cung Mệnh/Thiên Di/Tài Bạch/Quan Lộc */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['天机、太阴、天同、天梁四星齐入命宫三方四正'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('再会昌曲');
  if (sanFangSet.has('化科')) bonus.push('再会化科');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('煞星过多（机月同梁忌煞）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命宫坐煞');

  patterns.push({
    name: '机月同梁',
    level: breaking.length ? 'good' : 'excellent',
    description: '天机太阴天同天梁四星齐入命迁财官，文质彬彬、聪慧善谋。最适合公职、学术、文艺、医疗、服务等需稳定累积的行业，不宜大冒险大投机。',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·机月同梁格》',
  });
}

/** Lian Zhen Tian Xiang: same palace */
/** Liêm Trinh Thiên Tướng: đồng cung */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, '廉贞');
  const xiang = findStarPalace(chart, '天相');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['廉贞天相同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, '禄存') || getStarSiHua(lian, '廉贞') === '禄') bonus.push('见禄存或廉贞化禄');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('左辅会照');
  if (hasShaInPalace(lian, ['擎羊'])) breaking.push('廉相宫坐擎羊（廉杀羊倾向）');
  if (getStarSiHua(lian, '廉贞') === '忌') breaking.push('廉贞化忌');

  patterns.push({
    name: '廉贞天相格',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: '廉贞天相同宫，印绶格局，主秉公处事、清廉之名，宜任公职、行政管理、法务、企划。怕见擎羊化忌，则反主官非。',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书》',
  });
}

/** Wu Qu Qi Sha: same palace — general star paired with wealth star */
/** Vũ Khúc Thất Sát: đồng cung — tướng tinh kết hợp với tài tinh */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const qi = findStarPalace(chart, '七杀');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['武曲七杀同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, '武曲') === '权') bonus.push('武曲化权');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('武曲化禄');
  if (getStarSiHua(wu, '武曲') === '忌') breaking.push('武曲化忌（武曲化忌为财劫之兆）');
  if (hasShaInPalace(wu, ['擎羊', '陀罗', '火星', '铃星'])) breaking.push('武杀宫煞星过多');

  patterns.push({
    name: '武曲七杀',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: '武曲七杀同宫，将星配财星，主果决刚毅、理财能力强，适合金融、军警、创业。但忌见化忌煞星，否则凶险。一生奋斗、积财但操心。',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书》',
  });
}

/** Tian Tong Tian Liang: same palace */
/** Thiên Đồng Thiên Lương: đồng cung */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, '天同');
  const liang = findStarPalace(chart, '天梁');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['天同天梁同宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌')) bonus.push('文昌会照');
  if (getStarSiHua(tong, '天同') === '禄') bonus.push('天同化禄');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('煞星同坐');

  patterns.push({
    name: '天同天梁格',
    level: breaking.length ? 'neutral' : 'good',
    description: '天同天梁同宫，福星与荫星共会，主宽厚和善、乐于助人，宜医疗、教育、宗教、社会公益。但偏温和保守，难成大富大贵之局。',
    palaces: [tong.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书》',
  });
}

/** Ri Yue Tong Gong: Tai Yang & Tai Yin together in Chou or Wei palace */
/** Nhật Nguyệt Đồng Cung: Thái Dương & Thái Âm cùng tại cung Sửu hoặc Mùi */
function detectRiYueTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const sun = findStarPalace(chart, '太阳');
  const moon = findStarPalace(chart, '太阴');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // must be Chou(1) or Wei(7)
                                                      // phải là cung Sửu(1) hoặc Mùi(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`太阳太阴同入${BRANCH_NAMES[sun.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('未宫日月同辉（古书云未宫日月双美）');
  if (sanFangAllStars(chart).has('文昌') && sanFangAllStars(chart).has('文曲')) bonus.push('昌曲会照');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('日月宫煞星同坐');

  patterns.push({
    name: '日月同宫',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `太阳太阴于${BRANCH_NAMES[sun.branch]}宫同宫，阴阳平衡，文武兼备。主异性缘佳、事业顺遂、名声远播。${sun.branch === 7 ? '未宫日月双美尤佳。' : '丑宫日月同宫力量较平。'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书》',
  });
}

/** Ri Yue Jia Ming: Tai Yang & Tai Yin flank the Life Palace on both sides */
/** Nhật Nguyệt Giáp Mệnh: Thái Dương & Thái Âm kẹp hai bên Mệnh Cung */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, '太阳');
  const prevHasMoon = hasStar(prev, '太阴');
  const nextHasSun = hasStar(next, '太阳');
  const nextHasMoon = hasStar(next, '太阴');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['太阳太阴分居命宫前后两宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, '太阳')) bonus.push('太阳庙旺');
  if (isBright(moonPalace, '太阴')) bonus.push('太阴庙旺');
  if (isDim(sunPalace, '太阳') || isDim(moonPalace, '太阴')) breaking.push('日月落陷（夹命无光）');

  patterns.push({
    name: '日月夹命',
    level: breaking.length ? 'good' : 'excellent',
    description: '太阳太阴分居命宫两侧夹照，光明磊落，一生贵人相助，事业蓬勃。男主官贵，女主旺夫兴家。日月须不落陷方为真夹。',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·日月夹命》',
  });
}

/** Ju Ri Tong Gong: Ju Men & Tai Yang together in Yin or Shen palace */
/** Cự Nhật Đồng Cung: Cự Môn & Thái Dương cùng tại cung Dần hoặc Thân */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, '巨门');
  const sun = findStarPalace(chart, '太阳');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // must be Yin(2) or Shen(8)
                                                    // phải là cung Dần(2) hoặc Thân(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`巨门太阳同入${BRANCH_NAMES[ju.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('寅宫太阳庙旺，巨门得日光化解是非');
  if (getStarSiHua(ju, '巨门') === '禄' || getStarSiHua(ju, '巨门') === '权') bonus.push('巨门化禄/化权（口才生财）');
  if (getStarSiHua(ju, '巨门') === '忌') breaking.push('巨门化忌（口舌官非）');
  if (ju.branch === 8) breaking.push('申宫太阳偏西，巨门暗曜更显');

  patterns.push({
    name: '巨日同宫',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `巨门太阳同${BRANCH_NAMES[ju.branch]}宫，太阳化解巨门暗曜，主以口才、传媒、外语、专业立业。寅宫为佳，申宫力减。怕巨门化忌则官非。`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·巨日同宫》',
  });
}

/** Shi Zhong Yin Yu: Ju Men in Life Palace at Zi or Wu palace */
/** Thạch Trung Ẩn Ngọc: Cự Môn tại Mệnh Cung ở cung Tý hoặc Ngọ */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '巨门')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // must be Zi(0) or Wu(6)
                                                        // phải là cung Tý(0) hoặc Ngọ(6)

  const required = [`巨门入命于${BRANCH_NAMES[ming.branch]}宫`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, '巨门') === '禄' || getStarSiHua(ming, '巨门') === '权') bonus.push('巨门化禄/化权');
  if (sanFangAllStars(chart).has('文昌')) bonus.push('文昌会照（石中隐玉得明）');
  if (getStarSiHua(ming, '巨门') === '忌') breaking.push('巨门化忌（玉藏深泥）');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('命坐煞星');

  patterns.push({
    name: '石中隐玉',
    level: breaking.length ? 'caution' : 'excellent',
    description: '巨门坐命子午，外表平凡而内蕴才学。早年默默无闻、中年方显贵气，宜走专业、研究、口才、传媒。需有禄权或文昌相助方能"凿石见玉"。',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数骨髓赋·石中隐玉》',
  });
}

/** Ming Zhu Chu Hai: Life Palace in Wei (empty), opposite Chou palace has Tai Yang & Tai Yin */
/** Minh Châu Xuất Hải: Mệnh Cung tại cung Mùi (cung không sao), cung Sửu đối diện có Thái Dương & Thái Âm */
function detectMingZhuChuHai(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 7) return;   // Life Palace must be Wei
                                    // Mệnh Cung phải là cung Mùi
  if (getMajorStarNames(ming).length > 0) return;   // Life Palace must be empty
                                                      // Mệnh Cung phải là cung không sao
  const dui = getDuiGong(chart, ming.branch);
  if (!dui) return;
  if (!hasStar(dui, '太阳') || !hasStar(dui, '太阴')) return;

  const required = ['命宫在未为空宫', '对宫丑宫为太阳太阴同度'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌') || sanFangAllStars(chart).has('文曲')) bonus.push('再会昌曲');
  if (sanFangAllStars(chart).has('左辅') || sanFangAllStars(chart).has('右弼')) bonus.push('辅弼相助');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('煞星会照（珠光黯淡）');

  patterns.push({
    name: '明珠出海',
    level: breaking.length ? 'good' : 'excellent',
    description: '命未空宫，对宫丑宫日月同辉拱照，号"明珠出海"。主出生平凡、后天努力出头，宜远赴他乡、学术研究或大公司高位，主大富大贵。',
    palaces: ['命宫', dui.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全集·明珠出海》',
  });
}

/** Zi Wei alone in Life Palace */
/** Tử Vi độc thủ Mệnh Cung */
function detectZiWeiInMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微') || hasStar(ming, '天府')) return;

  const required = ['紫微独坐命宫（无天府同坐）'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('左辅右弼同会');
  if (sanFangSet.has('文昌') && sanFangSet.has('文曲')) bonus.push('文昌文曲同会');
  if (!sanFangSet.has('左辅') && !sanFangSet.has('右弼')) breaking.push('无辅弼（孤君无臣）');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('紫微遇空劫（古书最忌）');

  patterns.push({
    name: '紫微入命',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: '紫微独坐命宫，帝王之星，自尊心强、有领导魅力。但紫微最忌"在野孤君"——若无左右辅弼相会，反成孤高自傲、易招毁谤。',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书》',
  });
}

/** Zuo Fu & You Bi flanking Life Palace */
/** Tả Phù & Hữu Bật kẹp Mệnh Cung */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, '左辅');
  const prevHasYou = hasStar(prev, '右弼');
  const nextHasZuo = hasStar(next, '左辅');
  const nextHasYou = hasStar(next, '右弼');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['左辅右弼分居命宫前后两宫'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('再会魁钺');

  patterns.push({
    name: '辅弼夹命',
    level: 'excellent',
    description: '左辅右弼夹命，一生贵人不断、逢凶化吉。适合走仕途、大企业管理，有贵人提携之命。古书云"左辅右弼，终身福厚"。',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required, bonus, breaking },
    source: '《紫微斗数全书·辅弼夹命》',
  });
}

/** Wen Chang & Wen Qu flanking Life Palace */
/** Văn Xương & Văn Khúc kẹp Mệnh Cung */
function detectChangQuJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasChang = hasStar(prev, '文昌');
  const prevHasQu = hasStar(prev, '文曲');
  const nextHasChang = hasStar(next, '文昌');
  const nextHasQu = hasStar(next, '文曲');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: '昌曲夹命',
    level: 'excellent',
    description: '文昌文曲夹命宫，主聪明俊秀、文采斐然，宜走文教、学术、艺术、写作。古书云"昌曲夹命主科甲"，最利考运。',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['文昌文曲分居命宫前后两宫'] },
    source: '《紫微斗数全书》',
  });
}

/** Tian Kui & Tian Yue flanking Life Palace */
/** Thiên Khôi & Thiên Việt kẹp Mệnh Cung */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '天魁') && hasStar(next, '天钺');
  const okB = hasStar(prev, '天钺') && hasStar(next, '天魁');
  if (!okA && !okB) return;

  patterns.push({
    name: '魁钺夹命',
    level: 'good',
    description: '天魁天钺夹命，男称天乙、女称玉堂，一生贵人提携。考试、求职、关键时刻常有意外贵人相助。',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['天魁天钺分居命宫前后两宫'] },
    source: '《紫微斗数全书》',
  });
}

/** Shuang Lu Chao Yuan: Hua Lu + Lu Cun both converge in San Fang */
/** Song Lộc Triều Viên: Hóa Lộc + Lộc Tồn cùng hội tụ trong Tam Phương */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === '禄')) huaLuFound = true;
    if (hasStar(p, '禄存')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: '双禄朝垣',
    level: 'excellent',
    description: '化禄、禄存同会命宫三方四正，财源涌动、衣食丰足。古书云"双禄朝垣，富比陶朱"，主一生不愁财，多有正财横财兼得。',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['化禄会照三方四正', '禄存会照三方四正'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['命坐空劫（双禄遇空，财来财去）'] : undefined,
    },
    source: '《紫微斗数全书·双禄朝垣》',
  });
}

/** San Qi Jia Hui: Hua Lu, Hua Quan, Hua Ke all converge in San Fang */
/** Tam Kỳ Gia Hội: Hóa Lộc, Hóa Quyền, Hóa Khoa cùng hội tụ trong Tam Phương */
function detectSanQiJiaHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangPalaces = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFangPalaces) {
    for (const s of p.stars) {
      if (s.siHua === '禄') lu = true;
      if (s.siHua === '权') quan = true;
      if (s.siHua === '科') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: '三奇加会',
    level: 'excellent',
    description: '化禄、化权、化科三吉化齐会命宫三方四正，号称"三奇加会"。主一生功名、财富、贵人三全，是紫微斗数最高吉格之一。',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['化禄、化权、化科三吉化齐会命宫三方四正'] },
    source: '《紫微斗数全书·三奇加会》',
  });
}

/** Hua Lu entering Life / Career / Wealth palace */
/** Hóa Lộc nhập Mệnh / Quan Lộc / Tài Bạch */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === '禄' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${huaLuStar.name}化禄入命`,
    level: 'good',
    description: `${huaLuStar.name}化禄坐命，主生财顺利、人缘佳、机缘多。${huaLuStar.name === '武曲' ? '武曲化禄属正财，宜实业、金融。' : huaLuStar.name === '太阴' ? '太阴化禄属阴财、不动产。' : huaLuStar.name === '贪狼' ? '贪狼化禄属人脉财、桃花财。' : ''}`,
    palaces: ['命宫'],
    conditions: { required: [`${huaLuStar.name}化禄坐命宫`] },
    source: '《紫微斗数全书》',
  });
}

// ────────────────── Negative pattern detectors ──────────────────
// ────────────────── Bộ phát hiện cách cục xấu ──────────────────

/** Hua Ji entering Life / Travel palace */
/** Hóa Kỵ nhập Mệnh / Thiên Di */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === '忌' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${jiStar.name}化忌入${inMing ? '命' : '迁'}`,
      level: 'caution',
      description: inMing
        ? `${jiStar.name}化忌坐命宫，需留意自身固执、心理障碍或健康隐患，凡事退一步思考。化忌不一定坏，代表此星能量需要特别关注。`
        : `${jiStar.name}化忌坐迁移宫，外出、远行、人际关系易有波折，宜守不宜动。`,
      palaces: [palace.name],
      conditions: { required: [`${jiStar.name}化忌坐${inMing ? '命' : '迁'}宫`] },
      source: '《紫微斗数全书》',
    });
  }
}

/** Yang Tuo Jia Ji: Hua Ji in a palace flanked on both sides by Qing Yang & Tuo Luo */
/** Dương Đà Giáp Kỵ: Hóa Kỵ tại một cung bị Kình Dương & Đà La kẹp hai bên */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === '忌');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;   // only check flanking of Life Palace
                                                              // chỉ kiểm tra cung kẹp quanh Mệnh Cung

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, '擎羊') && hasStar(next, '陀罗');
    const aNext = hasStar(prev, '陀罗') && hasStar(next, '擎羊');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: '羊陀夹忌',
      level: 'caution',
      description: '化忌坐命，左右擎羊陀罗夹命，古书云"羊陀夹忌为败局"，主一生劳碌奔波、坎坷不顺、身心俱疲。需以德行修养与积极做事化解，凡事谨慎为上。',
      palaces: ['命宫', prev.name, next.name],
      conditions: { required: ['化忌坐命', '擎羊陀罗分居命宫前后两宫'] },
      source: '《紫微斗数骨髓赋·羊陀夹忌》',
    });
    return;
  }
}

/** Huo Ling Jia Ming: Huo Xing & Ling Xing flank Life Palace on both sides */
/** Hỏa Linh Giáp Mệnh: Hỏa Tinh & Linh Tinh kẹp hai bên Mệnh Cung */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '火星') && hasStar(next, '铃星');
  const okB = hasStar(prev, '铃星') && hasStar(next, '火星');
  if (!okA && !okB) return;

  patterns.push({
    name: '火铃夹命',
    level: 'caution',
    description: '火星铃星分居命宫前后两宫夹命，主性急、易冲动、突发意外或纠纷。需培养耐性、避免冲动决策。',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['火星铃星分居命宫前后两宫'] },
    source: '《紫微斗数全书》',
  });
}

/** Kong Jie Jia Ming: Di Kong & Di Jie flank Life Palace on both sides */
/** Không Kiếp Giáp Mệnh: Địa Không & Địa Kiếp kẹp hai bên Mệnh Cung */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '地空') && hasStar(next, '地劫');
  const okB = hasStar(prev, '地劫') && hasStar(next, '地空');
  if (!okA && !okB) return;

  patterns.push({
    name: '空劫夹命',
    level: 'caution',
    description: '地空地劫夹命，主财来财去、思想脱俗、易遁入宗教哲学。古书云"空劫夹命，财不聚"。宜技艺、宗教、研究等不重物质之业。',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['地空地劫分居命宫前后两宫'] },
    source: '《紫微斗数全书》',
  });
}

/** Lian Sha Yang: Lian Zhen, Qi Sha, Qing Yang converge — most inauspicious in Liu Nian/Da Xian */
/** Liêm Sát Dương: Liêm Trinh, Thất Sát, Kình Dương hội tụ — hung hiểm nhất khi gặp Lưu Niên/Đại Hạn */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('廉贞') && sanFangSet.has('七杀') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: '廉杀羊',
    level: 'caution',
    description: '廉贞、七杀、擎羊三星会照命宫三方，古书警示之凶格。主血光、官非、意外。本命有此格不必惊慌，但流年大限再触发时需特别谨慎驾驶、避免冲突、注意手术风险。',
    palaces: ['命宫'],
    conditions: { required: ['廉贞、七杀、擎羊三星会照三方四正'] },
    source: '《紫微斗数全书·廉杀羊》',
  });
}

/** Ju Huo Yang: Ju Men, Huo Xing, Qing Yang converge */
/** Cự Hỏa Dương: Cự Môn, Hỏa Tinh, Kình Dương hội tụ */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('巨门') && sanFangSet.has('火星') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: '巨火羊',
    level: 'caution',
    description: '巨门、火星、擎羊三星会照，古书云"巨火羊，终身缢死"——古时凶格。现代理解为：易因口舌、激烈冲突而招大祸。需修身养性、慎言慎行，避免极端情绪。',
    palaces: ['命宫'],
    conditions: { required: ['巨门、火星、擎羊三星会照三方四正'] },
    source: '《紫微斗数骨髓赋·巨火羊》',
  });
}

/** Ling Chang Tuo Wu: Ling Xing, Wen Chang, Tuo Luo, Wu Qu converge — classically the most severe negative pattern */
/** Linh Xương Đà Vũ: Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội tụ — cách cục xấu nghiêm trọng nhất theo cổ thư */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('铃星') && sanFangSet.has('文昌') && sanFangSet.has('陀罗') && sanFangSet.has('武曲'))) return;

  patterns.push({
    name: '铃昌陀武',
    level: 'caution',
    description: '铃星、文昌、陀罗、武曲四星齐会，古书云"铃昌陀武，限至投河"——古时大凶格。本命有此组合本身不必恐慌，但流年大限触发时需高度警觉重大决策、情绪起伏、水边活动。',
    palaces: ['命宫'],
    conditions: { required: ['铃星、文昌、陀罗、武曲四星会照三方四正'] },
    source: '《紫微斗数骨髓赋·铃昌陀武》',
  });
}

/** Ma Tou Dai Jian: Qing Yang in Life Palace at Wu palace */
/** Mã Đầu Đới Kiếm: Kình Dương tại Mệnh Cung ở cung Ngọ */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // must be Wu(6)
                                    // phải là cung Ngọ(6)
  if (!hasStar(ming, '擎羊')) return;

  const required = ['擎羊于午宫坐命'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('七杀') || sanFangAllStars(chart).has('破军')) bonus.push('再会七杀或破军（武职大贵）');
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('魁钺加照');

  patterns.push({
    name: '马头带箭',
    level: bonus.length ? 'good' : 'caution',
    description: '擎羊于午宫坐命，号"马头带箭"。古书云"威镇边疆"——主刚毅果决、有冲杀之力，宜军警武职、运动员、外科医师。但同时主危险与意外，需配合杀破狼或贵人方为大格，否则反主血光。',
    palaces: ['命宫'],
    conditions: { required, bonus },
    source: '《紫微斗数骨髓赋·马头带箭》',
  });
}

// ────────────────── Basic patterns (improve detection coverage) ──────────────────
// ────────────────── Cách cục cơ bản (tăng độ phủ phát hiện) ──────────────────
// Design: ensures an average chart can still match 1-3 common patterns,
// rather than failing all 30+ strict classical patterns. These are lightweight,
// single-condition detectors; level is usually neutral / good.
// Thiết kế: đảm bảo một lá số trung bình vẫn khớp được 1-3 cách cục phổ biến,
// thay vì trượt hết hơn 30 cách cục nghiêm ngặt theo cổ thư. Đây là các bộ
// phát hiện đơn giản, một điều kiện; mức độ thường là bình hòa / tốt.

/** Lu Cun Shou Shen: Lu Cun in Body Palace (or Life Palace = Body Palace) */
/** Lộc Tồn Thủ Thân: Lộc Tồn tại Thân Cung (hoặc Mệnh Cung = Thân Cung) */
function detectLuCunShouShen(chart: ZiweiChart, patterns: Pattern[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? '禄存守命' : '禄存守身',
    level: 'good',
    description: inMing
      ? '禄存坐命，主一生衣食无忧、财禄稳定。性格保守，善积累，但羊陀夹禄须防小人。最宜配化禄、左辅右弼方为大格。'
      : '禄存入身宫，主中年后财源稳定、得禄自享。倪师说「禄存入身，财气近身」——配偶或事业方向能带来稳定财禄。',
    palaces: [inMing ? '命宫' : '身宫'],
    conditions: { required: [inMing ? '禄存入命宫' : '禄存入身宫'] },
    source: '《紫微斗数全书·禄存星》',
  });
}

/** Tian Ma entering Life / Travel palace: the courier star is active */
/** Thiên Mã nhập Mệnh / Thiên Di: sao dịch mã đang hoạt động */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? '天马入命' : '天马在迁',
    level: 'neutral',
    description: inMing
      ? '天马坐命，主一生奔波、动中得财，宜走商旅、外勤、跨界发展。倪师说「天马入命，无禄不发」——若再会禄存或化禄即「禄马交驰」之富格。'
      : '天马在迁移宫，主外出有利、远行得财，宜异乡发展。配化禄主异地生财，配煞星则旅途多波折。',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? '天马入命宫' : '天马入迁移宫'] },
    source: '《紫微斗数全书·天马星》',
  });
}

/** Hua Lu entering Wealth palace: major star in Wealth palace transforms to Lu */
/** Hóa Lộc nhập Cung Tài Bạch: chính tinh tại Cung Tài Bạch hóa Lộc */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === '财帛');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === '禄');
  if (!luStar) return;
  patterns.push({
    name: '化禄入财',
    level: 'good',
    description: `${luStar.name}化禄入财帛宫，主财源畅通、收入稳定。倪师讲化禄是「正财」象征——这个化禄星所代表的能力（${luStar.name}的核心特质）是你赚钱的主轴。配禄存或天马则财源更广。`,
    palaces: ['财帛'],
    conditions: { required: [`${luStar.name}化禄入财帛宫`] },
    source: '《紫微斗数全书·四化论》',
  });
}

/** Hua Quan entering Career palace: major star in Career palace transforms to Quan */
/** Hóa Quyền nhập Cung Quan Lộc: chính tinh tại Cung Quan Lộc hóa Quyền */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === '官禄');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === '权');
  if (!quanStar) return;
  patterns.push({
    name: '化权入官',
    level: 'good',
    description: `${quanStar.name}化权入官禄宫，主事业有掌控力、能担当独当一面的职位。化权代表权力与执行力——${quanStar.name}化权说明你在事业上能成为决策者或核心执行者，宜走管理或技术权威路线。`,
    palaces: ['官禄'],
    conditions: { required: [`${quanStar.name}化权入官禄宫`] },
    source: '《紫微斗数全书·四化论》',
  });
}

/** Hua Ke entering Life / Body palace: academic distinction bestowed */
/** Hóa Khoa nhập Mệnh / Thân Cung: được ban danh tiếng học vấn */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === '科');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? '化科入命' : '化科入身',
      level: 'good',
      description: `${keStar.name}化科入${isMing ? '命' : '身'}宫，主名声、文书、学术运。倪师讲化科是「贵人星」——${keStar.name}化科带来的是被人看重的特质，宜从事文书、教育、研究、咨询、文创等“以名取利”的方向。`,
      palaces: [isMing ? '命宫' : '身宫'],
      conditions: { required: [`${keStar.name}化科入${isMing ? '命' : '身'}宫`] },
      source: '《紫微斗数全书·四化论》',
    });
    return; // avoid duplicate detection when Life Palace = Body Palace
            // tránh phát hiện trùng lặp khi Mệnh Cung = Thân Cung
  }
}

/** Ji Yue Tong Liang three-star meeting (reduced version): any 3 of Tian Ji/Tai Yin/Tian Tong/Tian Liang in San Fang Si Zheng */
/** Cơ Nguyệt Đồng Lương hội ba sao (bản rút gọn): bất kỳ 3 trong 4 sao Thiên Cơ/Thái Âm/Thiên Đồng/Thiên Lương tại Tam Phương Tứ Chính */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return; // all 4 stars case is handled by detectJiYueTongLiang
                                 // trường hợp đủ 4 sao đã được xử lý bởi detectJiYueTongLiang
  // avoid duplicating detectJiYueTongLiang above (4-star cases don't enter here)
  // tránh trùng lặp với detectJiYueTongLiang ở trên (trường hợp đủ 4 sao không vào đây)
  const missing = ['天机', '太阴', '天同', '天梁'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: '机月同梁三星会',
    level: 'neutral',
    description: `三方四正会齐${has.join('、')}，差${missing.join('、')}未会。机月同梁不全格，文质带谋，但稳定度不如四星齐。仍宜公职、教研、医疗、服务等需要积累与稳定的行业，关键看缺位星与四化的配合。`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`三方四正会${has.join('、')}（机月同梁缺${missing.join('、')}）`] },
    source: '《紫微斗数全书·机月同梁格》（降级版）',
  });
  void ming;
}

/** Chang Qu Tong Hui: Wen Chang + Wen Qu both in Life Palace's San Fang Si Zheng */
/** Xương Khúc Đồng Hội: Văn Xương + Văn Khúc cùng tại Tam Phương Tứ Chính của Mệnh Cung */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('文昌') || !sanFangSet.has('文曲')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, '文昌') && hasStar(ming, '文曲');
  patterns.push({
    name: inMing ? '昌曲坐命' : '昌曲同会',
    level: 'good',
    description: inMing
      ? '文昌文曲同入命宫，主聪明俊秀、文采斐然，宜文学、教育、写作、咨询。最忌化忌——昌曲化忌主文书契约暗亏。'
      : '文昌文曲同会三方四正，主才华横溢、口才文笔俱佳。宜走需要表达与文采的行业，化科加持则名声大显。',
    palaces: ['命宫'],
    conditions: { required: ['文昌、文曲同会命宫三方四正'] },
    source: '《紫微斗数全书·文星论》',
  });
}

/** Fu Bi Tong Hui: Zuo Fu + You Bi both in Life Palace's San Fang Si Zheng */
/** Phù Bật Đồng Hội: Tả Phù + Hữu Bật cùng tại Tam Phương Tứ Chính của Mệnh Cung */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('左辅') || !sanFangSet.has('右弼')) return;
  patterns.push({
    name: '辅弼同会',
    level: 'good',
    description: '左辅右弼同会命宫三方四正，主一生贵人不绝、人缘极佳。最宜领导岗位与团队合作型工作。倪师说「辅弼夹命，平生贵人多」——你不是单打独斗的命，要善用人际网络。',
    palaces: ['命宫'],
    conditions: { required: ['左辅、右弼同会命宫三方四正'] },
    source: '《紫微斗数全书·辅弼论》',
  });
}

/** Kui Yue Tong Hui: Tian Kui + Tian Yue both in Life Palace's San Fang Si Zheng */
/** Khôi Việt Đồng Hội: Thiên Khôi + Thiên Việt cùng tại Tam Phương Tứ Chính của Mệnh Cung */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('天魁') || !sanFangSet.has('天钺')) return;
  patterns.push({
    name: '魁钺同会',
    level: 'good',
    description: '天魁天钺同会命宫三方四正，主"天乙贵人"加持，关键时刻总有贵人提携。倪师说「魁钺夹命，必为贵人」——遇到困难时身边会出现得力相助者，宜主动维护人脉。',
    palaces: ['命宫'],
    conditions: { required: ['天魁、天钺同会命宫三方四正'] },
    source: '《紫微斗数全书·魁钺论》',
  });
}

/** Ke Quan Shuang Hui: Hua Ke + Hua Quan both converge in San Fang Si Zheng */
/** Khoa Quyền Song Hội: Hóa Khoa + Hóa Quyền cùng hội tụ tại Tam Phương Tứ Chính */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === '科') hasKe = true;
      if (s.type === 'major' && s.siHua === '权') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: '科权双会',
    level: 'good',
    description: '化科 + 化权 同会三方四正，主名权双美——既有学识/名声（科），又有掌控力（权），宜走"专业权威"路线（如医生、律师、教授、技术骨干），名利双收且根基扎实。',
    palaces: ['命宫'],
    conditions: { required: ['化科、化权同会命宫三方四正'] },
    source: '《紫微斗数全书·四化会照》',
  });
}

// ────────────────── Main entry point ──────────────────
// ────────────────── Điểm vào chính ──────────────────
export function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return patterns;

  // Superior patterns
  // Cách cục thượng thừa
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);

  // Standard patterns
  // Cách cục tiêu chuẩn
  detectLianXiang(chart, patterns);
  detectWuQiSha(chart, patterns);
  detectTongLiang(chart, patterns);
  detectRiYueTongGong(chart, patterns);
  detectRiYueJiaMing(chart, patterns);
  detectJuRiTongGong(chart, patterns);
  detectShiZhongYinYu(chart, ming, patterns);
  detectMingZhuChuHai(chart, ming, patterns);
  detectZiWeiInMing(chart, ming, patterns);

  // Support patterns
  // Cách cục hỗ trợ
  detectFuBiJiaMing(chart, patterns);
  detectChangQuJiaMing(chart, patterns);
  detectKuiYueJiaMing(chart, patterns);
  detectShuangLuChaoYuan(chart, ming, patterns);
  detectSanQiJiaHui(chart, patterns);
  detectHuaLuRuMing(chart, ming, patterns);

  // Negative patterns
  // Cách cục xấu
  detectHuaJiRuMingQian(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectJuHuoYang(chart, patterns);
  detectLingChangTuoWu(chart, patterns);
  detectMaTouDaiJian(chart, ming, patterns);

  // Basic patterns (improve detection coverage so average charts match 1-3 patterns)
  // Cách cục cơ bản (tăng độ phủ để lá số trung bình khớp 1-3 cách cục)
  detectLuCunShouShen(chart, patterns);
  detectTianMaRuMing(chart, patterns);
  detectHuaLuRuCai(chart, patterns);
  detectHuaQuanRuGuan(chart, patterns);
  detectHuaKeRuMingShen(chart, patterns);
  detectJiYueTongLiangPartial(chart, ming, patterns);
  detectChangQuTongHui(chart, patterns);
  detectFuBiTongHui(chart, patterns);
  detectKuiYueTongHui(chart, patterns);
  detectKeQuanShuangHui(chart, patterns);

  return patterns;
}

// ────────────────── Life Palace summary (backward compatibility) ──────────────────
// ────────────────── Tóm tắt Mệnh Cung (tương thích ngược) ──────────────────
export function getMingGongSummary(chart: ZiweiChart): {
  stars: string[];
  keywords: string[];
  nature: string;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!mingPalace) return { stars: [], keywords: [], nature: '' };

  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  const keywordMap: Record<string, string[]> = {
    '紫微': ['尊贵', '独立', '领导'],
    '天机': ['智慧', '机变', '善谋'],
    '太阳': ['阳刚', '官贵', '慷慨'],
    '武曲': ['财富', '刚毅', '果断'],
    '天同': ['温和', '享福', '随缘'],
    '廉贞': ['才艺', '桃花', '多变'],
    '天府': ['财库', '稳重', '保守'],
    '太阴': ['柔美', '财富', '细腻'],
    '贪狼': ['欲望', '桃花', '多才'],
    '巨门': ['善辩', '多思', '口才'],
    '天相': ['辅佐', '行政', '稳健'],
    '天梁': ['荫护', '医药', '长辈'],
    '七杀': ['将星', '果决', '孤克'],
    '破军': ['开创', '变动', '破旧'],
  };

  const natureMap: Record<string, string> = {
    '紫微': '帝王星', '天机': '智慧星', '太阳': '贵人星',
    '武曲': '财帛星', '天同': '福德星', '廉贞': '桃花星',
    '天府': '财库星', '太阴': '财富星', '贪狼': '桃花星',
    '巨门': '是非星', '天相': '印绶星', '天梁': '荫庇星',
    '七杀': '将帅星', '破军': '变动星',
  };

  const keywords = starNames.flatMap(n => keywordMap[n] ?? []).slice(0, 5);
  const nature = starNames.length > 0 ? (natureMap[starNames[0]] ?? '') : '空宫';

  return { stars: starNames, keywords, nature };
}
