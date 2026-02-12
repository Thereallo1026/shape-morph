import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

const fontsDir = join(process.cwd(), "public/fonts");
const fontRegular = readFileSync(join(fontsDir, "google-sans-regular.ttf"));
const fontBold = readFileSync(join(fontsDir, "google-sans-bold.ttf"));

const iconSvg = readFileSync(join(process.cwd(), "public/icon.svg"), "utf-8");
const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString("base64")}`;

const colors = {
  background: "hsl(270, 100%, 99.6%)",
  foreground: "hsl(270, 6%, 10%)",
  mutedForeground: "hsl(270, 6%, 40%)",
  primary: "hsl(264, 34%, 48%)",
};

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        padding: "80px",
        backgroundColor: colors.background,
        fontFamily: "Google Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        <img alt="" height={56} src={iconDataUri} width={56} />
        <p
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: colors.foreground,
            margin: 0,
          }}
        >
          {page.data.title}
        </p>
      </div>
      {page.data.description ? (
        <p
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: colors.mutedForeground,
            margin: 0,
            marginTop: "20px",
            lineHeight: 1.5,
          }}
        >
          {page.data.description}
        </p>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Google Sans",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Google Sans",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
