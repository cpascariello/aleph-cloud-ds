import type { Metadata } from "next";
import { SidebarShell } from "@preview/components/sidebar";
import { ThemeSwitcher } from "@preview/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aleph Cloud Design System",
  description: "Token preview for @aleph-front-bkp/ds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://use.typekit.net/acb7qvn.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen flex-col">
          <header className="flex shrink-0 items-center justify-between
                             bg-background/80 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4
                             border-b border-edge">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold italic">
              Aleph Cloud DS
            </h1>
            <ThemeSwitcher />
          </header>
          <SidebarShell>
            {children}
          </SidebarShell>
        </div>
      </body>
    </html>
  );
}
