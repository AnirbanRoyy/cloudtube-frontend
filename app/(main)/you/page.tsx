import Link from "next/link";

import { ChannelStrip } from "@/components/channel-strip";
import { UserAvatar } from "@/components/user-avatar";
import { VideoGrid } from "@/components/video-grid";
import { buttonVariants } from "@/components/ui/button";
import {
    getCurrentUser,
    getLikedVideos,
    getSubscribedChannels,
    getWatchHistory,
} from "@/lib/api";
import { formatCount } from "@/lib/format";

export const metadata = { title: "You · CloudTube" };

const PREVIEW = 4;

function SectionHeader({ title, href }: Readonly<{ title: string; href: string }>) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{title}</h2>
            <Link href={href} className={buttonVariants({ variant: "ghost" })}>
                View all
            </Link>
        </div>
    );
}

export default async function YouPage() {
    const [user, history, liked, channels] = await Promise.all([
        getCurrentUser(),
        getWatchHistory(),
        getLikedVideos(),
        getSubscribedChannels(),
    ]);

    return (
        <div className="mx-auto max-w-6xl space-y-10">
            <div className="flex items-center gap-4">
                <UserAvatar
                    src={user.avatar}
                    name={user.fullName}
                    className="size-20"
                />
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-semibold">
                        {user.fullName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        @{user.username} · {formatCount(user.subscribers)}{" "}
                        subscribers
                    </p>
                    <div className="mt-2 flex gap-2">
                        <Link
                            href={`/channel/${user.username}`}
                            className={buttonVariants({ variant: "outline" })}
                        >
                            View channel
                        </Link>
                        <Link
                            href="/dashboard"
                            className={buttonVariants({ variant: "outline" })}
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <SectionHeader title="History" href="/history" />
                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Nothing watched yet.
                    </p>
                ) : (
                    <VideoGrid
                        videos={history.slice(0, PREVIEW).map((h) => h.video)}
                    />
                )}
            </section>

            <section className="space-y-4">
                <SectionHeader title="Liked videos" href="/liked" />
                {liked.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No liked videos yet.
                    </p>
                ) : (
                    <VideoGrid videos={liked.slice(0, PREVIEW)} />
                )}
            </section>

            <section className="space-y-4">
                <SectionHeader title="Subscriptions" href="/subscriptions" />
                {channels.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Not subscribed to any channels yet.
                    </p>
                ) : (
                    <ChannelStrip channels={channels} />
                )}
            </section>
        </div>
    );
}
