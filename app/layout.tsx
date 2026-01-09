import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Cyan Tracking System",
    description: "Print Shop Order Tracking",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.className
            )}
            >
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
