import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/language-selector";
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toogle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "@/app/providers/QueryProvider";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});



export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider className="">
                <AppSidebar />
                <LanguageProvider defaultLanguage="en">
                    <div className="flex flex-col flex-1 min-h-screen p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <SidebarTrigger />
                            <ModeToggle />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <QueryProvider>
                                {children}
                            </QueryProvider>
                        </div>
                    </div>
                </LanguageProvider>
            </SidebarProvider>
        </ThemeProvider>
    );
}
