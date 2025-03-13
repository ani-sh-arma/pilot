import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Pilot",
  description: "A file upload solution like Google Drive.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <PostHogProvider>
          <body>
            {children}
            <Toaster position="bottom-right" />
          </body>
        </PostHogProvider>
      </html>
    </ClerkProvider>
  );
}
