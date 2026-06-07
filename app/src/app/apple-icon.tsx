import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const STAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 4 C17 12,20 15,28 16 C20 17,17 20,16 28 C15 20,12 17,4 16 C12 15,15 12,16 4 Z' fill='%23fff'/%3E%3C/svg%3E`;

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        borderRadius: "22%",
      }}>
      <img src={STAR_SVG} width={112} height={112} alt="" />
    </div>,
    { ...size },
  );
}
