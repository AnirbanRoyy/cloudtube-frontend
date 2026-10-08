import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
    src,
    name,
    size,
    className,
}: {
    src?: string;
    name: string;
    size?: "default" | "sm" | "lg";
    className?: string;
}) {
    return (
        <Avatar size={size} className={className}>
            {src ? <AvatarImage src={src} alt={name} /> : null}
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}
