import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import "../admin/globals.css";
import "../../components/GridView/GridCommon.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QA Garment",
  description: "Hệ thống quản lý nhân sự cho Công ty Cổ phần QA Garment",
  icons: {
        icon: '/images/logocongty2.png',
    },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@700&family=Montserrat:wght@700&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <div className="page-wrapper">
          <Header />
          <div className="layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}