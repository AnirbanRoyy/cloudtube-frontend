"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Delete02Icon,
    MoreVerticalIcon,
    PencilEdit02Icon,
    ViewIcon,
    ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCount, formatDuration, timeAgo } from "@/lib/format";
import type { Video } from "@/lib/types";

export function VideosTable({ initialVideos }: { initialVideos: Video[] }) {
    const [videos, setVideos] = useState(initialVideos);
    const [toDelete, setToDelete] = useState<Video | null>(null);

    // TODO: wire to POST /videos/toggle-publish/:id and DELETE /videos/:id
    function togglePublish(id: string) {
        setVideos((vs) =>
            vs.map((v) =>
                v.id === id ? { ...v, isPublished: !v.isPublished } : v
            )
        );
        toast.success("Visibility updated (mock)");
    }

    function confirmDelete() {
        if (!toDelete) return;
        setVideos((vs) => vs.filter((v) => v.id !== toDelete.id));
        toast.success(`Deleted "${toDelete.title}" (mock)`);
        setToDelete(null);
    }

    if (videos.length === 0) {
        return (
            <p className="py-16 text-center text-sm text-muted-foreground">
                You haven&apos;t uploaded any videos yet.
            </p>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="hidden sm:table-cell">
                            Uploaded
                        </TableHead>
                        <TableHead className="w-10">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-muted">
                                        <Image
                                            src={video.thumbnail}
                                            alt=""
                                            fill
                                            sizes="112px"
                                            className="object-cover"
                                        />
                                        <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 text-[10px] text-white">
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/watch/${video.id}`}
                                        className="line-clamp-2 text-sm font-medium whitespace-normal hover:underline"
                                    >
                                        {video.title}
                                    </Link>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        video.isPublished
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {video.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCount(video.views)}
                            </TableCell>
                            <TableCell className="hidden text-muted-foreground sm:table-cell">
                                {timeAgo(video.createdAt)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        aria-label={`Actions for ${video.title}`}
                                        className="inline-flex size-8 items-center justify-center rounded-full outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    >
                                        <HugeiconsIcon
                                            icon={MoreVerticalIcon}
                                            strokeWidth={2}
                                            className="size-4"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                toast.info(
                                                    "Editing isn't built yet"
                                                )
                                            }
                                        >
                                            <HugeiconsIcon
                                                icon={PencilEdit02Icon}
                                                strokeWidth={2}
                                            />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                togglePublish(video.id)
                                            }
                                        >
                                            <HugeiconsIcon
                                                icon={
                                                    video.isPublished
                                                        ? ViewOffIcon
                                                        : ViewIcon
                                                }
                                                strokeWidth={2}
                                            />
                                            {video.isPublished
                                                ? "Unpublish"
                                                : "Publish"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => setToDelete(video)}
                                        >
                                            <HugeiconsIcon
                                                icon={Delete02Icon}
                                                strokeWidth={2}
                                            />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog
                open={toDelete !== null}
                onOpenChange={(open) => !open && setToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete video?</DialogTitle>
                        <DialogDescription>
                            &quot;{toDelete?.title}&quot; and its comments will
                            be permanently removed. This can&apos;t be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
