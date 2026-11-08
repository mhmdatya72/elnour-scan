import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { DemoBanner } from "@/components/Demo";
import { JsonLd } from "@/components/JsonLd";
import { DEMO_MODE } from "@/config/demo";
import { MobileContactBar } from "@/components/MobileContactBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/config/site";
import { medicalBusinessSchema, metadataBase, pageMetadata } from "@/lib/seo";
import "./globals.css";

const heading = Alexandria({
  variable: "--font-heading",
  subsets: ["arabic", "latin"],
  weight: ["700", "800"],
});

const body = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const homeTitle = `${siteConfig.name.arShort} | رعاية طبية منزلية في ${siteConfig.city.ar}`;

export const metadata: Metadata = {
  metadataBase,
  applicationName: siteConfig.name.ar,
  ...pageMetadata({ title: homeTitle, description: siteConfig.description, path: "/" }),
  title: { default: homeTitle, template: `%s | ${siteConfig.name.arShort}` },
  // نسخة الديمو ما تتفهرسش عشان بياناتها التجريبية ما تظهرش في نتائج البحث
  ...(DEMO_MODE ? { robots: { index: false, follow: false } } : {}),
  ...(siteConfig.verification.google
    ? { verification: { google: siteConfig.verification.google } }
    : {}),
};

export const viewport: Viewport = { themeColor: "#082747" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gaId = siteConfig.analytics.googleAnalyticsId;

  return (
    <html lang="ar" dir="rtl" className={`${heading.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-svh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
        >
          انتقل إلى المحتوى
        </a>
        <JsonLd data={medicalBusinessSchema()} />
        <DemoBanner />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileContactBar />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
