// Heavenly Stems
// Giáp/Ất/Bính/Đinh/Mậu/Kỷ/Canh/Tân/Nhâm/Quý
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Earthly Branches
// Địa Chi
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Shichen → earthly branch mapping
// Ánh xạ giờ Thìn Chi (Shichen) sang địa chi
export const SHICHEN = [
  { branch: 0, name: '子时', range: '23:00-01:00' },
  { branch: 1, name: '丑时', range: '01:00-03:00' },
  { branch: 2, name: '寅时', range: '03:00-05:00' },
  { branch: 3, name: '卯时', range: '05:00-07:00' },
  { branch: 4, name: '辰时', range: '07:00-09:00' },
  { branch: 5, name: '巳时', range: '09:00-11:00' },
  { branch: 6, name: '午时', range: '11:00-13:00' },
  { branch: 7, name: '未时', range: '13:00-15:00' },
  { branch: 8, name: '申时', range: '15:00-17:00' },
  { branch: 9, name: '酉时', range: '17:00-19:00' },
  { branch: 10, name: '戌时', range: '19:00-21:00' },
  { branch: 11, name: '亥时', range: '21:00-23:00' },
];

// 12 palace names, clockwise from Ming Gong (Life Palace)
// Tên 12 cung, theo chiều kim đồng hồ bắt đầu từ Mệnh Cung
export const PALACE_NAMES_ORDER = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

// Na Yin Wu Xing (element for each of the 30 stem-branch pairs)
// Nạp Âm Ngũ Hành (ngũ hành cho mỗi cặp trong 30 cặp can-chi)
export const NAYIN_ELEMENTS = [
  '金','火','木','土','金','火','水','土','金','木',
  '水','土','火','木','水','金','火','木','土','金',
  '火','水','土','金','木','水','土','火','木','水'
];

// Wu Xing element → ju number
// Ánh xạ ngũ hành sang số cục
export const ELEMENT_TO_JU: Record<string, number> = {
  '水': 2, '木': 3, '金': 4, '土': 5, '火': 6
};

// Ju number names
// Tên các cục theo số
export const JU_NAMES: Record<number, string> = {
  2: '水二局', 3: '木三局', 4: '金四局', 5: '土五局', 6: '火六局'
};

// Si Hua table (year stem → [Hua Lu, Hua Quan, Hua Ke, Hua Ji])
// Bảng Tứ Hóa (thiên can năm sinh → [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ])
export const SI_HUA_TABLE: Record<number, [string, string, string, string]> = {
  0: ['廉贞', '破军', '武曲', '太阳'],   // jia
  // giáp
  1: ['天机', '天梁', '紫微', '太阴'],   // yi
  // ất
  2: ['天同', '天机', '文昌', '廉贞'],   // bing
  // bính
  3: ['太阴', '天同', '天机', '巨门'],   // ding
  // đinh
  4: ['贪狼', '太阴', '右弼', '天机'],   // wu
  // mậu
  5: ['武曲', '贪狼', '天梁', '文曲'],   // ji
  // kỷ
  6: ['太阳', '武曲', '太阴', '天同'],   // geng
  // canh
  7: ['巨门', '太阳', '文曲', '文昌'],   // xin
  // tân
  8: ['天梁', '紫微', '左辅', '武曲'],   // ren
  // nhâm
  9: ['破军', '巨门', '太阴', '贪狼'],   // gui
  // quý
};

// Tian Kui / Tian Yue table (year stem → [Tian Kui branch, Tian Yue branch])
// Bảng Thiên Khôi / Thiên Việt (thiên can năm sinh → [chi của Thiên Khôi, chi của Thiên Việt])
export const TIANKUI_TABLE: Record<number, [number, number]> = {
  0: [1, 7],   // jia: kui-chou yue-wei
  // giáp: khôi tại sửu, việt tại mùi
  1: [0, 8],   // yi: kui-zi yue-shen
  // ất: khôi tại tý, việt tại thân
  2: [11, 9],  // bing: kui-hai yue-you
  // bính: khôi tại hợi, việt tại dậu
  3: [11, 9],  // ding: kui-hai yue-you
  // đinh: khôi tại hợi, việt tại dậu
  4: [1, 7],   // wu: kui-chou yue-wei
  // mậu: khôi tại sửu, việt tại mùi
  5: [0, 8],   // ji: kui-zi yue-shen
  // kỷ: khôi tại tý, việt tại thân
  6: [1, 7],   // geng: kui-chou yue-wei
  // canh: khôi tại sửu, việt tại mùi
  7: [6, 2],   // xin: kui-wu-noon yue-yin
  // tân: khôi tại ngọ, việt tại dần
  8: [3, 5],   // ren: kui-mao yue-si
  // nhâm: khôi tại mão, việt tại tỵ
  9: [3, 5],   // gui: kui-mao yue-si
  // quý: khôi tại mão, việt tại tỵ
};

// Lu Cun table (year stem → Lu Cun branch)
// Bảng Lộc Tồn (thiên can năm sinh → chi của Lộc Tồn)
export const LUCUN_TABLE: Record<number, number> = {
  0: 2,   // jia: yin
  // giáp: dần
  1: 3,   // yi: mao
  // ất: mão
  2: 5,   // bing: si
  // bính: tỵ
  3: 6,   // ding: wu-noon
  // đinh: ngọ
  4: 5,   // wu: si
  // mậu: tỵ
  5: 6,   // ji: wu-noon
  // kỷ: ngọ
  6: 8,   // geng: shen
  // canh: thân
  7: 9,   // xin: you
  // tân: dậu
  8: 11,  // ren: hai
  // nhâm: hợi
  9: 0,   // gui: zi
  // quý: tý
};

// Tian Ma table (year branch San He grouping → Tian Ma branch)
// Bảng Thiên Mã (nhóm Tam Hợp của địa chi năm sinh → chi của Thiên Mã)
// Yin/Wu/Xu→Shen, Shen/Zi/Chen→Yin, Si/You/Chou→Hai, Hai/Mao/Wei→Si
// Dần/Ngọ/Tuất→Thân, Thân/Tý/Thìn→Dần, Tỵ/Dậu/Sửu→Hợi, Hợi/Mão/Mùi→Tỵ
export const TIANMA_TABLE: Record<number, number> = {
  2: 8,   // yin year → shen
  // năm dần → thân
  6: 8,   // wu-noon year → shen
  // năm ngọ → thân
  10: 8,  // xu year → shen
  // năm tuất → thân
  8: 2,   // shen year → yin
  // năm thân → dần
  0: 2,   // zi year → yin
  // năm tý → dần
  4: 2,   // chen year → yin
  // năm thìn → dần
  5: 11,  // si year → hai
  // năm tỵ → hợi
  9: 11,  // you year → hai
  // năm dậu → hợi
  1: 11,  // chou year → hai
  // năm sửu → hợi
  11: 5,  // hai year → si
  // năm hợi → tỵ
  3: 5,   // mao year → si
  // năm mão → tỵ
  7: 5,   // wei year → si
  // năm mùi → tỵ
};

// Major star brightness table [branch]: brightness mapping
// Bảng độ sáng sao chính tinh theo [chi]: ánh xạ độ sáng
// miao(bright) wang(bright) li(normal) ping(normal) buli(dim) xian(dim)
// miếu(sáng) vượng(sáng) lợi(bình hòa) bình(bình hòa) bất lợi(tối) hãm(tối)
export const STAR_BRIGHTNESS: Record<string, Record<number, string>> = {
  '紫微': { 2:   'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            1: 'normal', 4: 'normal', 7: 'bright', 10: 'normal',
            0: 'normal', 3: 'dim', 6: 'dim', 9: 'normal' },
  '天机': { 5: 'bright', 11: 'bright', 3: 'bright', 9: 'bright',
            1: 'normal', 7: 'normal', 2: 'dim', 8: 'dim',
            0: 'normal', 4: 'normal', 6: 'normal', 10: 'normal' },
  '太阳': { 3: 'bright', 4: 'bright', 5: 'bright', 6: 'bright',
            7: 'normal', 8: 'normal', 9: 'normal', 10: 'dim',
            11: 'dim', 0: 'dim', 1: 'dim', 2: 'normal' },
  '武曲': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  '天同': { 0: 'bright', 3: 'bright', 6: 'bright', 9: 'bright',
            2: 'normal', 5: 'normal', 8: 'normal', 11: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
  '廉贞': { 2: 'bright', 5: 'bright', 8: 'bright', 11: 'bright',
            0: 'normal', 3: 'normal', 6: 'normal', 9: 'normal',
            1: 'dim', 4: 'dim', 7: 'dim', 10: 'dim' },
};

// Major star descriptions (Ni Haixia system)
// Mô tả chính tinh (theo hệ thống Ni Haixia)
export const STAR_DESCRIPTIONS: Record<string, { keywords: string; nature: string; element: string }> = {
  '紫微': { keywords: '帝王·尊贵·独立', nature: '中性偏吉', element: '土' },
  '天机': { keywords: '智慧·机变·谋略', nature: '吉星', element: '木' },
  '太阳': { keywords: '阳刚·官贵·慷慨', nature: '吉星', element: '火' },
  '武曲': { keywords: '财富·刚毅·果断', nature: '中性', element: '金' },
  '天同': { keywords: '温和·享福·随缘', nature: '吉星', element: '水' },
  '廉贞': { keywords: '才艺·刑囚·桃花', nature: '凶中带吉', element: '火' },
  '天府': { keywords: '财库·稳重·保守', nature: '吉星', element: '土' },
  '太阴': { keywords: '柔美·财富·阴柔', nature: '吉星', element: '水' },
  '贪狼': { keywords: '欲望·桃花·多才', nature: '中性', element: '木' },
  '巨门': { keywords: '口舌·是非·善辩', nature: '凶中带吉', element: '水' },
  '天相': { keywords: '辅佐·行政·印绶', nature: '吉星', element: '水' },
  '天梁': { keywords: '荫护·医药·长辈', nature: '吉星', element: '土' },
  '七杀': { keywords: '将星·果决·孤克', nature: '凶星', element: '金' },
  '破军': { keywords: '开创·变动·破坏', nature: '凶星', element: '水' },
};
