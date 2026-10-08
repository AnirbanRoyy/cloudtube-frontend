import Link from "next/link";

import { ChannelSettings } from "@/components/dashboard/channel-settings";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { VideosTable } from "@/components/dashboard/videos-table";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChannelStats, getCurrentUser, getMyVideos } from "@/lib/api";

export const metadata = { title: "Dashboard · CloudTube" };

export default async function DashboardPage() {
    const [stats, videos, user] = await Promise.all([
        getChannelStats(),
        getMyVideos(),
        getCurrentUser(),
    ]);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Channel dashboard</h1>
                <Link href="/upload" className={buttonVariants()}>
                    Upload video
                </Link>
            </div>

            <StatsCards stats={stats} />

            <Tabs defaultValue="videos">
                <TabsList>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="videos" className="pt-4">
                    <VideosTable initialVideos={videos} />
                </TabsContent>
                <TabsContent value="analytics" className="pt-4">
                    <p className="py-16 text-center text-sm text-muted-foreground">
                        Analytics are coming soon.
                    </p>
                </TabsContent>
                <TabsContent value="settings" className="pt-4">
                    <ChannelSettings channel={user} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
