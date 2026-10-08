"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DashboardSquare01Icon,
    Logout01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { UserAvatar } from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LIVE, logout } from "@/lib/auth-client";
import type { Channel } from "@/lib/types";

export function UserMenu({ user }: Readonly<{ user: Channel }>) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Account menu"
                className="ml-1 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <UserAvatar src={user.avatar} name={user.fullName} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <span className="block text-sm font-medium text-foreground">
                            {user.fullName}
                        </span>
                        @{user.username}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                    <HugeiconsIcon
                        icon={DashboardSquare01Icon}
                        strokeWidth={2}
                    />
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        try {
                            if (LIVE) await logout();
                            toast.success("Signed out");
                            router.push("/login");
                            router.refresh();
                        } catch (err) {
                            toast.error(
                                err instanceof Error
                                    ? err.message
                                    : "Could not sign out"
                            );
                        }
                    }}
                >
                    <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
