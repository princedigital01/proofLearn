import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/provider";

import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ProofLearn | Decentralized Learning with Verifiable Credentials',
  description:
    'ProofLearn is a blockchain-powered e-learning platform where students own their certificates and educators are rewarded fairly. Learn, earn, and prove your skills globally.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  keywords: [
    'ProofLearn',
    'decentralized education',
    'blockchain learning',
    'verifiable certificates',
    'Web3 e-learning',
    'Cardano dApp',
    'online courses',
    'smart contracts',
    'NFT certificates',
  ],
  authors: [{ name: 'ProofLearn Team', url: 'https://prooflearn.com' }],
  creator: 'ProofLearn',
  applicationName: 'ProofLearn DApp',
  openGraph: {
    title: 'ProofLearn | Learn. Earn. Prove.',
    description:
      'Join the future of education with blockchain-powered credentials. Secure. Verifiable. Yours forever.',
    url: 'https://proof-learn-e.vercel.app/',
    siteName: 'ProofLearn',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProofLearn platform preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofLearn | Decentralized Learning',
    description:
      'A smarter way to learn — own your credentials, stake for access, and join the Web3 education movement.',
    creator: '@prooflearn',
    images: ['/og-image.png'],
  },
  themeColor: '#1d4ed8',
  viewport: 'width=device-width, initial-scale=1.0',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
