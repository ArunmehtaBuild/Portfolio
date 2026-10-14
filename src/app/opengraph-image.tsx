import { ImageResponse } from "next/og";

export const alt = "Arun Mehta · Problem Atlas. Builder and operator, Director & COO at Nexera.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f3eee3";
const INK = "#1c2629";
const MUTED = "#586669";
const SEA = "#1d5c78";
const SURVEY = "#a8402c";
const CONTOUR = "#d3c9b3";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, position: "relative", padding: 72 }}>
        {/* Contour rings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 120 - i * 46,
              top: 150 - i * 40,
              width: 220 + i * 92,
              height: 160 + i * 80,
              borderRadius: "50%",
              border: `2px ${i === 4 ? "dashed" : "solid"} ${CONTOUR}`,
            }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: MUTED }}>REGION 00 · ORIGIN · NEW DELHI</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 112, color: INK, letterSpacing: -3, lineHeight: 1 }}>Arun Mehta</div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: MUTED }}>
              Builder and operator <span style={{ color: SURVEY, margin: "0 16px" }}>·</span> Director &amp; COO at Nexera
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: SEA }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: SEA, marginRight: 14 }} />
            Problem Atlas: the problems I’ve worked on, and the one I haven’t found yet
          </div>
        </div>
      </div>
    ),
    size,
  );
}
