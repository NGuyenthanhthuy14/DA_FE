import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "./store/storeProvider";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={beVietnam.className}>
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
