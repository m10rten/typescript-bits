import { ImageResponse } from "next/og";

export const alt = "typescript-bits — TypeScript utility primitives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 4 C17 12,20 15,28 16 C20 17,17 20,16 28 C15 20,12 17,4 16 C12 15,15 12,16 4 Z' fill='%23fff'/%3E%3C/svg%3E`;

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        backgroundImage: "radial-gradient(circle at 50% 28%, rgba(255,255,255,0.04) 0%, transparent 55%)",
      }}>
      {/* Star — well above the text block, no overlap */}
      <img src={STAR_SVG} width={200} height={200} alt="" style={{ marginBottom: 52, marginTop: -16 }} />

      {/* Title */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 650,
          color: "#fff",
          letterSpacing: "-1.5px",
          lineHeight: 1.2,
        }}>
        typescript-bits
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#888",
          marginTop: 16,
          letterSpacing: "0.3px",
        }}>
        TypeScript utility primitives
      </div>

      {/* URL */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: "#555",
          marginTop: 60,
          letterSpacing: "0.5px",
        }}>
        typescript-bits.dev
      </div>
    </div>,
    { ...size },
  );
}
