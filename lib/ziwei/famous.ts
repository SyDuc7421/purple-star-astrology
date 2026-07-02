/**
 * Famous person chart database
 * Cơ sở dữ liệu lá số người nổi tiếng
 * Birth dates from public records; birth hours are estimates (some have documented sources)
 * Ngày sinh lấy từ tư liệu công khai; giờ sinh là ước tính (một số có nguồn dẫn chứng)
 */

export interface FamousPerson {
  id: string;
  name: string;
  category: '商业' | '文艺' | '历史' | '体育' | '科技';
  description: string;           // one-line identity description
                                  // mô tả danh tính ngắn gọn
  year: number;
  month: number;
  day: number;
  hour: number;                  // shichen branch index 0-11
                                  // chỉ số chi giờ 0-11
  gender: 'male' | 'female';
  notable: string;               // chart highlight (to spark user interest)
                                  // điểm nổi bật của lá số (để tạo hứng thú cho người dùng)
}

export const FAMOUS_PERSONS: FamousPerson[] = [
  // ─── Business legends ──────────────────────────────────────
  // ─── Huyền thoại kinh doanh ──────────────────────────────────────
  {
    id: 'ma-yun',
    name: '马云',
    category: '商业',
    description: '阿里巴巴创始人',
    year: 1964, month: 9, day: 10, hour: 5,  // approx. Wu (noon) shichen
                                              // ước tính giờ Ngọ (buổi trưa)
    gender: 'male',
    notable: '命盘显示极强的破格重建之力，官禄宫星曜与互联网商业帝国高度对应',
  },
  {
    id: 'li-jiacheng',
    name: '李嘉诚',
    category: '商业',
    description: '香港超级富豪，长和系创始人',
    year: 1928, month: 7, day: 29, hour: 3,  // approx. Yin (3-5am) shichen
                                              // ước tính giờ Dần (3-5 giờ sáng)
    gender: 'male',
    notable: '财帛宫四化是研究东方首富命盘的绝佳案例，禄存守财，越积越厚',
  },
  {
    id: 'ren-zhengfei',
    name: '任正非',
    category: '商业',
    description: '华为创始人',
    year: 1944, month: 10, day: 25, hour: 3, // Yin (3-5am) shichen
                                              // giờ Dần (3-5 giờ sáng)
    gender: 'male',
    notable: '七杀入命格局，一生逆风而行，越打压越强大，倪师七杀理论的活教材',
  },

  // ─── Arts & entertainment ──────────────────────────────────
  // ─── Nghệ thuật & giải trí ──────────────────────────────────
  {
    id: 'zhang-ailing',
    name: '张爱玲',
    category: '文艺',
    description: '中国现代文学巨匠',
    year: 1920, month: 9, day: 30, hour: 1, // Chou (1-3am) shichen
                                             // giờ Sửu (1-3 giờ sáng)
    gender: 'female',
    notable: '命盘孤独星曜组合与其传奇感情经历、文学成就形成神奇对照',
  },
  {
    id: 'jay-chou',
    name: '周杰伦',
    category: '文艺',
    description: '华语流行音乐天王',
    year: 1979, month: 1, day: 18, hour: 1,  // Chou (1-3am) shichen (reported born at night)
                                              // giờ Sửu (1-3 giờ sáng) (theo ghi nhận sinh vào ban đêm)
    gender: 'male',
    notable: '文曲星与贪狼的组合，天生才艺之命，命盘解释了他为何能横跨音乐各风格',
  },
  {
    id: 'wang-fei',
    name: '王菲',
    category: '文艺',
    description: '华语乐坛最具传奇色彩的女歌手',
    year: 1969, month: 8, day: 8, hour: 4,   // Mao (5-7am) shichen
                                              // giờ Mão (5-7 giờ sáng)
    gender: 'female',
    notable: '夫妻宫星曜与其两段传奇婚姻高度对应，感情格局极具研究价值',
  },
  {
    id: 'lin-zhiling',
    name: '林志玲',
    category: '文艺',
    description: '台湾名模、演员',
    year: 1974, month: 11, day: 29, hour: 5, // Wu (11am-1pm) shichen
                                              // giờ Ngọ (11 giờ sáng - 1 giờ chiều)
    gender: 'female',
    notable: '太阴守命的女性美貌典范，命盘完美印证倪师"太阴入命女孩最漂亮"的论断',
  },

  // ─── Technology leaders ───────────────────────────────────
  // ─── Lãnh đạo công nghệ ───────────────────────────────────
  {
    id: 'steve-jobs',
    name: '乔布斯',
    category: '科技',
    description: '苹果公司联合创始人',
    year: 1955, month: 2, day: 24, hour: 6,  // Wu (11am-1pm) shichen
                                              // giờ Ngọ (11 giờ sáng - 1 giờ chiều)
    gender: 'male',
    notable: '破军入命格局，被亲生父母遗弃又创建苹果帝国，破而后立的命盘典范',
  },
  {
    id: 'elon-musk',
    name: '马斯克',
    category: '科技',
    description: '特斯拉、SpaceX创始人',
    year: 1971, month: 6, day: 28, hour: 4,  // Mao (5-7am) shichen
                                              // giờ Mão (5-7 giờ sáng)
    gender: 'male',
    notable: '杀破狼格局的极致体现，命盘中驿马星旺盛，一生在改变人类未来边界',
  },

  // ─── Sports stars ──────────────────────────────────────────
  // ─── Ngôi sao thể thao ──────────────────────────────────────────
  {
    id: 'yao-ming',
    name: '姚明',
    category: '体育',
    description: 'NBA传奇中锋，中国篮球代言人',
    year: 1980, month: 9, day: 12, hour: 5,  // Wu (11am-1pm) shichen
                                              // giờ Ngọ (11 giờ sáng - 1 giờ chiều)
    gender: 'male',
    notable: '天梁守命，高大威严，官禄宫星象与其职业成就高度吻合',
  },
  {
    id: 'li-na',
    name: '李娜',
    category: '体育',
    description: '中国网球大满贯得主',
    year: 1982, month: 2, day: 26, hour: 2,  // Yin (3-5am) shichen
                                              // giờ Dần (3-5 giờ sáng)
    gender: 'female',
    notable: '七杀化气，命中注定与人竞争，大限流年与法网夺冠时间点精准对应',
  },
];

/** Get famous persons by category */
/** Lấy danh sách người nổi tiếng theo danh mục */
export function getFamousByCategory(category: FamousPerson['category']): FamousPerson[] {
  return FAMOUS_PERSONS.filter(p => p.category === category);
}

/** Get all categories */
/** Lấy toàn bộ danh mục */
export const FAMOUS_CATEGORIES: FamousPerson['category'][] = [
  '商业', '文艺', '科技', '体育',
];
