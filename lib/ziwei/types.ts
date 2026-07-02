export interface BirthInfo {
  year: number;      // Gregorian year
                      // năm dương lịch
  month: number;     // Gregorian month (1-12)
                      // tháng dương lịch (1-12)
  day: number;       // Gregorian day
                      // ngày dương lịch
  hour: number;      // shichen branch index (0=子, 1=丑, ... 11=亥)
                      // chỉ số chi giờ (0=子, 1=丑, ... 11=亥)
  gender: 'male' | 'female';
  name?: string;
  province?: string;   // birth province
                        // tỉnh sinh
  city?: string;       // birth city
                        // thành phố sinh
  longitude?: number;  // birth longitude (used for true solar time correction)
                        // kinh độ nơi sinh (dùng để hiệu chỉnh giờ Mặt Trời thực)
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;    // positive = normal, negative = leap month
                          // dương = tháng thường, âm = tháng nhuận
  lunarDay: number;
  yearStem: number;      // 0-9 (甲乙丙丁戊己庚辛壬癸)
                          // 0-9 (Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý)
  yearBranch: number;    // 0-11 (子丑寅卯辰巳午未申酉戌亥)
                          // 0-11 (Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi)
  isLeapMonth: boolean;
}

export type SiHua = '禄' | '权' | '科' | '忌';

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  brightness?: 'bright' | 'normal' | 'dim';  // miao/wang/li/xian brightness levels
                                              // các cấp độ sáng miếu/vượng/lợi/hãm
}

export interface SelfSihuaMark {
  siHua: SiHua;       // 禄/权/科/忌 transformation type
                       // loại hóa 禄/权/科/忌 (Lộc/Quyền/Khoa/Kỵ)
  starName: string;   // the self-transformed star
                       // sao tự hóa
}

export interface Palace {
  branch: number;      // 0-11 (earthly branch index)
                        // 0-11 (chỉ số địa chi)
  stem: number;        // 0-9 (heavenly stem index)
                        // 0-9 (chỉ số thiên can)
  name: string;        // palace name
                        // tên cung
  stars: Star[];
  daXianAge?: [number, number];   // Da Xian age range
                                   // khoảng tuổi của Đại Hạn
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** Palace-stem self-transformation (core of Ni Haixia's system) */
  /** Tự hóa theo can cung (cốt lõi của hệ phái Ni Haixia) */
  selfSihua?: SelfSihuaMark[];
  /** Opposite palace branch index (always = (branch + 6) % 12) */
  /** Chỉ số chi của cung đối diện (luôn bằng (branch + 6) % 12) */
  oppositeBranch?: number;
  /** Whether the palace is empty (no major star) */
  /** Cung có phải là cung vô chính diệu (không có chính tinh) hay không */
  isEmpty?: boolean;
  /** If empty: the branch index of the palace it borrows from = oppositeBranch */
  /** Nếu vô chính diệu: chỉ số chi của cung được mượn sao = oppositeBranch */
  borrowedFromBranch?: number;
  /** If empty: the name of the palace it borrows from */
  /** Nếu vô chính diệu: tên của cung được mượn sao */
  borrowedFromName?: string;
  /** If empty: list of borrowed major star names from the opposite palace (structured; UI layer no longer needs to reverse-look up from text) */
  /** Nếu vô chính diệu: danh sách tên chính tinh mượn từ cung đối diện (dạng có cấu trúc; tầng UI không cần tra ngược từ văn bản nữa) */
  borrowedStars?: string[];
}

export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string;    // Hua Lu star name
                  // tên sao Hóa Lộc
  quan: string;  // Hua Quan star name
                  // tên sao Hóa Quyền
  ke: string;    // Hua Ke star name
                  // tên sao Hóa Khoa
  ji: string;    // Hua Ji star name
                  // tên sao Hóa Kỵ
}

export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number;    // heavenly stem index of the Da Xian palace (for Da Xian Si Hua)
                          // chỉ số thiên can của cung Đại Hạn (dùng cho Tứ Hóa của Đại Hạn)
  stemName?: string;
  siHua?: DaXianSiHua;   // Si Hua for this Da Xian period (based on palace stem)
                          // Tứ Hóa của Đại Hạn này (dựa trên can của cung)
}

export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number;    // Ming Gong (Life Palace) branch
                              // chi cung Mệnh
  shenGongBranch: number;    // Shen Gong (Body Palace) branch
                              // chi cung Thân
  wuxingJu: number;          // Wu Xing ju number (2,3,4,5,6)
                              // số Ngũ Hành Cục (2,3,4,5,6)
  wuxingJuName: string;      // e.g. '水二局'
                              // ví dụ: '水二局' (Thủy Nhị Cục)
  ziweiPos: number;          // Zi Wei star position
                              // vị trí sao Tử Vi
  palaces: Palace[];         // 12 palaces, sorted by branch 0-11
                              // 12 cung, sắp xếp theo chi 0-11
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
}
