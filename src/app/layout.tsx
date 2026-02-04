import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast My Proposal",
  description: "Get your sales proposal brutally (but helpfully) roasted by AI",
  openGraph: {
    title: "Roast My Proposal",
    description: "Upload your sales proposal. Get brutally honest feedback. Close more deals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-panda-bg font-poppins" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
