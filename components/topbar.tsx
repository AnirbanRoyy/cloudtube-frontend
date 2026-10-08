import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Upload01Icon } from "@hugeicons/core-free-icons";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/api";

export async function Topbar() {
    const user = await getCurrentUser();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="hidden sm:block">
                    <Logo />
                </div>
            </div>

            <form
                action="/search"
                className="mx-auto flex w-full max-w-xl items-center gap-2"
            >
                <Input
                    name="q"
                    type="search"
                    placeholder="Search"
                    aria-label="Search videos"
                />
                <Button
                    type="submit"
                    variant="secondary"
                    size="icon"
                    aria-label="Search"
                >
                    <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
                </Button>
            </form>

            <div className="flex items-center gap-1">
                <Link
                    href="/upload"
                    className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                    })}
                    aria-label="Upload video"
                >
                    <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
                </Link>
                <ThemeToggle />
                {user ? (
                    <UserMenu user={user} />
                ) : (
                    <Link
                        href="/login"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        Sign in
                    </Link>
                )}
            </div>
        </header>
    );
}
