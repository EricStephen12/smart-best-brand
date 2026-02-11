import type { Metadata } from "next";
import { Playfair_Display, Inter, Crimson_Text, Montserrat } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smart Best Brands - Premium Home & Comfort",
  description: "Authentic premium mattresses, pillows, and furniture from Nigeria&apos;s leading brands. Smart Best Brands - quality you can trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${crimson.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Layout>
            {children}
          </Layout>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#fff',
                borderRadius: '1rem',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '1rem 2rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
