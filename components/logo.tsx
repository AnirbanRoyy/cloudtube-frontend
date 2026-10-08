import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayCircleIcon } from "@hugeicons/core-free-icons";

export function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
        >
            <HugeiconsIcon
                icon={PlayCircleIcon}
                strokeWidth={2}
                className="size-6 text-primary"
            />
            <span className="text-lg">CloudTube</span>
        </Link>
    );
}
