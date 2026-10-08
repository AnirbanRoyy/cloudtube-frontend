"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    Clock01Icon,
    DashboardSquare01Icon,
    Home01Icon,
    ThumbsUpIcon,
    Upload01Icon,
    UserGroupIcon,
    UserIcon,
} from "@hugeicons/core-free-icons";

import { Logo } from "@/components/logo";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = { title: string; href: string; icon: IconSvgElement };

const browse: NavItem[] = [
    { title: "Home", href: "/", icon: Home01Icon },
    { title: "Subscriptions", href: "/subscriptions", icon: UserGroupIcon },
];

const library: NavItem[] = [
    { title: "You", href: "/you", icon: UserIcon },
    { title: "History", href: "/history", icon: Clock01Icon },
    { title: "Liked videos", href: "/liked", icon: ThumbsUpIcon },
];

const studio: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
    { title: "Upload", href: "/upload", icon: Upload01Icon },
];

function NavGroup({ label, items }: { label?: string; items: NavItem[] }) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.href)
                                }
                                render={<Link href={item.href} />}
                            >
                                <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="md:hidden">
                <Logo />
            </SidebarHeader>
            <SidebarContent className="md:pt-14">
                <NavGroup items={browse} />
                <NavGroup label="Library" items={library} />
                <NavGroup label="Studio" items={studio} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
