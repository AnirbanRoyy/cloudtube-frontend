import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/lib/format";
import type { ChannelStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: ChannelStats }) {
    const items = [
        { label: "Total views", value: stats.totalViews },
        { label: "Subscribers", value: stats.subscribers },
        { label: "Videos", value: stats.totalVideos },
        { label: "Total likes", value: stats.totalLikes },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {item.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">
                            {formatCount(item.value)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
