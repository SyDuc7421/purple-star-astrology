export interface BirthInfo {
  year: number;      // Gregorian year
  month: number;     // Gregorian month (1-12)
  day: number;       // Gregorian day
  hour: number;      // shichen branch index (0=子, 1=丑, ... 11=亥)
  gender: 'male' | 'female';
  name?: string;
  province?: string;   // birth province
  city?: string;       // birth city
  longitude?: number;  // birth longitude (used for true solar time correction)
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;    // positive = normal, negative = leap month
  lunarDay: number;
  yearStem: number;      // 0-9 (甲乙丙丁戊己庚辛壬癸)
  yearBranch: number;    // 0-11 (子丑寅卯辰巳午未申酉戌亥)
  isLeapMonth: boolean;
}

export type SiHua = '禄' | '权' | '科' | '忌';

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  brightness?: 'bright' | 'normal' | 'dim';  // miao/wang/li/xian brightness levels
}

export interface SelfSihuaMark {
  siHua: SiHua;       // 禄/权/科/忌 transformation type
  starName: string;   // the self-transformed star
}

export interface Palace {
  branch: number;      // 0-11 (earthly branch index)
  stem: number;        // 0-9 (heavenly stem index)
  name: string;        // palace name
  stars: Star[];
  daXianAge?: [number, number];   // Da Xian age range
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** Palace-stem self-transformation (core of Ni Haixia's system) */
  selfSihua?: SelfSihuaMark[];
  /** Opposite palace branch index (always = (branch + 6) % 12) */
  oppositeBranch?: number;
  /** Whether the palace is empty (no major star) */
  isEmpty?: boolean;
  /** If empty: the branch index of the palace it borrows from = oppositeBranch */
  borrowedFromBranch?: number;
  /** If empty: the name of the palace it borrows from */
  borrowedFromName?: string;
  /** If empty: list of borrowed major star names from the opposite palace (structured; UI layer no longer needs to reverse-look up from text) */
  borrowedStars?: string[];
}

export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string;    // Hua Lu star name
  quan: string;  // Hua Quan star name
  ke: string;    // Hua Ke star name
  ji: string;    // Hua Ji star name
}

export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number;    // heavenly stem index of the Da Xian palace (for Da Xian Si Hua)
  stemName?: string;
  siHua?: DaXianSiHua;   // Si Hua for this Da Xian period (based on palace stem)
}

export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number;    // Ming Gong (Life Palace) branch
  shenGongBranch: number;    // Shen Gong (Body Palace) branch
  wuxingJu: number;          // Wu Xing ju number (2,3,4,5,6)
  wuxingJuName: string;      // e.g. '水二局'
  ziweiPos: number;          // Zi Wei star position
  palaces: Palace[];         // 12 palaces, sorted by branch 0-11
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
}
