import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard/today"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Today
            </Link>
            <Link
                href="/dashboard/upcoming"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Upcoming
            </Link>
            <Link
                href="/dashboard/calendar"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Calendar
            </Link>
            <Link
                href="/dashboard/analytics"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Analytics
            </Link>
            <Link
                href="/dashboard/notes"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Notes
            </Link>
        </nav>
    )
}