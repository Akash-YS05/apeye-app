import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import JsonLd from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ["latin"] });
const dm_sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apeye.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "APEye - Modern API Testing Tool",
    template: "%s | APEye",
  },
  description: "A modern, fast, and intuitive API testing client. Test, debug, and organize your APIs with ease. Free and open source alternative to Postman.",
  keywords: [
    "API testing",
    "API client",
    "REST API",
    "HTTP client",
    "API debugging",
    "Postman alternative",
    "API development",
    "web development",
    "developer tools",
    "API management",
  ],
  authors: [{ name: "Akash Pandey" }],
  creator: "Akash Pandey",
  publisher: "APEye",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "APEye",
    title: "APEye - Modern API Testing Tool",
    description: "A modern, fast, and intuitive API testing client. Test, debug, and organize your APIs with ease. Free and open source alternative to Postman.",
  },
  twitter: {
    card: "summary_large_image",
    title: "APEye - Modern API Testing Tool",
    description: "A modern, fast, and intuitive API testing client. Test, debug, and organize your APIs with ease.",
    creator: "@akashpandeytwt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.className} ${dm_sans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}