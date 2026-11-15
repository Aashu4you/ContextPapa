import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextPapa – AI Knowledge Assistant",
  description:
    "Your personal AI-powered knowledge assistant. Upload documents and ask questions grounded in your own content.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
