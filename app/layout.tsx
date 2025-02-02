import "./globals.css"; 
import ClientProvider from "@/app/client-provider";
import Header from "@/app/components/Header"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <Header /> 
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
