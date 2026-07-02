/**
 * Ni Haixia Tian Ji / Di Ji / Ren Ji — shared type definitions
 * Ni Haixia Tian Ji / Di Ji / Ren Ji — các định nghĩa kiểu dùng chung
 */

/** Three Ji category */
/** Danh mục Tam Ji (Tian Ji / Di Ji / Ren Ji) */
export type SanJiCategory = 'tianji' | 'diji' | 'renji';

/** Course / module */
/** Khóa học / học phần */
export interface NiModule {
  id: string;
  category: SanJiCategory;
  /** Chinese name */
  /** Tên tiếng Trung */
  name: string;
  /** English name */
  /** Tên tiếng Anh */
  nameEn: string;
  /** Short subtitle */
  /** Phụ đề ngắn */
  subtitle: string;
  /** Brief description */
  /** Mô tả ngắn gọn */
  description: string;
  /** Detailed introduction (multiple paragraphs) */
  /** Giới thiệu chi tiết (nhiều đoạn văn) */
  details: string[];
  /** School / lineage */
  /** Trường phái / dòng truyền thừa */
  school?: string;
  /** Session info */
  /** Thông tin buổi học */
  lessons?: string;
  /** Reference texts */
  /** Tài liệu tham khảo */
  references: string[];
  /** Core concepts / keywords */
  /** Khái niệm cốt lõi / từ khóa */
  keywords: string[];
  /** Icon character */
  /** Ký tự biểu tượng */
  icon: string;
  /** Status */
  /** Trạng thái */
  status: 'active' | 'preview' | 'coming';
  /** Sort weight */
  /** Trọng số sắp xếp */
  order: number;
  /** Route slug */
  /** Slug định tuyến */
  slug: string;
  /** Sub-chapters */
  /** Các chương con */
  chapters: NiChapter[];
}

/** Chapter */
/** Chương */
export interface NiChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** Key points */
  /** Các điểm chính */
  keyPoints: string[];
  /** Ni Haixia quotes */
  /** Trích dẫn của Ni Haixia */
  quotes?: string[];
  /** Sort order */
  /** Thứ tự sắp xếp */
  order: number;
}

/** I Ching 64 hexagrams */
/** 64 quẻ Kinh Dịch */
export interface Hexagram {
  number: number;
  name: string;
  /** Hexagram description, e.g. "Tian Ze Lü" */
  /** Mô tả quẻ, ví dụ "Tian Ze Lü" */
  composition: string;
  /** Upper trigram */
  /** Quẻ thượng (thượng quái) */
  upper: string;
  /** Lower trigram */
  /** Quẻ hạ (hạ quái) */
  lower: string;
  /** Gua Ci key points */
  /** Các điểm chính của Quái Từ */
  meaning: string;
  /** Ni Haixia explanation highlights */
  /** Những điểm giải thích nổi bật của Ni Haixia */
  niInterpretation: string;
  /** Divination key maxim */
  /** Châm ngôn trọng yếu khi bói quẻ */
  divination: string;
}

/** Feng shui / geomancy entry */
/** Mục phong thủy / địa lý */
export interface FengShuiEntry {
  id: string;
  title: string;
  category: 'yangzhai' | 'yinzhai' | 'theory';
  description: string;
  keyPoints: string[];
}

/** Ren Ji traditional medicine entry */
/** Mục y học cổ truyền Ren Ji */
export interface MedicalEntry {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  keyPoints: string[];
  relatedHerbs?: string[];
  relatedAcupoints?: string[];
}

/** Acupuncture clinical experience point */
/** Điểm kinh nghiệm lâm sàng châm cứu */
export interface AcuExperience {
  id: number;
  /** Indication / condition */
  /** Chỉ định / bệnh trạng */
  condition: string;
  /** Acupoint combination */
  /** Tổ hợp huyệt vị */
  acupoints: string;
  /** Category */
  /** Danh mục */
  category: string;
  /** Additional notes */
  /** Ghi chú bổ sung */
  note?: string;
}

/** Through-needling technique */
/** Kỹ thuật xuyên châm */
export interface TransNeedling {
  id: number;
  /** Through-needling pair: A through B */
  /** Cặp xuyên châm: A xuyên B */
  combo: string;
  /** Symptoms treated */
  /** Triệu chứng điều trị */
  indication: string;
  /** Supplementary acupoints */
  /** Huyệt vị bổ trợ */
  supporting?: string;
  /** Source */
  /** Nguồn */
  source: string;
}

/** Han Tang formula */
/** Bài thuốc Han Tang */
export interface HantangFormula {
  id: number;
  /** Formula name (e.g. "Bai Dai Wan", "Da Yu Wan") */
  /** Tên bài thuốc (ví dụ "Bai Dai Wan", "Da Yu Wan") */
  name: string;
  /** Primary indication */
  /** Chỉ định chính */
  indication: string;
  /** Core theory (one sentence) */
  /** Lý luận cốt lõi (một câu) */
  theory?: string;
  /** Main ingredients (publicly disclosed portion) */
  /** Thành phần chính (phần được công khai) */
  ingredients?: string;
}

/** Classical formula */
/** Bài thuốc cổ phương */
export interface ClassicFormula {
  id: string;
  /** Formula name */
  /** Tên bài thuốc */
  name: string;
  /** Source text */
  /** Văn bản nguồn */
  source: string;
  /** Ingredient herbs */
  /** Các vị thuốc thành phần */
  composition: string;
  /** Primary indications */
  /** Chỉ định chính */
  indication: string;
  /** Ni Haixia usage notes */
  /** Ghi chú sử dụng của Ni Haixia */
  niUsage?: string;
}

/** Tian Ji course episode structure */
/** Cấu trúc tập bài giảng khóa Tian Ji */
export interface TianjiEpisode {
  /** DVD number 1-24 */
  /** Số DVD 1-24 */
  dvd: number;
  /** First-half topic */
  /** Chủ đề nửa đầu */
  firstHalf: string;
  /** Second-half topic */
  /** Chủ đề nửa sau */
  secondHalf: string;
  /** Key content */
  /** Nội dung trọng tâm */
  highlights: string[];
}
