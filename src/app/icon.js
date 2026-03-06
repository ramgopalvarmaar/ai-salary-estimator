import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          background: "#1a73e8",
          color: "#fff",
          fontSize: "22px",
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
