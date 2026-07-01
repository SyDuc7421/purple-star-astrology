# Chinese → English Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate every Chinese comment, JSDoc block, and hardcoded UI string in the codebase to English so developers and English-speaking users can fully read and use the project.

**Architecture:** Work file-by-file in six task groups: docs first, then lib infrastructure, then lib knowledge modules, then lib/classics and lib/nihai, then components, then app pages. Each task commits cleanly so the branch is always in a buildable state.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS. No test framework is present; verification is `npm run build` + grep count.

## Global Constraints

- **NEVER translate Chinese strings that are used as identifiers matched against `iztro` or `lunar-javascript` output.** These include: star names (`'紫微'`, `'天机'`, etc.), stems (`'甲'`…`'癸'`), branches (`'子'`…`'亥'`), SiHua characters (`'禄'`, `'权'`, `'科'`, `'忌'`), brightness values (`'庙'`, `'旺'`, `'陷'`, `'不'`), palace names (`'命宫'`, `'夫妻宫'`, etc.), element names (`'水'`, `'木'`, `'金'`, `'土'`, `'火'`), shichen names (`'子时'`, `'丑时'`, etc.), and similar domain-identifier strings. Changing them would break string comparisons with third-party library output.
- **Do NOT translate** the actual classical text content in `lib/classics/data/` (骨髓赋, 全集, 全书) — these are primary source documents in literary Chinese.
- **Do NOT translate** biographical/knowledge content body strings in `lib/nihai/tianji.ts`, `lib/nihai/diji.ts`, `lib/nihai/renji.ts` (the actual values like names, dates, descriptions in Chinese).
- **DO translate** everything else: `//` comments, `/** */` JSDoc, `/* */` block comments, and hardcoded strings visible to developers or users.
- After every task: run `npm run build` and confirm it exits 0.
- Commit each task separately.

---

## File Map

| File | Change type |
|---|---|
| `README.md` | Full translation |
| `lib/ziwei/algorithm.ts` | Comments only |
| `lib/ziwei/types.ts` | Comments only |
| `lib/ziwei/sihua.ts` | Comments only |
| `lib/ziwei/history.ts` | Comments + label-building strings |
| `lib/ziwei/share.ts` | Comments + label strings |
| `lib/ziwei/db-analysis.ts` | Comments + non-identifier strings |
| `lib/ziwei/constants.ts` | Comments only (all values are domain identifiers) |
| `lib/ziwei/patterns.ts` | Comments only (condition strings and source strings are domain data) |
| `lib/ziwei/heming-knowledge.ts` | Comments only (content values are domain data) |
| `lib/ziwei/cities.ts` | Comments only (city names stay Chinese — they're data) |
| `lib/ziwei/famous.ts` | Comments + developer-facing strings (famous person names/dates stay Chinese) |
| `lib/classics/types.ts` | Comments only |
| `lib/classics/index.ts` | Comments only |
| `lib/nihai/types.ts` | Comments only |
| `lib/nihai/index.ts` | Comments only (biography content values stay Chinese) |
| `lib/nihai/tianji.ts` | Comments only |
| `lib/nihai/diji.ts` | Comments only |
| `lib/nihai/renji.ts` | Comments only |
| `lib/seo/knowledge.ts` | Comments + any developer-facing strings |
| `components/BirthForm.tsx` | Comments + all UI strings (labels, placeholders, errors, button text) |
| `components/ChartBoard.tsx` | Comments + UI strings |
| `components/InsightPanel.tsx` | Comments + tab labels + prompt templates |
| `components/PalaceCell.tsx` | Comments + UI strings |
| `components/TimeNav.tsx` | Comments + UI strings |
| `components/StarDetailPanel.tsx` | Comments + UI strings |
| `components/ChatPanel.tsx` | Comments + UI strings |
| `components/ShareModal.tsx` | Comments + UI strings |
| `components/ShareCardCanvas.tsx` | Comments + UI strings |
| `components/AnnouncementModal.tsx` | Comments + UI strings |
| `components/ScrollIntro.tsx` | Comments + UI strings |
| `components/ChartSummary.tsx` | Comments + UI strings |
| `components/FamousPersonCard.tsx` | Comments + UI strings |
| `components/PatternsCard.tsx` | Comments + UI strings |
| `components/StarField.tsx` | Comments + UI strings |
| `app/layout.tsx` | Comments + metadata strings |
| `app/page.tsx` | Comments + all UI strings |
| `app/chart/page.tsx` | Comments + UI strings |
| `app/heming/page.tsx` | Comments + UI strings |
| `app/knowledge/page.tsx` | Comments + UI strings |
| `app/library/page.tsx` | Comments + UI strings |
| `app/library/LibrarySearch.tsx` | Comments + UI strings |
| `app/library/search/page.tsx` | Comments + UI strings |
| `app/preview/page.tsx` | Comments + UI strings |
| `app/privacy/page.tsx` | Full page content translation |
| `app/terms/page.tsx` | Full page content translation |
| `app/sitemap.ts` | Comments + strings |

---

## Task 1: README.md

**Files:**
- Modify: `README.md`

**Scope:** Translate every section to English. Keep URLs, command blocks, and file paths unchanged. Keep Chinese product names (紫微斗数, 王多鱼AI, 倪海夏, etc.) as romanised/translated: "Zi Wei Dou Shu", "Wang Duoyu AI", "Ni Haixia", etc. in the first mention, then English short form thereafter.

- [ ] **Step 1: Translate README.md**

Replace the entire file with an English translation. Key translation reference:
- 紫微斗数 → "Zi Wei Dou Shu (Purple Star Astrology)"
- 排盘 → "chart calculation" / "chart generation"
- 命盘 → "natal chart" / "birth chart"
- 四化飞星 → "Si Hua flying star transformation"
- 格局 → "chart pattern"
- 大限 → "decade luck period (Da Xian)"
- 流年 → "annual luck (Liu Nian)"
- 古籍 → "classical texts"
- 骨髓赋 → "Gu Sui Fu (Bone Marrow Ode)"
- 倪海夏《天纪》→ "Ni Haixia's 'Tian Ji' lecture series"
- 命理百科 → "astrology encyclopedia"
- 合盘 → "compatibility reading (He Ming)"
- 宫位 → "palace"
- 主星 → "major star"
- ICP 备案 → "ICP filing (Chinese regulatory registration)"

- [ ] **Step 2: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 3: Verify no untranslated prose remains**

```bash
grep -c "[一-鿿]" README.md
```
Expected: 0 (all prose translated; any remaining are only in code blocks or URLs which are exempt).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: translate README to English"
```

---

## Task 2: lib/ziwei/ infrastructure files — comments and label strings

**Files:**
- Modify: `lib/ziwei/algorithm.ts`
- Modify: `lib/ziwei/types.ts`
- Modify: `lib/ziwei/sihua.ts`
- Modify: `lib/ziwei/history.ts`
- Modify: `lib/ziwei/share.ts`
- Modify: `lib/ziwei/db-analysis.ts`

**Scope:** Translate all `//` comments, `/** */` JSDoc, and `/* */` block comments. In `history.ts` and `share.ts`, also translate the label-building strings used in `HistoryEntry.label` (these show in UI). Do NOT touch star name strings, SiHua character literals, or palace name strings used in logic comparisons.

**Translation examples — algorithm.ts:**

```typescript
// BEFORE:
/**
 * 紫微斗数排盘算法 — 基于 iztro 开源库
 * https://github.com/SylarLong/iztro
 */

// AFTER:
/**
 * Zi Wei Dou Shu chart calculation algorithm — built on iztro open-source library
 * https://github.com/SylarLong/iztro
 */
```

```typescript
// BEFORE:
// 飞星派工具仅供导出，不再在排盘时调用（倪师《天纪 03》：四化星永远固定不动）
// AFTER:
// Si Hua flying-star tools are exported only; no longer called during chart generation
// (Ni Haixia, "Tian Ji 03": the four Si Hua transformations are always fixed)
```

```typescript
// BEFORE:
// ─── 农历信息（兼容保留）────────────────────────────────────────
// AFTER:
// ─── Lunar calendar info (kept for compatibility) ───────────────
```

```typescript
// BEFORE:
// ─── 亮度映射 ────────────────────────────────────────────────────
// AFTER:
// ─── Brightness mapping ─────────────────────────────────────────
```

```typescript
// BEFORE:
// ─── 星曜类型映射 ────────────────────────────────────────────────
// AFTER:
// ─── Star type mapping ──────────────────────────────────────────
```

```typescript
// BEFORE:
// ─── 五行局名称 → 数字 ──────────────────────────────────────────
// AFTER:
// ─── Wu Xing ju name → number ───────────────────────────────────
```

```typescript
// BEFORE:
// ─── 主函数：生成命盘 ────────────────────────────────────────────
// AFTER:
// ─── Main function: generate birth chart ────────────────────────
```

```typescript
// BEFORE:
  // 调用 iztro 排盘
  // ── 组装十二宫 ──
  // 合并所有星：主星 + 次星 + 杂耀
// AFTER:
  // Call iztro to generate chart
  // ── Assemble the 12 palaces ──
  // Merge all stars: major + minor + auxiliary
```

```typescript
// BEFORE:
  // ── 当前年龄 & 大限 ──
  // ── 借对宫结构化字段（codex P0：避免文案层从自然语言反查借宫信息）──
  // ── 关键宫支 ──
  // ── 紫微星位置 ──
  // ── 大限数组（倪师《天纪》正统：四化永远固定，大限只看宫位移动）──
  // 不再生成 daXians[].siHua / stemIndex / stemName（飞星派字段已下线）
  // 宫干自化已下线（倪师不主张飞星派宫干自化论）
  // ── 农历信息 ──
// AFTER:
  // ── Current age & Da Xian ──
  // ── Borrowed-palace structured fields (codex P0: avoid UI layer reverse-looking up borrowed palace info from natural language) ──
  // ── Key palace branches ──
  // ── Zi Wei star position ──
  // ── Da Xian array (Ni Haixia "Tian Ji" orthodox: Si Hua fixed, Da Xian tracks only palace movement) ──
  // No longer generating daXians[].siHua / stemIndex / stemName (Si Hua flying-star fields retired)
  // Palace-stem self-transformation retired (Ni Haixia does not endorse flying-star self-Hua theory)
  // ── Lunar info ──
```

**Translation examples — types.ts:**

```typescript
// BEFORE:
  hour: number;      // 时辰 branch index (0=子, 1=丑, ... 11=亥)
  province?: string;   // 出生省份
  city?: string;       // 出生城市
  longitude?: number;  // 出生地经度（用于真太阳时校正）
// AFTER:
  hour: number;      // shichen branch index (0=子, 1=丑, ... 11=亥)
  province?: string;   // birth province
  city?: string;       // birth city
  longitude?: number;  // birth longitude (used for true solar time correction)
```

```typescript
// BEFORE:
  yearStem: number;      // 0-9 (甲乙丙丁戊己庚辛壬癸)
  yearBranch: number;    // 0-11 (子丑寅卯辰巳午未申酉戌亥)
  brightness?: 'bright' | 'normal' | 'dim';  // 庙旺利陷
  siHua: SiHua;       // 禄/权/科/忌
  starName: string;   // 自化的星
  branch: number;      // 0-11 (地支索引)
  stem: number;        // 0-9 (天干索引)
  name: string;        // 宫名
  daXianAge?: [number, number];   // 大限年龄段
// AFTER:
  yearStem: number;      // 0-9 (甲乙丙丁戊己庚辛壬癸)
  yearBranch: number;    // 0-11 (子丑寅卯辰巳午未申酉戌亥)
  brightness?: 'bright' | 'normal' | 'dim';  // miao/wang/li/xian brightness levels
  siHua: SiHua;       // 禄/权/科/忌 transformation type
  starName: string;   // the self-transformed star
  branch: number;      // 0-11 (earthly branch index)
  stem: number;        // 0-9 (heavenly stem index)
  name: string;        // palace name
  daXianAge?: [number, number];   // Da Xian age range
```

```typescript
// BEFORE:
  /** 宫干自化（倪师体系核心） */
  /** 对宫地支索引（永远 = (branch + 6) % 12） */
  /** 是否空宫（无主星） */
  /** 若为空宫，借自哪个宫的地支索引 = oppositeBranch */
  /** 若为空宫，借自哪个宫名 */
  /** 若为空宫，借到的对宫主星名列表（结构化数据，文案层不再需要从文本反查） */
// AFTER:
  /** Palace-stem self-transformation (core of Ni Haixia's system) */
  /** Opposite palace branch index (always = (branch + 6) % 12) */
  /** Whether the palace is empty (no major star) */
  /** If empty: the branch index it borrows from = oppositeBranch */
  /** If empty: the name of the palace it borrows from */
  /** If empty: the list of borrowed major star names from the opposite palace (structured; UI layer no longer needs to reverse-look up from text) */
```

```typescript
// BEFORE:
  lu: string;    // 化禄星名
  quan: string;  // 化权星名
  ke: string;    // 化科星名
  ji: string;    // 化忌星名
  mingGongBranch: number;    // 命宫地支
  shenGongBranch: number;    // 身宫地支
  wuxingJu: number;          // 五行局 (2,3,4,5,6)
  wuxingJuName: string;      // e.g. '水二局'
  ziweiPos: number;          // 紫微星位置
  palaces: Palace[];         // 12宫，按地支0-11排序
// AFTER:
  lu: string;    // Hua Lu star name
  quan: string;  // Hua Quan star name
  ke: string;    // Hua Ke star name
  ji: string;    // Hua Ji star name
  mingGongBranch: number;    // Ming Gong (Life Palace) branch
  shenGongBranch: number;    // Shen Gong (Body Palace) branch
  wuxingJu: number;          // Wu Xing ju number (2,3,4,5,6)
  wuxingJuName: string;      // e.g. '水二局'
  ziweiPos: number;          // Zi Wei star position
  palaces: Palace[];         // 12 palaces, sorted by branch 0-11
```

**Translation examples — sihua.ts:**

```typescript
// BEFORE:
/**
 * 四化工具模块 — 年干 / 大限宫干 / 流年干 / 流月干 四化映射
 *                + 宫干自化检测 + 来因宫追溯
 *
 * 倪海厦《天纪》体系核心：
 *   本命四化 = 出生年天干四化（静态基础）
 *   大限四化 = 大限宫**宫干**（非本命年干）的四化（十年动态）
 *   流年四化 = 当年年干的四化（一年动态）
 *   自化     = 某宫的宫干四化，其中被化星恰在本宫
 *   来因宫   = 某颗化星的"动力来源宫"——即宫干引发该化的宫位
 */
// AFTER:
/**
 * Si Hua utility module — mapping for birth year stem / Da Xian palace stem /
 *                         annual stem / monthly stem four-transformation
 *                         + palace-stem self-Hua detection + origin palace tracing
 *
 * Core of Ni Haixia's "Tian Ji" system:
 *   Natal Si Hua   = four transformations of the birth year's heavenly stem (static baseline)
 *   Da Xian Si Hua = four transformations of the Da Xian palace's own stem (10-year dynamic)
 *   Liu Nian Si Hua = four transformations of the current year's stem (annual dynamic)
 *   Self-Hua       = when a palace's stem transformation falls on a star already in that palace
 *   Origin palace  = the palace whose stem triggered a given transformation ("source palace")
 */
```

```typescript
// BEFORE:
// ─── 1) 由天干索引取四化四星 ───────────────────────────────────
/** 天干索引 0-9 → { 禄, 权, 科, 忌 } 对应星名 */
// ─── 2) 公历年 → 年柱天干索引 ──────────────────────────────────
/** 公历年份 → 年柱天干索引（0=甲, ... 9=癸） */
/** 公历年份 → 年柱地支索引（0=子, ... 11=亥） */
// ─── 3) 大限四化：取大限宫的宫干（非本命年干）───────────────
/**
 * 大限宫干四化
 * @param chart 命盘
 * @param dxIndex 大限索引（chart.daXians[dxIndex]）
 * @returns 该大限的四化四星
 */
// AFTER:
// ─── 1) Get four Si Hua stars by heavenly stem index ───────────
/** Stem index 0-9 → { 禄, 权, 科, 忌 } star names */
// ─── 2) Gregorian year → year pillar heavenly stem index ───────
/** Gregorian year → year pillar heavenly stem index (0=甲, ... 9=癸) */
/** Gregorian year → year pillar earthly branch index (0=子, ... 11=亥) */
// ─── 3) Da Xian Si Hua: use the Da Xian palace's own stem ──────
/**
 * Da Xian palace-stem four transformations
 * @param chart natal chart
 * @param dxIndex Da Xian index (chart.daXians[dxIndex])
 * @returns the four Si Hua stars for that Da Xian period
 */
```

**Translation examples — history.ts:**

```typescript
// BEFORE:
    } catch { /* localStorage 不可用时静默失败 */ }
    const label = [
      form.name,
      `${form.year}年${form.month}月${form.day}日`,
      form.city || form.province || '',
      form.gender === 'male' ? '男' : '女',
    ].filter(Boolean).join(' · ');
      // 去重：相同出生年月日+性别+时辰视为同一条记录
// AFTER:
    } catch { /* fail silently when localStorage is unavailable */ }
    const label = [
      form.name,
      `${form.year}/${form.month}/${form.day}`,
      form.city || form.province || '',
      form.gender === 'male' ? 'Male' : 'Female',
    ].filter(Boolean).join(' · ');
      // Deduplicate: same birth date + gender + shichen = same record
```

- [ ] **Step 1: Translate algorithm.ts — all comments**

Open `lib/ziwei/algorithm.ts` and replace every Chinese comment as shown in the examples above. Do NOT touch any string literal values (star names, palace names, etc.).

- [ ] **Step 2: Translate types.ts — all comments**

Open `lib/ziwei/types.ts` and replace every Chinese comment and JSDoc text as shown above.

- [ ] **Step 3: Translate sihua.ts — all comments**

Open `lib/ziwei/sihua.ts` and replace every Chinese comment and JSDoc text as shown above.

- [ ] **Step 4: Translate history.ts — comments + label strings**

Open `lib/ziwei/history.ts`. Translate comments AND the label-building strings (`年`/`月`/`日` in template literals → `/`, `'男'`/`'女'` → `'Male'`/`'Female'`).

- [ ] **Step 5: Translate share.ts and db-analysis.ts — comments**

Open each file and translate all Chinese comments. Do not touch any data or identifier values.

- [ ] **Step 6: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 7: Spot-check — confirm identifiers untouched**

```bash
grep -n "禄\|权\|科\|忌\|紫微\|天机\|命宫" lib/ziwei/algorithm.ts lib/ziwei/sihua.ts | head -20
```
Expected: these should still appear as string literal values inside quotes — NOT as comments.

- [ ] **Step 8: Commit**

```bash
git add lib/ziwei/algorithm.ts lib/ziwei/types.ts lib/ziwei/sihua.ts lib/ziwei/history.ts lib/ziwei/share.ts lib/ziwei/db-analysis.ts
git commit -m "refactor: translate lib/ziwei core infrastructure comments to English"
```

---

## Task 3: lib/ziwei/ knowledge modules — comments only

**Files:**
- Modify: `lib/ziwei/constants.ts`
- Modify: `lib/ziwei/patterns.ts`
- Modify: `lib/ziwei/heming-knowledge.ts`
- Modify: `lib/ziwei/cities.ts`
- Modify: `lib/ziwei/famous.ts`

**Scope:** Comments and JSDoc only. The actual data values in these files (star name arrays, palace name arrays, pattern condition strings, classical source citations, he-ming content strings, city names, famous person names/dates) are domain content — leave them as Chinese.

**Translation examples — constants.ts:**

```typescript
// BEFORE:
// 天干 Heavenly Stems        ← already bilingual, no change needed
// 地支 Earthly Branches      ← already bilingual, no change needed
// 时辰对应地支
// AFTER:
// Shichen → earthly branch mapping
```

```typescript
// BEFORE:
// 十二宫名，从命宫顺时针
// AFTER:
// 12 palace names, clockwise from Ming Gong (Life Palace)
```

```typescript
// BEFORE:
// 纳音五行（30组干支对的五行）
// 五行 → 局数
// 局数名称
// 四化表（年干 → [化禄, 化权, 化科, 化忌]）
// AFTER:
// Na Yin Wu Xing (element for each of 30 stem-branch pairs)
// Wu Xing element → ju number
// Ju number names
// Si Hua table (year stem → [Hua Lu, Hua Quan, Hua Ke, Hua Ji])
```

**Translation examples — patterns.ts:**

```typescript
// BEFORE:
/**
 * 紫微斗数格局识别（v2 严格化版本）
 *
 * 设计原则：
 * 1. 古书条件优先：每个格局列出"必须 / 加分 / 破格"三层结构，出处可考
 * 2. 倪师立场：不使用宫干自化、大限四化、来因宫等飞星派工具
 * 3. 庙旺利陷：用 brightness 字段（bright=庙旺、normal=平、dim=陷）
 * 4. 三方四正会照：命宫 + 财帛 + 官禄 + 迁移
 * 5. 夹宫：命宫前后两宫
 *
 * 主要古籍出处：
 *  - 《紫微斗数全集》（陈抟祖师传，明代刊本）
 *  - 《紫微斗数全书》（罗洪先编，明代刊本）
 *  - 《骨髓赋》《女命骨髓赋》《十二宫诸星得地合格诀》
 *  - 倪海厦《天纪》紫微斗数讲义
 */
// AFTER:
/**
 * Zi Wei Dou Shu chart pattern detection (v2 strict edition)
 *
 * Design principles:
 * 1. Classical text conditions first: each pattern has a three-tier structure
 *    (required / bonus / pattern-breaking) with traceable classical sources
 * 2. Ni Haixia's position: no palace-stem self-Hua, Da Xian Si Hua, or
 *    origin-palace tools (flying-star派 features)
 * 3. Brightness: uses the `brightness` field (bright = miao/wang, normal, dim = xian)
 * 4. San Fang Si Zheng (Three Directions & Four Directions): Ming Gong + Cai Bo + Guan Lu + Qian Yi
 * 5. Jia Gong (flanking palaces): the two palaces adjacent to Ming Gong
 *
 * Primary classical sources:
 *  - "Zi Wei Dou Shu Quan Ji" (transmitted by Chen Tuan, Ming dynasty edition)
 *  - "Zi Wei Dou Shu Quan Shu" (compiled by Luo Honxian, Ming dynasty edition)
 *  - "Gu Sui Fu", "Nu Ming Gu Sui Fu", "Shi Er Gong Zhu Xing De Di He Ge Jue"
 *  - Ni Haixia "Tian Ji" Zi Wei Dou Shu lecture notes
 */
```

```typescript
// BEFORE:
// ────────────────── 类型 ──────────────────
  required: string[];   // 必须满足条件（已通过的）
  bonus?: string[];     // 加分项（已触发）
  breaking?: string[];  // 破格警示（已触发）
  palaces: string[];                 // 涉及宫位
  conditions?: PatternCondition;     // 成立条件分层（v2 新增）
  source?: string;                   // 古籍出处（v2 新增）
// ────────────────── 常量 ──────────────────
// AFTER:
// ────────────────── Types ──────────────────
  required: string[];   // must-satisfy conditions (already matched)
  bonus?: string[];     // bonus conditions (triggered)
  breaking?: string[];  // pattern-breaking warnings (triggered)
  palaces: string[];                 // palaces involved
  conditions?: PatternCondition;     // tiered conditions (added in v2)
  source?: string;                   // classical source citation (added in v2)
// ────────────────── Constants ──────────────────
```

**Translation examples — heming-knowledge.ts:**

```typescript
// BEFORE:
/**
 * 紫微斗数合盘知识库
 * 基于倪海夏《天纪》体系 + 《紫微斗数全书》古典断语 + 全网专业资料整合
 * 供合盘 AI 分析使用
 */

// ─── 十四主星在夫妻宫的完整断语 ──────────────────────────
  summary: string;       // 一句话核心
  good: string;          // 吉象条件/表现
  bad: string;           // 凶象/注意事项
  spouse_traits: string; // 配偶外形性格
  timing: string;        // 婚期建议
  ni_quote?: string;     // 倪海夏原话
// AFTER:
/**
 * Zi Wei Dou Shu compatibility reading (He Ming) knowledge base
 * Based on Ni Haixia's "Tian Ji" system + "Zi Wei Dou Shu Quan Shu" classical judgments
 * + curated professional sources. Used by the He Ming AI analysis.
 */

// ─── Complete judgments for 14 major stars in the Spouse Palace ──
  summary: string;       // one-sentence core judgment
  good: string;          // auspicious conditions / expressions
  bad: string;           // inauspicious signs / cautions
  spouse_traits: string; // spouse appearance and personality
  timing: string;        // marriage timing recommendation
  ni_quote?: string;     // direct quote from Ni Haixia
```

- [ ] **Step 1: Translate constants.ts comments**

Open `lib/ziwei/constants.ts`. Translate every `//` comment line. The array values themselves (`'甲'`, `'子时'`, `'命宫'`, etc.) must remain unchanged.

- [ ] **Step 2: Translate patterns.ts comments**

Open `lib/ziwei/patterns.ts` (1118 lines). Translate all `//` comments and the opening JSDoc block. The `required`/`bonus`/`breaking` string values inside pattern objects are classical source text — leave them Chinese.

- [ ] **Step 3: Translate heming-knowledge.ts comments**

Open `lib/ziwei/heming-knowledge.ts`. Translate all `//` comments and the file JSDoc. The content property values (`summary`, `good`, `bad`, etc.) are domain data — leave them Chinese.

- [ ] **Step 4: Translate cities.ts comments**

Open `lib/ziwei/cities.ts`. Translate any `//` comments. City names and coordinates are data — leave them.

- [ ] **Step 5: Translate famous.ts comments**

Open `lib/ziwei/famous.ts`. Translate `//` comments. Famous person names, dates, and biographical notes are content data — leave them.

- [ ] **Step 6: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add lib/ziwei/constants.ts lib/ziwei/patterns.ts lib/ziwei/heming-knowledge.ts lib/ziwei/cities.ts lib/ziwei/famous.ts
git commit -m "refactor: translate lib/ziwei knowledge module comments to English"
```

---

## Task 4: lib/classics/ and lib/nihai/ — comments only

**Files:**
- Modify: `lib/classics/types.ts`
- Modify: `lib/classics/index.ts`
- Modify: `lib/nihai/types.ts`
- Modify: `lib/nihai/index.ts`
- Modify: `lib/nihai/tianji.ts`
- Modify: `lib/nihai/diji.ts`
- Modify: `lib/nihai/renji.ts`
- Modify: `lib/seo/knowledge.ts`

**Scope:** Translate JSDoc and `//` comments only. Do NOT touch: book titles, chapter titles, paragraph text, author names, dynasty names, biographical data, knowledge content body strings — these are the actual content of the knowledge base.

**Translation examples — classics/types.ts:**

```typescript
// BEFORE:
/**
 * 古籍原典查询库 — 类型定义
 *
 * 设计：所有古籍以 JSON 静态数据打包到代码（公版无版权风险）
 * Next.js 启动时一次性加载到内存，零 DB 依赖
 */
  /** 段落唯一 id（用于锚点跳转） */
  /** 段落序号（章节内） */
  /** 段落原文（古文） */
  /** 现代翻译（可选，未来填充） */
  /** 倪师注解（可选，标注来源） */
  /** 章节标题（如"卷一"、"总论篇"）*/
  /** 章节副标题/简介（可选）*/
  /** 书名 */
  /** 书 slug（URL 用，如 'guisuifu'）*/
  /** 朝代 */
  /** 作者（多人或不详时填"不详"或多人）*/
  /** 简介 */
  /** 总字数（粗略）*/
  /** 高亮片段（含 <mark> 标签） */
  /** 原文 */
// AFTER:
/**
 * Classical texts library — type definitions
 *
 * Design: all classical texts bundled as static TypeScript data (public domain, no copyright risk).
 * Loaded into memory once at Next.js startup; zero DB dependency.
 */
  /** Unique paragraph id (used for anchor navigation) */
  /** Paragraph index within the chapter */
  /** Original text (classical Chinese) */
  /** Modern translation (optional, to be filled in the future) */
  /** Ni Haixia's annotations (optional, source noted) */
  /** Chapter title (e.g. "Volume 1", "General Theory") */
  /** Chapter subtitle / introduction (optional) */
  /** Book title */
  /** Book slug (for URLs, e.g. 'gusuifu') */
  /** Dynasty */
  /** Author (fill "Unknown" or multiple names if applicable) */
  /** Introduction */
  /** Approximate word count */
  /** Highlighted excerpt (may contain <mark> tags) */
  /** Original text */
```

**Translation examples — nihai/types.ts:**

```typescript
// BEFORE:
/**
 * 倪海厦 天纪 / 地纪 / 人纪 — 共享类型定义
 */
/** 三纪分类 */
/** 课程/模块 */
  /** 中文名 */
  /** 英文名 */
  /** 简短副标题 */
  /** 简要描述 */
  /** 详细介绍（多段） */
  /** 学派归属 */
  /** 课时信息 */
  /** 参考书目 */
  /** 核心概念/关键词 */
  /** 图标字符 */
  /** 状态 */
  /** 排序权重 */
  /** 路由 slug */
  /** 子章节 */
/** 章节 */
  /** 核心要点 */
  /** 倪师语录 */
  /** 排序 */
/** 易经六十四卦 */
  /** 卦象描述 如「天泽履」 */
  /** 上卦 */
  /** 下卦 */
  /** 卦辞要点 */
  /** 倪师讲解要点 */
  /** 断事要诀 */
/** 堪舆条目 */
/** 人纪中医条目 */
// AFTER:
/**
 * Ni Haixia Tian Ji / Di Ji / Ren Ji — shared type definitions
 */
/** Three Ji classification */
/** Course / module */
  /** Chinese name */
  /** English name */
  /** Short subtitle */
  /** Brief description */
  /** Detailed introduction (multiple paragraphs) */
  /** School / tradition affiliation */
  /** Session / lesson info */
  /** Reference bibliography */
  /** Core concepts / keywords */
  /** Icon character */
  /** Status */
  /** Sort weight */
  /** URL slug */
  /** Sub-chapters */
/** Chapter */
  /** Key points */
  /** Ni Haixia quotes */
  /** Sort order */
/** Yi Jing 64 hexagrams */
  /** Hexagram description e.g. "Heaven-Lake Treading" */
  /** Upper trigram */
  /** Lower trigram */
  /** Hexagram statement key points */
  /** Ni Haixia lecture key points */
  /** Divination essentials */
/** Feng Shui entry */
/** Ren Ji (TCM) entry */
```

**Translation examples — nihai/index.ts:**

```typescript
// BEFORE:
/**
 * 倪海厦 天纪 / 地纪 / 人纪 — 统一导出
 *
 * 倪海厦（1954-2012），美国汉唐中医学院创办人，
 * 当代少见的「命、相、卜、山、医」五术兼备之旷世奇人。
 *
 * 三纪体系：
 *   天纪 —— 上知天文（紫微斗数、易经、堪舆、推命、面相、测字）
 *   地纪 —— 下知地理（国家地理志、风水与国运）
 *   人纪 —— 中知人事（针灸、黄帝内经、神农本草经、伤寒论、金匮要略）
 */
/** 倪海厦完整传记 */
// AFTER:
/**
 * Ni Haixia Tian Ji / Di Ji / Ren Ji — unified exports
 *
 * Ni Haixia (1954–2012), founder of Han Tang College of Chinese Medicine in the USA.
 * A rare modern master of all five arts: Ming (destiny), Xiang (physiognomy),
 * Bu (divination), Shan (mountain arts), Yi (medicine).
 *
 * Three Ji system:
 *   Tian Ji — knowledge of heaven: Zi Wei Dou Shu, Yi Jing, feng shui, fate, physiognomy, word reading
 *   Di Ji  — knowledge of earth: national geography, feng shui and national destiny
 *   Ren Ji  — knowledge of humanity: acupuncture, Huang Di Nei Jing, Shen Nong Ben Cao Jing,
 *             Shang Han Lun, Jin Kui Yao Lue
 */
/** Ni Haixia complete biography */
```

- [ ] **Step 1: Translate lib/classics/types.ts comments**
- [ ] **Step 2: Translate lib/classics/index.ts comments**
- [ ] **Step 3: Translate lib/nihai/types.ts comments**
- [ ] **Step 4: Translate lib/nihai/index.ts comments** (leave all data value strings Chinese)
- [ ] **Step 5: Translate lib/nihai/tianji.ts comments** (leave content data Chinese)
- [ ] **Step 6: Translate lib/nihai/diji.ts comments** (leave content data Chinese)
- [ ] **Step 7: Translate lib/nihai/renji.ts comments** (leave content data Chinese)
- [ ] **Step 8: Translate lib/seo/knowledge.ts comments and any developer-facing strings**
- [ ] **Step 9: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 10: Commit**

```bash
git add lib/classics/types.ts lib/classics/index.ts lib/nihai/types.ts lib/nihai/index.ts lib/nihai/tianji.ts lib/nihai/diji.ts lib/nihai/renji.ts lib/seo/knowledge.ts
git commit -m "refactor: translate lib/classics and lib/nihai comments to English"
```

---

## Task 5: components/ — UI strings and comments

**Files:**
- Modify: `components/BirthForm.tsx`
- Modify: `components/ChartBoard.tsx`
- Modify: `components/InsightPanel.tsx`
- Modify: `components/PalaceCell.tsx`
- Modify: `components/TimeNav.tsx`
- Modify: `components/StarDetailPanel.tsx`
- Modify: `components/ChatPanel.tsx`
- Modify: `components/ShareModal.tsx`
- Modify: `components/ShareCardCanvas.tsx`
- Modify: `components/AnnouncementModal.tsx`
- Modify: `components/ScrollIntro.tsx`
- Modify: `components/ChartSummary.tsx`
- Modify: `components/FamousPersonCard.tsx`
- Modify: `components/PatternsCard.tsx`
- Modify: `components/StarField.tsx`

**Scope:** Translate all `//` comments, JSDoc, AND all Chinese strings that appear in JSX or are returned as UI text. **Exception**: Do NOT translate strings that are star names, palace names, or domain identifiers (they appear in JSX but are the astrological content that the user should see in Chinese — e.g., `palace.name`, `star.name`). Translate the surrounding chrome: labels, headings, button text, placeholders, error messages, ARIA labels, tooltip text.

**Key translation mappings for UI strings:**

| Chinese | English |
|---|---|
| `── 输入生辰八字 ──` | `── Enter Birth Details ──` |
| `姓名（可选）` | `Name (optional)` |
| `请输入姓名` (placeholder) | `Enter name` |
| `出生日期（公历）` | `Date of Birth (Gregorian)` |
| `年份` | `Year` |
| `月份` | `Month` |
| `时辰不详` | `Birth hour unknown` |
| `男` / `女` (gender) | `Male` / `Female` |
| `请选择出生年份` | `Please select birth year` |
| `年份范围：1900–2026` | `Year range: 1900–2026` |
| `请选择月份` | `Please select month` |
| `请选择日期` | `Please select day` |
| `起盘` / `立即起盘` | `Generate Chart` |
| `← 重新起盘` | `← New Chart` |
| `命格` (tab) | `Overview` |
| `感情` (tab) | `Love & Marriage` |
| `事业` (tab) | `Career` |
| `财运` (tab) | `Wealth` |
| `健康` (tab) | `Health` |
| `性格` (tab) | `Personality` |
| `本命` | `Natal Chart` |
| `大限` | `Da Xian` |
| `流年` | `Liu Nian` |
| `暗色` / `亮色` | `Dark` / `Light` |
| `切换亮色主题` / `切换暗色主题` (aria-label) | `Switch to light theme` / `Switch to dark theme` |
| `排盘体系` | `Chart System` |
| `命盘呈现` | `Chart Display` |
| `AI 解读` | `AI Analysis` |
| `分享命盘` | `Share Chart` |
| `复制链接` | `Copy Link` |
| `下载图片` | `Download Image` |
| `已复制！` | `Copied!` |
| `正在生成…` | `Generating…` |
| `生成解读` | `Generate Reading` |

**InsightPanel.tsx — also translate the AI prompt templates:**

The prompt template strings (starting with `请生成命格总览，按以下结构输出：`) should be translated to English. These instruct the AI to respond in English:

```typescript
// BEFORE:
  overview: `请生成命格总览，按以下结构输出：

**【命格定性】**
用一句话概括这个命盘的核心格局与命主气质。

**【主星解读】**
命宫主星的核心特质，引用倪海夏原话或观点。

**【三方四正】**
财、官、迁三宫的联动分析及整体格局。

**【当前大限】**
当下大限运势方向与最值得关注的事项。

**【优势与注意】**
命盘天赋优势，以及需要注意的风险或功课。`,

// AFTER:
  overview: `Generate a natal chart overview in the following structure:

**[Chart Profile]**
One sentence summarizing the core chart pattern and the subject's essential nature.

**[Major Star Reading]**
The core qualities of the Life Palace major star, citing Ni Haixia's words or perspective.

**[Three Directions & Four Directions]**
Linked analysis of the Wealth, Career, and Travel palaces and the overall pattern.

**[Current Da Xian]**
The direction of the current decade period and the most important things to watch.

**[Strengths & Cautions]**
Natural gifts in the chart, and risks or lessons to be mindful of.`,
```

Apply the same pattern to the `love`, `career`, `wealth`, `health`, and `personality` prompt templates — translate all Chinese headings and instructions to English, keeping the structural format.

- [ ] **Step 1: Translate BirthForm.tsx — comments and UI strings**

Open `components/BirthForm.tsx`. Translate:
- All `//` comments
- All JSDoc (`/** */`)
- All Chinese string literals in JSX: labels, placeholders, error messages, button text
- The `SHICHEN_NAMES` array is domain identifiers — leave them Chinese
- The summary chip strings (gender display) → `'Male'` / `'Female'`

- [ ] **Step 2: Translate InsightPanel.tsx — comments, tab labels, prompt templates**

Open `components/InsightPanel.tsx`. Translate:
- All comments
- Tab `label` values: `'命格'` → `'Overview'`, `'感情'` → `'Love & Marriage'`, `'事业'` → `'Career'`, `'财运'` → `'Wealth'`, `'健康'` → `'Health'`, `'性格'` → `'Personality'`
- All six AI prompt template strings (overview, love, career, wealth, health, personality)

- [ ] **Step 3: Translate TimeNav.tsx — comments and UI strings**

Translate view toggle labels: `'本命'` → `'Natal Chart'`, `'大限'` → `'Da Xian'`, `'流年'` → `'Liu Nian'`, and any other UI text.

- [ ] **Step 4: Translate ChartBoard.tsx — comments and UI strings**

Translate all comments and any hardcoded Chinese text visible in the rendered output.

- [ ] **Step 5: Translate PalaceCell.tsx — comments and UI strings**

Translate all comments and UI chrome strings. Palace names rendered from data (e.g., `palace.name`) are dynamic domain content — do not add a translation layer for those.

- [ ] **Step 6: Translate StarDetailPanel.tsx — comments and UI strings**

Translate all comments and any hardcoded labels/headings/button text.

- [ ] **Step 7: Translate ChatPanel.tsx — comments and UI strings**

Translate all comments and UI strings (input placeholder, button text, status messages).

- [ ] **Step 8: Translate ShareModal.tsx and ShareCardCanvas.tsx — comments and UI strings**

Translate all comments and UI strings (modal title, button labels, copy confirmation text, download label, watermark text if any).

- [ ] **Step 9: Translate AnnouncementModal.tsx — comments and UI strings**

Translate all comments and UI strings.

- [ ] **Step 10: Translate ScrollIntro.tsx — comments and UI strings**

Translate all comments, feature section tags/titles/subtitles/bullet points.

- [ ] **Step 11: Translate ChartSummary.tsx, FamousPersonCard.tsx, PatternsCard.tsx, StarField.tsx — comments and UI strings**

Translate all comments and any hardcoded UI strings in these smaller components.

- [ ] **Step 12: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 13: Commit**

```bash
git add components/
git commit -m "refactor: translate component comments and UI strings to English"
```

---

## Task 6: app/ pages — UI strings and comments

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/chart/page.tsx`
- Modify: `app/heming/page.tsx`
- Modify: `app/knowledge/page.tsx`
- Modify: `app/library/page.tsx`
- Modify: `app/library/LibrarySearch.tsx`
- Modify: `app/library/search/page.tsx`
- Modify: `app/preview/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/sitemap.ts`

**Scope:** Translate all comments AND all hardcoded Chinese strings — metadata titles/descriptions, page headings, body text, labels, error messages, navigation text.

**Translation examples — app/layout.tsx:**

```typescript
// BEFORE:
export const metadata: Metadata = {
  title: '紫微命盘 — 倪海夏体系排盘',
  description: '基于倪海夏《天纪》体系的紫微斗数排盘 …',
}
// AFTER:
export const metadata: Metadata = {
  title: 'Zi Wei Chart — Ni Haixia System',
  description: 'Zi Wei Dou Shu natal chart based on Ni Haixia\'s Tian Ji system …',
}
```

**Translation examples — app/chart/page.tsx:**

```typescript
// BEFORE:
<h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
  紫微斗数排盘
</h1>
<p style={{ … }}>
  输入出生年月日时，开源排盘引擎即时生成命盘。
  <br />
  （本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）
</p>
<button … >← 重新起盘</button>
// AFTER:
<h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
  Zi Wei Dou Shu Chart Calculator
</h1>
<p style={{ … }}>
  Enter your birth date and time to generate a natal chart instantly with the open-source engine.
  <br />
  (This page is an engine demo. The full commercial UI is not open-sourced; the calculation engine is fully open.)
</p>
<button … >← New Chart</button>
```

**Translation examples — app/privacy/page.tsx:**

The entire page body is Chinese legal prose. Translate all text content:

```typescript
// BEFORE:
export const metadata = { title: '隐私政策 · 紫微命盘', description: '紫微命盘隐私政策' };
<span>返回首页</span>
<span style={{ … }}>紫微命盘</span>
<h1 …>隐私政策</h1>
<p …>最后更新：2026年4月</p>
<h2 …>1. 我们收集的信息</h2>
// AFTER:
export const metadata = { title: 'Privacy Policy · Zi Wei Chart', description: 'Zi Wei Chart Privacy Policy' };
<span>Back to Home</span>
<span style={{ … }}>Zi Wei Chart</span>
<h1 …>Privacy Policy</h1>
<p …>Last updated: April 2026</p>
<h2 …>1. Information We Collect</h2>
```

Continue translating all privacy and terms page body content completely.

**Translation examples — app/heming/page.tsx:**

```typescript
// Translate headings, labels, form text
// 合盘分析 → Compatibility Reading
// 选择对方 → Select Partner
// 开始分析 → Start Analysis
```

- [ ] **Step 1: Translate app/layout.tsx — metadata and comments**
- [ ] **Step 2: Translate app/page.tsx — all 211 Chinese UI strings**

This is the largest file (1191 lines, 211 Chinese lines). Translate all headings, feature descriptions, section tags, bullet points, and navigation text. The star name values in the main stars list (`{ name: '紫微' }` etc.) are domain identifiers — leave them.

- [ ] **Step 3: Translate app/chart/page.tsx — comments and UI strings**
- [ ] **Step 4: Translate app/heming/page.tsx — comments and UI strings**
- [ ] **Step 5: Translate app/knowledge/page.tsx — comments and UI strings**
- [ ] **Step 6: Translate app/library/page.tsx, LibrarySearch.tsx, search/page.tsx — comments and UI strings**
- [ ] **Step 7: Translate app/preview/page.tsx — comments and UI strings**
- [ ] **Step 8: Translate app/privacy/page.tsx — full page content**
- [ ] **Step 9: Translate app/terms/page.tsx — full page content**
- [ ] **Step 10: Translate app/sitemap.ts — comments and strings**
- [ ] **Step 11: Verify build**

```bash
cd /Users/april/code/playground/purple-star-astrology && npm run build
```
Expected: exits 0.

- [ ] **Step 12: Final Chinese check across all translated files**

```bash
grep -rn "[一-鿿]" \
  app/layout.tsx app/page.tsx app/chart app/heming app/knowledge \
  app/library app/preview app/privacy app/terms app/sitemap.ts \
  components/ \
  lib/ziwei/algorithm.ts lib/ziwei/types.ts lib/ziwei/sihua.ts \
  lib/ziwei/history.ts lib/ziwei/share.ts lib/ziwei/db-analysis.ts \
  lib/classics/types.ts lib/classics/index.ts \
  lib/nihai/types.ts lib/nihai/index.ts \
  README.md
```

Any remaining hits should ONLY be:
- Domain identifier string values (star names, palace names, stems/branches) inside quotes
- Content data values in lib/nihai/ body strings
- Classical text content in lib/classics/data/
- Chinese text inside JSX that is rendered from dynamic data (e.g., `{palace.name}`, `{star.name}`)

If any comment lines or static UI string literals remain, translate them.

- [ ] **Step 13: Commit**

```bash
git add app/
git commit -m "refactor: translate app page comments and UI strings to English"
```

---

## Self-Review

**Spec coverage check:**

- README.md → Task 1 ✓
- `//` comments and JSDoc in lib/ziwei/ → Task 2 + Task 3 ✓
- `//` comments and JSDoc in lib/classics/ and lib/nihai/ → Task 4 ✓
- UI hardstrings in components/ → Task 5 ✓
- UI hardstrings in app/ pages → Task 6 ✓
- Privacy + Terms page full translation → Task 6 Step 8-9 ✓

**Placeholder scan:** No TBD/TODO/placeholder steps — all steps include concrete translation examples.

**Type consistency:** No new types or interfaces introduced; this is a text-only change.

**Out of scope (intentionally not translated):**
- `lib/classics/data/gusuifu.ts`, `quanji.ts`, `quanshu.ts` — primary source texts
- `lib/nihai/tianji.ts`, `diji.ts`, `renji.ts` content data values
- `lib/ziwei/heming-knowledge.ts` content values (astrology interpretation content)
- `lib/ziwei/constants.ts` array values (domain identifiers)
- All star/palace/stem/branch strings used as iztro/lunar-javascript keys
