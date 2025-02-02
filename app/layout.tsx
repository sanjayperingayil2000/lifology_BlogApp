import "./globals.css";
import ClientProvider from "@/app/client-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Welcome to the home page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}