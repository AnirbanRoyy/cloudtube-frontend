"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LIVE, register } from "@/lib/auth-client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const image = (required: boolean) =>
    z
        .instanceof(File)
        .refine(
            (f) => f.size === 0 || f.type.startsWith("image/"),
            "Choose an image file"
        )
        .refine((f) => f.size <= MAX_IMAGE_BYTES, "Image must be under 5 MB")
        .refine((f) => !required || f.size > 0, "An avatar is required");

const schema = z.object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    username: z
        .string()
        .trim()
        .min(3, "At least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    avatar: image(true),
    coverImage: image(false),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function SignupForm() {
    const router = useRouter();
    const [errors, setErrors] = useState<Errors>({});
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const parsed = schema.safeParse(Object.fromEntries(formData));
        if (!parsed.success) {
            const flat = parsed.error.flatten().fieldErrors as Record<
                string,
                string[] | undefined
            >;
            setErrors(
                Object.fromEntries(
                    Object.entries(flat).map(([k, v]) => [k, v?.[0]])
                )
            );
            return;
        }
        setErrors({});
        setPending(true);
        try {
            if (LIVE) {
                // Backend rejects an empty coverImage part, so drop it.
                const cover = formData.get("coverImage");
                if (cover instanceof File && cover.size === 0) {
                    formData.delete("coverImage");
                }
                await register(formData);
            } else {
                await new Promise((r) => setTimeout(r, 800));
            }
            toast.success("Account created. Sign in to continue.");
            router.push("/login");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Could not create account"
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription>
                    Start watching, subscribing and uploading.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit} noValidate>
                <CardContent className="grid gap-4">
                    <Field
                        id="fullName"
                        label="Full name"
                        error={errors.fullName}
                    >
                        <Input
                            id="fullName"
                            name="fullName"
                            autoComplete="name"
                            aria-invalid={!!errors.fullName}
                        />
                    </Field>
                    <Field
                        id="username"
                        label="Username"
                        error={errors.username}
                    >
                        <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            aria-invalid={!!errors.username}
                        />
                    </Field>
                    <Field id="email" label="Email" error={errors.email}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                        />
                    </Field>
                    <Field
                        id="password"
                        label="Password"
                        error={errors.password}
                    >
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={!!errors.password}
                        />
                    </Field>
                    <Field
                        id="avatar"
                        label="Profile picture"
                        error={errors.avatar}
                    >
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            aria-invalid={!!errors.avatar}
                        />
                    </Field>
                    <Field
                        id="coverImage"
                        label="Cover image (optional)"
                        error={errors.coverImage}
                    >
                        <Input
                            id="coverImage"
                            name="coverImage"
                            type="file"
                            accept="image/*"
                            aria-invalid={!!errors.coverImage}
                        />
                    </Field>
                </CardContent>
                <CardFooter className="mt-6 flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Creating account…" : "Sign up"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-foreground underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
