import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SciWave",
  description: "Repositorio de artículos científicos traducidos al español y portugués",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
