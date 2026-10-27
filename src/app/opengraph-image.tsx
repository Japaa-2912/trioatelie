import { ImageResponse } from "next/og";
import { getStoreSettings } from "@/lib/data/store";
import { getSiteUrl } from "@/lib/site";

export const alt = "Lembrancinhas personalizadas feitas à mão";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpenGraphImage() {
  const settings = await getStoreSettings();
  const siteUrl = getSiteUrl().replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf7f1",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "#f2d9d4",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -120,
            bottom: -220,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "#e3ebde",
            opacity: 0.5,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#f2d9d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a9786c",
              fontSize: 34,
            }}
          >
            {settings.brandName.slice(0, 1)}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, color: "#3d342e", letterSpacing: -0.5 }}>
              {settings.brandName}
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#77695f",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "Helvetica, Arial, sans-serif",
                marginTop: 4,
              }}
            >
              {settings.tagline}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <span
            style={{
              fontSize: 15,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a9786c",
              fontFamily: "Helvetica, Arial, sans-serif",
              marginBottom: 22,
            }}
          >
            {settings.heroEyebrow ?? "Ateliê de lembrancinhas"}
          </span>
          <span
            style={{
              fontSize: 62,
              lineHeight: 1.06,
              color: "#3d342e",
              letterSpacing: -1.5,
            }}
          >
            {settings.heroTitle}
          </span>
          <span
            style={{
              fontSize: 22,
              lineHeight: 1.5,
              color: "#77695f",
              fontFamily: "Helvetica, Arial, sans-serif",
              marginTop: 26,
              maxWidth: 780,
            }}
          >
            {settings.heroSubtitle}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e9dfd3",
            paddingTop: 26,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 16,
            color: "#77695f",
          }}
        >
          <span>Feito à mão • Personalização a combinar</span>
          <span style={{ color: "#a9786c" }}>{siteUrl}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
