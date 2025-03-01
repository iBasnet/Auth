import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function ToDoSkeleton() {
    return (
        <Card
            className="w-full h-36 rounded-md p-6 flex flex-col justify-evenly"
        >
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[40%] rounded-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-5 rounded-sm" />
                    <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
            </div>
            <Skeleton className="h-6 w-[80%] rounded-full mt-2 mb-4" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
        </Card>
    )
}
