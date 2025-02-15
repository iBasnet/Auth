import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { UserNav } from "./components/user-nav"
import { MainNav } from "./components/main-nav"
import { Search } from "./components/search"
import { Activity, CalendarClock, CircleCheckBig } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardPage() {
    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/dashboard-light.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/dashboard-dark.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <h1>ToDo App™</h1>
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                            <Search />
                            <UserNav />
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <Button>Monk Mode</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">All Tasks</TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed
                            </TabsTrigger>
                            <TabsTrigger value="overdue">
                                Overdue
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            This month
                                        </CardTitle>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Activity
                                                        className="h-5 w-5 text-muted-foreground cursor-pointer"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Pending</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="text-2xl font-bold">Learn Next.js</div>
                                        <Badge variant="outline">Mastery</Badge>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            This week
                                        </CardTitle>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Activity
                                                        className="h-5 w-5 text-muted-foreground cursor-pointer"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Pending</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="text-2xl font-bold">Honors College Form</div>
                                        <Badge variant="outline">Academics</Badge>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Today
                                        </CardTitle>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CircleCheckBig
                                                        className="h-5 w-5 text-muted-foreground cursor-pointer"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Completed</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="text-2xl font-bold">Cold Shower</div>
                                        <Badge variant="outline">Discipline</Badge>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}