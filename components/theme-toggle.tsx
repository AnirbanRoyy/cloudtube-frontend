"use client";

import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            <HugeiconsIcon
                icon={Sun03Icon}
                strokeWidth={2}
                className="hidden dark:block"
            />
            <HugeiconsIcon
                icon={Moon02Icon}
                strokeWidth={2}
                className="dark:hidden"
            />
        </Button>
    );
}
