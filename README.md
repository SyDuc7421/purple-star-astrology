# Zi Wei Dou Shu · Open-Source Chart Engine

> 🎉 **ICP registration complete** (Beijing ICP No. 2026027116). The main domain is live and all features are accessible.
>
> Visit **https://wdyziweidoushu666.com** directly — chart generation, AI readings, chart history, and all other features are available.
>
> 💕 **Follow us on Xiaohongshu / Douyin / Xianyu / X: 王多鱼AI** for launch updates and Zi Wei Dou Shu content.

A Zi Wei Dou Shu (Purple Star Astrology) chart system based on **Ni Haixia's "Tian Ji" teaching series**, including a complete chart calculation algorithm, the Si Hua (four-transformation) system, a pattern knowledge base, classical text data, and **518,000 sample chart records**.

Live demo: [wdyziweidoushu666.com](https://wdyziweidoushu666.com)

---

## 518,000 Sample Chart Dataset

> **Download location: the [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) page of this repository**

We have open-sourced a complete Zi Wei Dou Shu sample dataset covering **518,400 chart combinations** (60 years × 12 months × 30 days × 12 hours × 2 genders). Each sample contains a full chart structure and interpretation text based on Ni Haixia's system.

### Dataset Specifications

| Item | Details |
|------|---------|
| Sample count | **518,400 records** |
| Total size | 5.5 GB (split into 3 compressed volumes) |
| System | Ni Haixia's "Tian Ji" orthodox tradition (pure flying-star school edition retired) |
| Content | Chart JSON + 13-theme interpretation texts (overview, wealth, career, relationships, health, etc.) |
| Validation | Male/female differentiation 100%; health content includes zi-wu liu-zhu 100%; female charts include gynecology notes 100% |
| Consistency | Fully aligned with the live site [wdyziweidoushu666.com](https://wdyziweidoushu666.com) |

### Download

Go to [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) and download:

```
ziwei-samples-v3-part1.zip.001  (1.9 GB)
ziwei-samples-v3-part2.zip.002  (1.9 GB)
ziwei-samples-v3-part3.zip.003  (1.8 GB)
SHA256SUMS.txt                  (checksum file)
```

Merge and extract after downloading:

```bash
# macOS / Linux
cat ziwei-samples-v3-part*.zip.* > combined.zip
unzip combined.zip

# Windows (PowerShell)
Get-Content ziwei-samples-v3-part*.zip.* -Encoding Byte -ReadCount 0 | Set-Content combined.zip -Encoding Byte
Expand-Archive combined.zip
```

### Use Cases

- Training data for fine-tuning small models (518,400 input-output pairs)
- RAG retrieval source for AI conversations
- A/B baseline comparison after modifying `patterns.ts`
- Zi Wei Dou Shu research and data analysis

### License & Attribution

📂 **Fully open · Commercial use permitted** — you may use this dataset in any project, including but not limited to:

- Commercial products / SaaS / paid apps
- AI model fine-tuning (open-source or proprietary models)
- Derivative works, redistribution, derivative datasets
- Academic research, technical blog posts, educational courses

No payment, application, or prior notice required.

**The only requirement is attribution:**

> This project uses the **Zi Wei Dou Shu Open Sample Dataset v3.0** (518,400 records)
> Source: https://github.com/Renhuai123/ziwei-doushu
> Author: 王多鱼AI

Where to put it:

- **Web / product**: About page / footer / data source section — one line with a link
- **AI model**: Model Card or Dataset Card "Training Data" field
- **Academic paper**: References or acknowledgements section
- **Re-released datasets**: README or metadata file noting the upstream source

That's the only condition — everything else is free to use.

---

## Open-Sourced Content

### Chart Calculation Algorithm (`lib/ziwei/`)

| File | Description |
|------|-------------|
| `algorithm.ts` | Complete chart pipeline: set Life Palace, determine Wu Xing ju, place 14 major stars, place auxiliary stars, calculate Da Xian and Liu Nian |
| `constants.ts` | Heavenly stems, earthly branches, 14 major stars, auxiliary star constants |
| `sihua.ts` | Si Hua flying-star system (Lu/Quan/Ke/Ji), including the four-transformation table per heavenly stem |
| `patterns.ts` | **1100+ line pattern knowledge base**: detection rules for classical patterns such as Zi-Fu Tong Gong, Ri-Yue Bing Ming, Qi-Sha Chao Dou |
| `heming-knowledge.ts` | Compatibility reading methodology: dual-chart comparison logic in Ni Haixia's system |
| `types.ts` | TypeScript type definitions |
| `cities.ts` | Chinese city coordinates for true solar time correction |
| `famous.ts` | Historical figure sample chart data |

### Classical Texts (`lib/classics/`)

- **Gu Sui Fu** (`gusuifu.ts`) — core Zi Wei Dou Shu verse
- **Zi Wei Dou Shu Quan Ji** (`quanji.ts`) — Qing dynasty edition
- **Zi Wei Dou Shu Quan Shu** (`quanshu.ts`) — Chen Xiyi lineage edition

### Frontend Interface (`app/` + `components/`)

A complete Next.js frontend including:

- Chart workbench (12-palace grid, palace detail panel, star panel)
- Compatibility reading page (He Ming)
- Classical text reader (full-text search)
- Astrology encyclopedia (14 major stars + 12 palace knowledge pages)
- Light/dark theme toggle
- Mobile-responsive layout

### SEO Knowledge Graph (`lib/seo/`)

Structured knowledge data for 14 major stars × 12 palaces, usable for content generation or knowledge base construction.

---

## What Is Not Included

The following belong to the platform's operational layer and are outside the scope of this open-source release:

- **AI interpretation prompts**: prompts for chart readings tuned to Ni Haixia's system
- **Backend API routes**: `/api/interpret`, `/api/heming`, `/api/generate`, etc.
- **User system**: login, SMS verification, membership, payments
- **Server-side security**: signature verification, rate limiting, watermarks
- **Deployment configuration**: Vercel / Nginx / Docker / database

If you need AI interpretation capabilities, refer to `lib/ziwei/patterns.ts` and `heming-knowledge.ts` for the knowledge base and build your own prompts with any LLM.

---

## Quick Start

```bash
# Clone
git clone https://github.com/Renhuai123/ziwei-doushu.git
cd ziwei-doushu

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in your AI API key

# Start development server
pnpm dev
```

> Note: the open-source edition does not include backend API routes. AI interpretation requires you to implement `/api/interpret` and related endpoints yourself. The chart algorithm and frontend UI run independently.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables design system
- **Chart engine**: [iztro](https://github.com/SylarLong/iztro) + lunar-javascript
- **Animation**: Framer Motion

---

## Project Philosophy

Zi Wei Dou Shu is a treasure of Chinese traditional numerology. Ni Haixia systematically documented the orthodox Zi Wei Dou Shu tradition in his "Tian Ji" series. We want to use technology to make this knowledge accessible to more people.

We open-source the algorithm and knowledge base because we believe: **the algorithm is public traditional wisdom and should not be locked behind walls.** The real value lies in the depth of interpretation, the quality of user experience, and the ongoing work of operation.

Want to build your own? The code is all here — take it. Prefer a ready-made product? Go to [wdyziweidoushu666.com](https://wdyziweidoushu666.com) and use it directly.

---

## License

This repository uses three licenses — all permissive, **commercial use is unrestricted**:

| Content | License | Summary |
|---------|---------|---------|
| **Code** (`lib/`, `app/`, `components/`) | [MIT License](./LICENSE) | Use freely; keep the LICENSE file |
| **Data** (518,400 sample dataset v3.0 in Releases) | Free use · attribution required | Commercial use OK; **credit the source** (see Attribution section above) |
| **Classical texts** (Gu Sui Fu, Quan Ji, Quan Shu, etc.) | Public Domain | Ancient texts are in the public domain |

**In one sentence**: take it, use it commercially, just include the data source link.

---

## Contact

- Live platform: [wdyziweidoushu666.com](https://wdyziweidoushu666.com)
- Issues: bug reports and suggestions welcome
