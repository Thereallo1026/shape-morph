import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({
  subsets: ["latin"],
  adjustFontFallback: false,
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html className={googleSans.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
