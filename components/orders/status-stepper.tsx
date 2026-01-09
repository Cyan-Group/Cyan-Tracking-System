'use client';

import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Status Enum map to display labels and order
export const ORDER_STATUSES = [
    { id: 'designed', label: 'تم التصميم', labelEn: 'Designed' },
    { id: 'printing', label: 'جار الطباعة', labelEn: 'Printing' },
    { id: 'printed', label: 'تمت الطباعة', labelEn: 'Printed' },
    { id: 'finishing', label: 'تجهيز نهائي', labelEn: 'Finishing' },
    { id: 'shipped', label: 'تم الشحن', labelEn: 'Shipped' },
    { id: 'delivering', label: 'جار التوصيل', labelEn: 'Delivering' },
    { id: 'delivered', label: 'تم التوصيل', labelEn: 'Delivered' },
] as const;

type StatusId = typeof ORDER_STATUSES[number]['id'];

interface StatusStepperProps {
    currentStatus: string;
    className?: string;
}

export function StatusStepper({ currentStatus, className }: StatusStepperProps) {
    // Find the index of the current status to know which steps are active
    const currentIndex = ORDER_STATUSES.findIndex((s) => s.id === currentStatus);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                {/* Progress Line (Desktop) */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 hidden md:block -z-10" dir="ltr">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${(safeIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Progress Line (Mobile) - Vertical */}
                <div className="absolute right-5 top-0 w-1 h-full bg-gray-200 md:hidden -z-10">
                    <div
                        className="w-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ height: `${(safeIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />
                </div>

                {ORDER_STATUSES.map((status, index) => {
                    const isCompleted = index <= safeIndex;
                    const isCurrent = index === safeIndex;

                    return (
                        <div key={status.id} className="flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto mb-8 md:mb-0 relative py-2 pr-2 md:pr-0 md:py-0">
                            {/* Circle Indicator */}
                            <div className={cn(
                                "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 z-10 bg-background",
                                isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-gray-300 text-gray-300",
                                isCurrent && "ring-4 ring-primary/20 scale-110"
                            )}>
                                {isCompleted ? <Check className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "text-sm font-medium transition-colors duration-300",
                                isCompleted ? "text-primary" : "text-gray-400",
                                isCurrent && "font-bold text-base"
                            )}>
                                {status.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
