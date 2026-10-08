import { VideoRow } from "@/components/video-row";
import { getWatchHistory } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import type { HistoryEntry } from "@/lib/types";

export const metadata = { title: "Watch history · CloudTube" };

const DAY = 86_400_000;

function groupByDay(history: HistoryEntry[]) {
    const now = Date.now();
    const groups = new Map<string, HistoryEntry[]>();
    for (const entry of history) {
        const age = now - new Date(entry.watchedAt).getTime();
        const label =
            age < DAY ? "Today" : age < 2 * DAY ? "Yesterday" : "Earlier";
        groups.set(label, [...(groups.get(label) ?? []), entry]);
    }
    return groups;
}

export default async function HistoryPage() {
    const history = await getWatchHistory();
    const groups = groupByDay(history);

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-2xl font-semibold">Watch history</h1>

            {history.length === 0 ? (
                <p className="py-20 text-center text-sm text-muted-foreground">
                    Videos you watch will show up here.
                </p>
            ) : (
                [...groups].map(([label, entries]) => (
                    <section key={label} className="space-y-4">
                        <h2 className="text-lg font-medium">{label}</h2>
                        {entries.map(({ video, watchedAt }) => (
                            <VideoRow
                                key={video.id}
                                video={video}
                                meta={`Watched ${timeAgo(watchedAt)}`}
                            />
                        ))}
                    </section>
                ))
            )}
        </div>
    );
}
