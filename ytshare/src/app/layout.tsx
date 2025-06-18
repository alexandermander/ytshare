import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 text-gray-900">
        {children}
      </body>
    </html>
  );
}
