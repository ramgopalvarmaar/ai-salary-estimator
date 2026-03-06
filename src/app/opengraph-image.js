import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#ffffff",
          color: "#202124",
          fontFamily: "Arial",
          padding: "56px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "28px",
            color: "#1a73e8",
            fontWeight: 600,
          }}
        >
          AI Salary Calculator
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "64px", fontWeight: 600, lineHeight: 1.1, color: "#202124" }}>
            Know what you're worth.
          </div>
          <div style={{ fontSize: "28px", color: "#5f6368", maxWidth: "900px", lineHeight: 1.4 }}>
            Free salary estimate powered by AI. Enter your role, location, and
            experience to see how your pay compares to the market.
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "20px", color: "#5f6368" }}>
          <div style={{ borderBottom: "2px solid #1a73e8", paddingBottom: "4px", color: "#1a73e8" }}>
            Salary Calculator
          </div>
          <div>Compensation Benchmark</div>
          <div>Negotiation Tools</div>
        </div>
      </div>
    ),
    size
  );
}
