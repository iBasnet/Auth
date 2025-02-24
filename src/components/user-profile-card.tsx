import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Cake, CalendarClock, Mail, MapPin } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { GetInitials } from "@/lib/utils"
import type { UserT } from "@/lib/zodSchema"
import type { UserDateT } from "@/lib/types"

export function UserProfileCard({ user, userDate }: { user: UserT, userDate: UserDateT }) {
    return (
        <Card className="w-[350px] scale-110">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-14 w-14">
                    <AvatarImage src={user.avatar} alt={user.name}
                        className="h-full w-full object-cover object-center"
                    />
                    <AvatarFallback>{GetInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Badge variant="secondary">{user.jobTitle}</Badge>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-muted-foreground" />
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{user.location}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{user.bio}</p>

                <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Cake size={16} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Joined on</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {/* <span className="text-sm text-muted-foreground">Joined on</span> */}
                        <span className="text-sm font-medium">{userDate.joined}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CalendarClock size={16} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Last seen</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {/* <span className="text-sm text-muted-foreground">Last seen</span> */}
                        <span className="text-sm font-medium">{userDate.logged}</span>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}