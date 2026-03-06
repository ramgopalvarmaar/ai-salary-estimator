import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "36px",
          background: "#1a73e8",
          color: "#fff",
          fontSize: "120px",
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
        }}
      >
        $
      </div>
    ),
    size
  );
}
