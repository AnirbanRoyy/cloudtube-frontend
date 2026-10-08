"use client";

import { toast } from "sonner";

import { Field } from "@/components/auth/field";
import { UserAvatar } from "@/components/user-avatar";
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
import type { Channel } from "@/lib/types";

export function ChannelSettings({ channel }: { channel: Channel }) {
    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>Channel profile</CardTitle>
                <CardDescription>
                    Update how your channel appears to viewers.
                </CardDescription>
            </CardHeader>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: PATCH /users/:id, PATCH /users/update-avatar
                    toast.success("Profile saved (mock)");
                }}
            >
                <CardContent className="grid gap-4">
                    <div className="flex items-center gap-4">
                        <UserAvatar
                            src={channel.avatar}
                            name={channel.fullName}
                            size="lg"
                            className="size-16"
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            aria-label="Profile picture"
                        />
                    </div>
                    <Field id="fullName" label="Full name">
                        <Input id="fullName" defaultValue={channel.fullName} />
                    </Field>
                    <Field id="username" label="Username">
                        <Input
                            id="username"
                            defaultValue={channel.username}
                            disabled
                        />
                    </Field>
                </CardContent>
                <CardFooter className="mt-6">
                    <Button type="submit">Save changes</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
