import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locum Finder",
  description: "Healthcare staffing marketplace for clinics and locum professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
