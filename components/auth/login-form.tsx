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

const schema = z.object({
    identifier: z.string().trim().min(1, "Enter your username or email"),
    password: z.string().min(1, "Enter your password"),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function LoginForm() {
    const router = useRouter();
    const [errors, setErrors] = useState<Errors>({});
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const parsed = schema.safeParse(
            Object.fromEntries(new FormData(e.currentTarget))
        );
        if (!parsed.success) {
            const flat = parsed.error.flatten().fieldErrors;
            setErrors({
                identifier: flat.identifier?.[0],
                password: flat.password?.[0],
            });
            return;
        }
        setErrors({});
        setPending(true);
        // TODO: POST /api/v1/users/login once the backend is wired up
        await new Promise((r) => setTimeout(r, 600));
        setPending(false);
        toast.success("Signed in (mock)");
        router.push("/");
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign in</CardTitle>
                <CardDescription>
                    Use your username or email to continue.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit} noValidate>
                <CardContent className="grid gap-4">
                    <Field
                        id="identifier"
                        label="Username or email"
                        error={errors.identifier}
                    >
                        <Input
                            id="identifier"
                            name="identifier"
                            autoComplete="username"
                            aria-invalid={!!errors.identifier}
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
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                        />
                    </Field>
                </CardContent>
                <CardFooter className="mt-6 flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Signing in…" : "Sign in"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        New here?{" "}
                        <Link
                            href="/signup"
                            className="text-foreground underline underline-offset-4"
                        >
                            Create an account
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
