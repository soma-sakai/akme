import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import SupabaseInitializer from "@/components/SupabaseInitializer";

// より安定したフォントに変更
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akamee - 高品質な商品をお届けするECサイト",
  description: "Akameeは高品質な商品を提供する日本のECサイトです。安心・安全なお買い物をお楽しみください。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <SupabaseInitializer />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
