// import "../stylesheets/style.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/queryProvider";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Khong Family",
  description: "Khong Family Website and Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
