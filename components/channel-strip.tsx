import Link from "next/link";

import { UserAvatar } from "@/components/user-avatar";
import { formatCount } from "@/lib/format";
import type { Channel } from "@/lib/types";

/** Horizontally scrollable row of channel avatars. */
export function ChannelStrip({ channels }: Readonly<{ channels: Channel[] }>) {
    return (
        <ul className="flex gap-6 overflow-x-auto pb-2">
            {channels.map((channel) => (
                <li key={channel.id} className="shrink-0">
                    <Link
                        href={`/channel/${channel.username}`}
                        className="flex w-24 flex-col items-center gap-2 text-center"
                    >
                        <UserAvatar
                            src={channel.avatar}
                            name={channel.fullName}
                            className="size-16"
                        />
                        <span className="w-full truncate text-xs font-medium">
                            {channel.fullName}
                        </span>
                        <span className="-mt-1.5 text-xs text-muted-foreground">
                            {formatCount(channel.subscribers)}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
