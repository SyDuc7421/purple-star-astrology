"use client";
import { useState } from "react";
import BirthForm from "@/components/BirthForm";
import ChartBoard from "@/components/ChartBoard";
import InsightPanel from "@/components/InsightPanel";
import TimeNav, { type TimeView } from "@/components/TimeNav";
import { generateChart } from "@/lib/ziwei/algorithm";
import type { BirthInfo, ZiweiChart, Palace } from "@/lib/ziwei/types";

/**
 * Chart page — open-source "chart engine demo"
 * Trang lá số — "bản demo engine lá số" mã nguồn mở
 *
 * This is a minimal runnable example: uses the repo's generateChart() engine with basic UI
 * components to render a full Zi Wei chart + basic reading, with natal / Da Xian / Liu Nian switching.
 * Đây là một ví dụ chạy được tối giản: sử dụng engine generateChart() của repo cùng các thành phần UI
 * cơ bản để hiển thị lá số Tử Vi Đẩu Số đầy đủ + luận giải cơ bản, với chuyển đổi giữa bản mệnh / Đại Hạn / Lưu Niên.
 *
 * Note: the full commercial interactive UI (redesigned interface, AI streaming, union chart, share
 * cards, etc.) is not open-sourced; but the chart engine — star placement, Si Hua, pattern detection,
 * classical texts — is fully open (see lib/ziwei/*), free for you to build your own UI on top of.
 * Lưu ý: giao diện tương tác thương mại đầy đủ (giao diện được thiết kế lại, AI streaming, lá số hợp,
 * thẻ chia sẻ, v.v.) không được mã nguồn mở; nhưng engine lá số — an sao, Tứ Hóa, dò cách cục,
 * cổ văn kinh điển — hoàn toàn mở (xem lib/ziwei/*), tự do để bạn xây dựng UI riêng trên nền đó.
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>("mingpan");
  const [liunianYear, setLiunianYear] = useState(() =>
    new Date().getFullYear(),
  );

  // ── No chart yet: show birth info form ──
  // ── Chưa có lá số: hiển thị form thông tin sinh ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Zi Wei Dou Shu Chart Engine
        </h1>
        <p
          style={{
            color: "#888",
            marginBottom: 32,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Enter birth date and time — the open-source engine generates your chart instantly.
          <br />
          (This page is an engine demo; the full commercial UI is not open-sourced. The chart engine itself is fully open.)
        </p>
        <BirthForm
          onSubmit={(info: BirthInfo) => setChart(generateChart(info))}
        />
      </main>
    );
  }

  // ── Chart ready: chart + reading ──
  // ── Lá số đã sẵn sàng: lá số + luận giải ──
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
      <button
        type="button"
        onClick={() => {
          setChart(null);
          setSelectedPalace(null);
        }}
        style={{
          marginBottom: 16,
          padding: "6px 14px",
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: 8,
          background: "transparent",
        }}
      >
        ← New Chart
      </button>

      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 380px)",
          gap: 20,
          marginTop: 16,
          alignItems: "start",
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}
