import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Цветочный салон — свежие цветы с доставкой",
  description: "Доставка свежих цветов и букетов по городу. Широкий выбор композиций для любого повода.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <CartProvider>
          <Navigation />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
