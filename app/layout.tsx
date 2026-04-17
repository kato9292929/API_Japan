import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Japan x402 APIs",
  description:
    "Japan & APAC data APIs with x402 micropayment gating on Base Sepolia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0f0f0f", color: "#e0e0e0" }}>
        {children}
      </body>
    </html>
  );
}
