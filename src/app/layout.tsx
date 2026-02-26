import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blind Dance - Devinez le type de danse!",
  description: "Un jeu multijoueur où vous devez deviner le type de danse à partir d'images, vidéos ou musiques",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
