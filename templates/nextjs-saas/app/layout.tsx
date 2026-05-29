import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skyface SaaS",
  description: "Skyface App Kit 으로 만든 Next.js SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
