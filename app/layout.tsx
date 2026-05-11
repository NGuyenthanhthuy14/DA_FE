import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "./store/storeProvider";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.className} ${playfair.variable}`}>
        <StoreProvider> 
          <Navbar />
          {children}
          <Toaster position="top-center" />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
