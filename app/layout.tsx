import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProviderWrapper } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rimbasmita.com"),

  title: {
    default: "Rimbasmita — Setiap langkah punya cerita",
    template: "%s | Rimbasmita",
  },

  description:
    "Rimbasmita adalah ruang digital bagi para pendaki untuk berbagi cerita, merefleksikan perjalanan, dan mendokumentasikan pengalaman di alam. Di sini, setiap langkah menjadi kisah, setiap perjalanan menjadi perenungan, dan setiap jejak menyimpan makna yang perlahan membentuk siapa kita.",

  keywords: [
    "Rimbasmita",
    "Satrio Wisnu Adi Pratama",
    "Satrio Wisnu adi",
    "Satrio Wisnu",
    "Satrio",
    "Mahasiswa Teknik Informatika",
    "Politeknik Negeri Malang",
    "Teknik Informatika",
    "Pendakian Gunung",
    "Pendakian",
    "Pendaki",
    "Hiking Platform",
    "Cerita Pendakian",
    "Outdoor Journal",
    "Web Developer Indonesia",
  ],

  authors: [{ name: "Satrio Wisnu Adi Pratama" }],

  openGraph: {
    title: "Rimbasmita — Setiap langkah punya cerita",
    description:
      "Platform berbagi cerita pendakian dan refleksi perjalanan. Dibangun oleh Satrio Wisnu Adi Pratama.",
    url: "https://rimbasmita.com",
    siteName: "Rimbasmita",
    images: [
      {
        url: "/assets/images/rimba-logo-1.png",
        width: 1200,
        height: 630,
        alt: "Rimbasmita Preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rimbasmita — Setiap langkah punya cerita",
    description:
      "Ruang digital untuk berbagi cerita pendakian. Dibangun oleh Satrio Wisnu Adi Pratama.",
    images: ["/assets/images/rimba-logo-1.png"],
  },

  icons: {
    icon: "/assets/favicon/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProviderWrapper>
          <AuthProvider>
            {children}
            <Toaster />

            {/* Structured Data (Person + Website) */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "Person",
                    name: "Satrio Wisnu Adi Pratama",
                    url: "https://rimbasmita.com",
                    sameAs: [
                      "https://github.com/satriowisnuap",
                      "https://www.linkedin.com/in/satrio-wisnu-adi-pratama-79776928a/",
                      "https://www.instagram.com/satrwisn/",
                    ],
                    jobTitle: "Web Developer",
                    description:
                      "Mahasiswa Teknik Informatika dan pengembang di balik Rimbasmita, platform berbagi cerita pendakian.",
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "Rimbasmita",
                    url: "https://rimbasmita.com",
                    author: {
                      "@type": "Person",
                      name: "Satrio Wisnu Adi Pratama",
                    },
                    description:
                      "Platform untuk berbagi cerita pendakian, refleksi perjalanan, dan pengalaman di alam.",
                  },
                ]),
              }}
            />
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
