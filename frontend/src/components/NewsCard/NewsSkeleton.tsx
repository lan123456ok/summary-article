import React from 'react';
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {cn} from '@/lib/utils.ts';

const NewsSkeleton = ({className}) => {
    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            <Skeleton className="h-40 w-full"/>

            <div className="space-y-2">
                <Skeleton className="h-5 w-3/4"/>
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-3 w-3 rounded-full"/>
                    <Skeleton className="h-3 w-16"/>
                    <Skeleton className="h-3 w-3 rounded-full"/>
                    <Skeleton className="h-3 w-20"/>
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-3 w-full"/>
                    <Skeleton className="h-3 w-5/6"/>
                    <Skeleton className="h-3 w-4/5"/>
                </div>

                <Skeleton className="h-3 w-20"/>
            </div>
        </div>
    )
};

export default NewsSkeleton;