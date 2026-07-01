/**
 * Ni Haixia Tian Ji / Di Ji / Ren Ji — shared type definitions
 */

/** Three Ji category */
export type SanJiCategory = 'tianji' | 'diji' | 'renji';

/** Course / module */
export interface NiModule {
  id: string;
  category: SanJiCategory;
  /** Chinese name */
  name: string;
  /** English name */
  nameEn: string;
  /** Short subtitle */
  subtitle: string;
  /** Brief description */
  description: string;
  /** Detailed introduction (multiple paragraphs) */
  details: string[];
  /** School / lineage */
  school?: string;
  /** Session info */
  lessons?: string;
  /** Reference texts */
  references: string[];
  /** Core concepts / keywords */
  keywords: string[];
  /** Icon character */
  icon: string;
  /** Status */
  status: 'active' | 'preview' | 'coming';
  /** Sort weight */
  order: number;
  /** Route slug */
  slug: string;
  /** Sub-chapters */
  chapters: NiChapter[];
}

/** Chapter */
export interface NiChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** Key points */
  keyPoints: string[];
  /** Ni Haixia quotes */
  quotes?: string[];
  /** Sort order */
  order: number;
}

/** I Ching 64 hexagrams */
export interface Hexagram {
  number: number;
  name: string;
  /** Hexagram description, e.g. "Tian Ze Lü" */
  composition: string;
  /** Upper trigram */
  upper: string;
  /** Lower trigram */
  lower: string;
  /** Gua Ci key points */
  meaning: string;
  /** Ni Haixia explanation highlights */
  niInterpretation: string;
  /** Divination key maxim */
  divination: string;
}

/** Feng shui / geomancy entry */
export interface FengShuiEntry {
  id: string;
  title: string;
  category: 'yangzhai' | 'yinzhai' | 'theory';
  description: string;
  keyPoints: string[];
}

/** Ren Ji traditional medicine entry */
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
export interface AcuExperience {
  id: number;
  /** Indication / condition */
  condition: string;
  /** Acupoint combination */
  acupoints: string;
  /** Category */
  category: string;
  /** Additional notes */
  note?: string;
}

/** Through-needling technique */
export interface TransNeedling {
  id: number;
  /** Through-needling pair: A through B */
  combo: string;
  /** Symptoms treated */
  indication: string;
  /** Supplementary acupoints */
  supporting?: string;
  /** Source */
  source: string;
}

/** Han Tang formula */
export interface HantangFormula {
  id: number;
  /** Formula name (e.g. "Bai Dai Wan", "Da Yu Wan") */
  name: string;
  /** Primary indication */
  indication: string;
  /** Core theory (one sentence) */
  theory?: string;
  /** Main ingredients (publicly disclosed portion) */
  ingredients?: string;
}

/** Classical formula */
export interface ClassicFormula {
  id: string;
  /** Formula name */
  name: string;
  /** Source text */
  source: string;
  /** Ingredient herbs */
  composition: string;
  /** Primary indications */
  indication: string;
  /** Ni Haixia usage notes */
  niUsage?: string;
}

/** Tian Ji course episode structure */
export interface TianjiEpisode {
  /** DVD number 1-24 */
  dvd: number;
  /** First-half topic */
  firstHalf: string;
  /** Second-half topic */
  secondHalf: string;
  /** Key content */
  highlights: string[];
}
