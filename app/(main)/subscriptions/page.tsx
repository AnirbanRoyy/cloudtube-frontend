import { ChannelStrip } from "@/components/channel-strip";
import { VideoGrid } from "@/components/video-grid";
import { getSubscribedChannels, getSubscriptionFeed } from "@/lib/api";

export const metadata = { title: "Subscriptions · CloudTube" };

export default async function SubscriptionsPage() {
    const [channels, videos] = await Promise.all([
        getSubscribedChannels(),
        getSubscriptionFeed(),
    ]);

    if (channels.length === 0) {
        return (
            <p className="py-20 text-center text-sm text-muted-foreground">
                You haven&apos;t subscribed to any channels yet.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            <ChannelStrip channels={channels} />
            <h1 className="text-2xl font-semibold">Latest</h1>
            <VideoGrid videos={videos} />
        </div>
    );
}
