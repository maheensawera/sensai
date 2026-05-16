import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SANSAI - AI Career Mentor",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />

            <main className="min-h-screen">{children}</main>

            <Toaster richColors />

            {/* ── FOOTER ── */}
            <footer className="bg-[#0f172a] py-8 border-t border-white/5">
              <div className="container mx-auto px-4 md:px-6 text-center">
                <p className="text-sm text-slate-400 tracking-wide">
                  © 2026 AI CareerMentor &nbsp;·&nbsp; Developed by{" "}
                  <span className="text-slate-300 font-medium">Maheen Sawera &amp; Sidra Khalid</span>
                </p>
              </div>
            </footer>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
