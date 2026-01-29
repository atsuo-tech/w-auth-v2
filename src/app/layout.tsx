import type { Metadata } from "next";
import { Roboto, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "W-Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${roboto.variable}`}>
        <div className={styles.container}>
          {children}
        </div>
      </body>
    </html>
  );
}
