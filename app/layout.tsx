import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Murat Immo | Collection privée",
  description: "Collection immobilière privée, réservée aux visiteurs autorisés."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
