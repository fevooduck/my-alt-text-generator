import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Importa os estilos globais do Tailwind

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerador de Texto Alternativo com Gemini',
  description: 'Gere textos alternativos para imagens usando a IA do Google Gemini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
