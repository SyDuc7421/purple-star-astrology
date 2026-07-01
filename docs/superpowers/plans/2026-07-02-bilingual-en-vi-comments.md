# Bilingual EN-VI Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every existing English comment in `app/`, `components/`, and `lib/` gets a Vietnamese translation added immediately below it, so all code comments become bilingual (English then Vietnamese).

**Architecture:** This is a bulk content-translation task, not a feature build — there are no unit tests for "is this comment correctly translated." Each task therefore substitutes the usual red/green test cycle with two mechanical checks: (1) `npx tsc --noEmit` still compiles (proves no code was touched, only comments), and (2) `git diff` on the touched file shows **only added lines, zero deletions/modifications** (proves existing English text and code were not altered). One task = one file or one small batch of trivially-small files in the same directory. Domain vocabulary (Zi Wei Dou Shu terms) is locked into a glossary up front so translations stay consistent across files done by different subagents/sessions.

**Tech Stack:** TypeScript / TSX, no new dependencies.

## Global Constraints

- **Format (confirmed with user):** two-line style. Insert the Vietnamese translation as a **new line directly below** every existing English comment line, using the same comment syntax as that line (`//`, `*` inside a `/** */` block, or `{/* */}` in JSX). Never edit, reorder, delete, or reflow an existing English comment line.
- **Never touch non-comment code.** No renaming, no reformatting, no touching string literals that aren't comments (e.g. UI copy, book titles stored as data). If a line is code with a trailing `// comment`, leave that line untouched and insert the Vietnamese line **after** it, at the same indentation.
- **Do not translate:** identifiers, URLs, file paths, numbers, romanized proper nouns (person names like "Ni Haixia", classical book titles like "Zi Wei Dou Shu Quan Ji", star names already kept in Pinyin such as "Zi Wei", "Tian Ji"). Keep the Pinyin/English spelling for these — only translate the surrounding descriptive sentence.
- **Verification per task:** `npx tsc --noEmit` must exit clean, and `git diff <files>` must contain zero lines starting with `-` (other than the `--- a/file` diff header) — i.e. pure additions only.
- **Commit per task**, using `docs(i18n): add Vietnamese translations to comments in <path>`.
- **Final task** runs a full `pnpm build` and a repo-wide diff-stat sanity check before wrapping up.

### Domain Glossary (use these exact Vietnamese terms everywhere)

| English (as currently written) | Vietnamese |
|---|---|
| Zi Wei Dou Shu | Tử Vi Đẩu Số |
| palace | cung |
| Ming Gong (Life Palace) | Mệnh Cung |
| Cai Bo (Wealth Palace) | Cung Tài Bạch |
| Guan Lu (Career Palace) | Cung Quan Lộc |
| Qian Yi (Travel Palace) | Cung Thiên Di |
| San Fang Si Zheng (Three Directions & Four Directions) | Tam Phương Tứ Chính |
| Jia Gong (flanking palace) | Giáp Cung |
| Da Xian (10-year period) | Đại Hạn |
| Liu Nian (annual fortune) | Lưu Niên |
| Si Hua / Sihua (Four Transformations) | Tứ Hóa |
| brightness (miao/wang/normal/xian) | độ sáng sao (miếu/vượng/bình hòa/hãm) |
| major stars / 14 major stars | chính tinh / 14 chính tinh |
| chart / chart pattern | lá số / cách cục |
| Gu Sui Fu | Cốt Tủy Phú |
| classical text / classics | cổ thư / kinh điển |
| Da Xian Si Hua | Tứ Hóa Đại Hạn |
| origin-palace | cung gốc (bản cung) |
| flying-star (school) | phi tinh (phái) |
| pattern-breaking (condition) | điều kiện phá cách |

If a task encounters a term not in this table, add it to the table in this plan file (so later tasks stay consistent) before using it, and note the addition in the task's commit message body.

### Worked Example (from `lib/ziwei/patterns.ts`, already approved by the user)

```typescript
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
 */
```

---

### Task 1: `lib/ziwei/patterns.ts` (76 comment lines)

**Files:**
- Modify: `lib/ziwei/patterns.ts`

**Interfaces:** None — comment-only change, no exported signatures affected.

- [ ] **Step 1: Translate every comment line in the file**

Open `lib/ziwei/patterns.ts`. It has a file-header JSDoc block (lines 1-18, already shown in the Worked Example above — use that exact translation for those lines) plus section-divider comments (e.g. `// ────────────────── Types ──────────────────`) and inline comments scattered through the pattern-definition objects. For every one of the 76 comment lines: insert a new comment line directly below it, same syntax, containing the Vietnamese translation, per the Global Constraints rules and Domain Glossary above.

- [ ] **Step 2: Verify no code was touched**

Run: `npx tsc --noEmit`
Expected: no output (clean exit).

Run: `git diff lib/ziwei/patterns.ts | grep -E '^-[^-]'`
Expected: no output (zero deletions).

- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/patterns.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/patterns.ts"
```

---

### Task 2: `lib/ziwei/sihua.ts` (63 comment lines)

**Files:**
- Modify: `lib/ziwei/sihua.ts`

**Interfaces:** None — comment-only change.

- [ ] **Step 1: Translate every comment line in the file**

Same procedure as Task 1, Step 1, applied to all 63 comment lines in `lib/ziwei/sihua.ts` (Si Hua / Four Transformations logic — lean on the "Si Hua / Sihua" glossary entry heavily here).

- [ ] **Step 2: Verify no code was touched**

Run: `npx tsc --noEmit` — expect clean exit.
Run: `git diff lib/ziwei/sihua.ts | grep -E '^-[^-]'` — expect no output.

- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/sihua.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/sihua.ts"
```

---

### Task 3: `lib/ziwei/heming-knowledge.ts` (27 comment lines)

**Files:**
- Modify: `lib/ziwei/heming-knowledge.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/ziwei/heming-knowledge.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/heming-knowledge.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/heming-knowledge.ts"
```

---

### Task 4: `lib/ziwei/algorithm.ts` (23 comment lines)

**Files:**
- Modify: `lib/ziwei/algorithm.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/ziwei/algorithm.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/algorithm.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/algorithm.ts"
```

---

### Task 5: `lib/ziwei/db-analysis.ts` (22 comment lines)

**Files:**
- Modify: `lib/ziwei/db-analysis.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/ziwei/db-analysis.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/db-analysis.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/db-analysis.ts"
```

---

### Task 6: `lib/ziwei/constants.ts` (15 comment lines)

**Files:**
- Modify: `lib/ziwei/constants.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/ziwei/constants.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/constants.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/ziwei/constants.ts"
```

---

### Task 7: small `lib/ziwei/*` files batch (36 comment lines across 5 files)

**Files:**
- Modify: `lib/ziwei/share.ts` (11 comment lines)
- Modify: `lib/ziwei/famous.ts` (10 comment lines)
- Modify: `lib/ziwei/cities.ts` (8 comment lines)
- Modify: `lib/ziwei/types.ts` (6 comment lines)
- Modify: `lib/ziwei/history.ts` (1 comment line)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each of the 5 files** — same procedure as Task 1, Step 1, applied file by file.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add lib/ziwei/share.ts lib/ziwei/famous.ts lib/ziwei/cities.ts lib/ziwei/types.ts lib/ziwei/history.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in remaining lib/ziwei files"
```

---

### Task 8: `lib/nihai/types.ts` (58 comment lines)

**Files:**
- Modify: `lib/nihai/types.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/nihai/types.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/nihai/types.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/nihai/types.ts"
```

---

### Task 9: `lib/nihai/renji.ts` (27 comment lines)

**Files:**
- Modify: `lib/nihai/renji.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/nihai/renji.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/nihai/renji.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/nihai/renji.ts"
```

---

### Task 10: `lib/nihai/index.ts` (20 comment lines)

**Files:**
- Modify: `lib/nihai/index.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/nihai/index.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/nihai/index.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/nihai/index.ts"
```

---

### Task 11: `lib/nihai/tianji.ts` (19 comment lines)

**Files:**
- Modify: `lib/nihai/tianji.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/nihai/tianji.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/nihai/tianji.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/nihai/tianji.ts"
```

---

### Task 12: `lib/nihai/diji.ts` (12 comment lines)

**Files:**
- Modify: `lib/nihai/diji.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/nihai/diji.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/nihai/diji.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/nihai/diji.ts"
```

---

### Task 13: `lib/classics/types.ts` (21 comment lines)

**Files:**
- Modify: `lib/classics/types.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/classics/types.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/classics/types.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/classics/types.ts"
```

---

### Task 14: `lib/classics/index.ts` (18 comment lines)

**Files:**
- Modify: `lib/classics/index.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/classics/index.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/classics/index.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/classics/index.ts"
```

---

### Task 15: `lib/classics/data/*` batch (19 comment lines across 3 files)

**Files:**
- Modify: `lib/classics/data/quanji.ts` (7 comment lines)
- Modify: `lib/classics/data/quanshu.ts` (6 comment lines)
- Modify: `lib/classics/data/gusuifu.ts` (6 comment lines)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each of the 3 files** — same procedure as Task 1, Step 1. Note: these files hold classical-text *data* (verse content as string literals) — only translate actual `//` / `/* */` comments, never the string-literal verse data itself.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add lib/classics/data/quanji.ts lib/classics/data/quanshu.ts lib/classics/data/gusuifu.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/classics/data files"
```

---

### Task 16: `lib/seo/knowledge.ts` (9 comment lines)

**Files:**
- Modify: `lib/seo/knowledge.ts`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff lib/seo/knowledge.ts | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add lib/seo/knowledge.ts
git commit -m "docs(i18n): add Vietnamese translations to comments in lib/seo/knowledge.ts"
```

---

### Task 17: `components/InsightPanel.tsx` (46 comment lines)

**Files:**
- Modify: `components/InsightPanel.tsx`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file**

Same procedure as Task 1, Step 1. This file mixes `//` line comments (including trailing comments like `hidden?: boolean; // don't show user bubble for auto/topic messages`) with JSX `{/* ... */}` comments. For a trailing comment, insert the Vietnamese line **after** the code+comment line, same indentation, as its own `//` comment line. For a JSX comment, insert a new `{/* Vietnamese text */}` line directly below it.

- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff components/InsightPanel.tsx | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add components/InsightPanel.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in components/InsightPanel.tsx"
```

---

### Task 18: `components/ShareCardCanvas.tsx` (15 comment lines)

**Files:**
- Modify: `components/ShareCardCanvas.tsx`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 17, Step 1 (mixed `//` and `{/* */}` styles).
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff components/ShareCardCanvas.tsx | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add components/ShareCardCanvas.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in components/ShareCardCanvas.tsx"
```

---

### Task 19: `components/ScrollIntro.tsx` + `components/BirthForm.tsx` batch (23 comment lines)

**Files:**
- Modify: `components/ScrollIntro.tsx` (11 comment lines)
- Modify: `components/BirthForm.tsx` (12 comment lines)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each file** — same procedure as Task 17, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add components/ScrollIntro.tsx components/BirthForm.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in ScrollIntro and BirthForm"
```

---

### Task 20: small `components/*` batch (18 comment lines across 5 files)

**Files:**
- Modify: `components/ChartBoard.tsx` (6 comment lines)
- Modify: `components/AnnouncementModal.tsx` (5 comment lines)
- Modify: `components/TimeNav.tsx` (3 comment lines)
- Modify: `components/PalaceCell.tsx` (3 comment lines)
- Modify: `components/StarDetailPanel.tsx` (1 comment line)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each of the 5 files** — same procedure as Task 17, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add components/ChartBoard.tsx components/AnnouncementModal.tsx components/TimeNav.tsx components/PalaceCell.tsx components/StarDetailPanel.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in remaining components files"
```

---

### Task 21: `app/page.tsx` (19 comment lines)

**Files:**
- Modify: `app/page.tsx`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file**

Same procedure as Task 1, Step 1. This file is mostly JSX `{/* ... */}` comments marking page sections (e.g. `{/* ══ HERO ══ */}`, `{/* Tag row */}`, `{/* 14 major stars */}`) — insert the Vietnamese translation as a new `{/* ... */}` line directly below each one.

- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff app/page.tsx | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in app/page.tsx"
```

---

### Task 22: `app/knowledge/[star]/[topic]/page.tsx` (19 comment lines)

**Files:**
- Modify: `app/knowledge/[star]/[topic]/page.tsx`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff "app/knowledge/[star]/[topic]/page.tsx" | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add "app/knowledge/[star]/[topic]/page.tsx"
git commit -m "docs(i18n): add Vietnamese translations to comments in app/knowledge/[star]/[topic]/page.tsx"
```

---

### Task 23: `app/chart/page.tsx` (12 comment lines)

**Files:**
- Modify: `app/chart/page.tsx`

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in the file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; `git diff app/chart/page.tsx | grep -E '^-[^-]'` empty.
- [ ] **Step 3: Commit**

```bash
git add app/chart/page.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in app/chart/page.tsx"
```

---

### Task 24: `app/sitemap.ts` + `app/heming/page.tsx` batch (19 comment lines)

**Files:**
- Modify: `app/sitemap.ts` (10 comment lines)
- Modify: `app/heming/page.tsx` (9 comment lines)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each file** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts app/heming/page.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in sitemap.ts and heming page"
```

---

### Task 25: remaining small `app/*` files batch (29 comment lines across 8 files)

**Files:**
- Modify: `app/library/page.tsx` (5 comment lines)
- Modify: `app/library/LibrarySearch.tsx` (5 comment lines)
- Modify: `app/layout.tsx` (5 comment lines)
- Modify: `app/knowledge/page.tsx` (4 comment lines)
- Modify: `app/library/search/page.tsx` (3 comment lines)
- Modify: `app/library/[book]/page.tsx` (3 comment lines)
- Modify: `app/library/[book]/[chapter]/page.tsx` (3 comment lines)
- Modify: `app/preview/page.tsx` (1 comment line)

**Interfaces:** None.

- [ ] **Step 1: Translate every comment line in each of the 8 files** — same procedure as Task 1, Step 1.
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; for each file run `git diff <file> | grep -E '^-[^-]'` and expect no output.
- [ ] **Step 3: Commit**

```bash
git add app/library/page.tsx app/library/LibrarySearch.tsx app/layout.tsx app/knowledge/page.tsx "app/library/search/page.tsx" "app/library/[book]/page.tsx" "app/library/[book]/[chapter]/page.tsx" app/preview/page.tsx
git commit -m "docs(i18n): add Vietnamese translations to comments in remaining app files"
```

---

### Task 26: Final verification

**Files:** None (verification only).

- [ ] **Step 1: Confirm no comment line was missed**

Run:
```bash
find app components lib -type f \( -name '*.ts' -o -name '*.tsx' \) | while read f; do
  en=$(grep -cE '^\s*(//|/\*|\*|\{/\*)' "$f")
  echo "$en $f"
done
```
Expected: every file's comment-line count is roughly double what it was at the start of this plan (English line + Vietnamese line for each), confirming no file was skipped.

- [ ] **Step 2: Full type check and production build**

Run: `npx tsc --noEmit`
Expected: clean exit, no errors.

Run: `pnpm build`
Expected: build succeeds (same route list/output as before this plan started).

- [ ] **Step 3: Confirm zero code lines were altered across the whole plan**

Run: `git log --oneline` and check every commit from Task 1 through Task 25 is present, then run:
```bash
git diff main --stat -- app components lib
```
Review the stat output — deletions should be 0 (or explainable) for every touched file.

- [ ] **Step 4: Commit (if Step 1 found gaps)**

If Step 1 revealed any file with a missing translation, fix it now and commit:
```bash
git add <file>
git commit -m "docs(i18n): fill in missed Vietnamese translations in <file>"
```
Otherwise, no commit needed for this task.
