import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "StreamPay — Real-Time Payment Streaming on Polkadot",
  description:
    "Stream native PAS per-second to any wallet on Paseo Asset Hub. No lump sums. No waiting. Just continuous, trustless money.",
  keywords: ["Polkadot", "DeFi", "StreamPay", "payment streaming", "Asset Hub", "PVM"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "StreamPay",
    description: "Real-time payment streaming on Polkadot",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <footer className="footer">
            <div className="container footer-inner">
              <div className="footer-brand">
                <div className="footer-logo-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="footer-logo logo-text">Stream<span className="brand-accent">Pay</span></span>
                </div>
                <span className="footer-tagline">Real-time payments on Polkadot</span>
              </div>
              <div className="footer-links">
                <a
                  href="https://contracts.polkadot.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Polkadot Docs
                </a>
                <a
                  href="https://assethub-paseo.subscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Explorer
                </a>
                <a
                  href="https://faucet.polkadot.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Get PAS
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
