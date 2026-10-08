"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

function formatSize(bytes: number) {
    return bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.ceil(bytes / 1024)} KB`;
}

export function UploadForm() {
    const router = useRouter();
    const videoInput = useRef<HTMLInputElement>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publish, setPublish] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const thumbUrl = useMemo(
        () => (thumbnail ? URL.createObjectURL(thumbnail) : null),
        [thumbnail]
    );

    useEffect(() => {
        if (!thumbUrl) return;
        return () => URL.revokeObjectURL(thumbUrl);
    }, [thumbUrl]);

    function pickVideo(file: File | undefined) {
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setErrors((e) => ({ ...e, video: "Choose a video file" }));
            return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
            setErrors((e) => ({ ...e, video: "Video must be under 500 MB" }));
            return;
        }
        setErrors((e) => ({ ...e, video: "" }));
        setVideo(file);
        if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!video) next.video = "Select a video to upload";
        if (!title.trim()) next.title = "Add a title";
        if (!thumbnail) next.thumbnail = "Add a thumbnail";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        // TODO: POST /api/v1/videos (multipart). Later: resumable upload straight to GCS.
        setProgress(0);
        const timer = setInterval(() => {
            setProgress((p) => {
                const value = Math.min(100, (p ?? 0) + 8 + Math.random() * 10);
                if (value >= 100) {
                    clearInterval(timer);
                    toast.success("Video uploaded (mock)");
                    router.push("/dashboard");
                }
                return value;
            });
        }, 250);
    }

    const uploading = progress !== null;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 lg:grid-cols-[1fr_320px]"
        >
            <div className="grid gap-6">
                <Card
                    className={cn(
                        "border-2 border-dashed transition-colors",
                        dragging && "border-primary bg-primary/5"
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        pickVideo(e.dataTransfer.files[0]);
                    }}
                >
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                        <HugeiconsIcon
                            icon={CloudUploadIcon}
                            strokeWidth={1.5}
                            className="size-12 text-muted-foreground"
                        />
                        {video ? (
                            <p className="text-sm">
                                <span className="font-medium">
                                    {video.name}
                                </span>{" "}
                                <span className="text-muted-foreground">
                                    ({formatSize(video.size)})
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Drag and drop a video here, or choose a file (up
                                to 500 MB)
                            </p>
                        )}
                        <input
                            ref={videoInput}
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            aria-label="Video file"
                            disabled={uploading}
                            onChange={(e) => pickVideo(e.target.files?.[0])}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={uploading}
                            onClick={() => videoInput.current?.click()}
                        >
                            {video ? "Change file" : "Select file"}
                        </Button>
                        {errors.video ? (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.video}
                            </p>
                        ) : null}
                    </CardContent>
                </Card>

                <Field id="title" label="Title" error={errors.title}>
                    <Input
                        id="title"
                        value={title}
                        maxLength={100}
                        disabled={uploading}
                        aria-invalid={!!errors.title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Field>
                <Field id="description" label="Description">
                    <Textarea
                        id="description"
                        rows={5}
                        value={description}
                        disabled={uploading}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>
            </div>

            <div className="grid content-start gap-6">
                <Field
                    id="thumbnail"
                    label="Thumbnail"
                    error={errors.thumbnail}
                >
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                        {thumbUrl ? (
                            <Image
                                src={thumbUrl}
                                alt="Thumbnail preview"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        ) : null}
                    </div>
                    <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        aria-invalid={!!errors.thumbnail}
                        onChange={(e) =>
                            setThumbnail(e.target.files?.[0] ?? null)
                        }
                    />
                </Field>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="publish"
                        checked={publish}
                        disabled={uploading}
                        onCheckedChange={(checked) =>
                            setPublish(checked === true)
                        }
                    />
                    <Label htmlFor="publish">Publish immediately</Label>
                </div>

                {uploading ? (
                    <div className="grid gap-2">
                        <Progress value={progress} />
                        <p className="text-xs text-muted-foreground">
                            Uploading… {Math.round(progress)}%
                        </p>
                    </div>
                ) : null}

                <Button type="submit" disabled={uploading}>
                    {uploading ? "Uploading…" : "Upload video"}
                </Button>
            </div>
        </form>
    );
}
