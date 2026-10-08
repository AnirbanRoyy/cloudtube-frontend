import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex min-h-svh flex-col">
            <header className="flex items-center justify-between p-4">
                <Logo />
                <ThemeToggle />
            </header>
            <main className="flex flex-1 items-center justify-center p-4 pb-16">
                {children}
            </main>
        </div>
    );
}
