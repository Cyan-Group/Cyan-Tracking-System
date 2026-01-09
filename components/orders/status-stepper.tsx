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
        <div className={cn("w-full py-8", className)}>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full z-0">
                {/* Progress Line (Desktop) */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 hidden md:block -z-10 translate-y-[2px]" dir="ltr">
                    <div
                        className="h-full bg-cyan-600 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${(safeIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Progress Line (Mobile) - Vertical */}
                <div className="absolute right-[1.35rem] top-0 w-[2px] h-full bg-slate-100 md:hidden -z-10">
                    <div
                        className="w-full bg-cyan-600 transition-all duration-1000 ease-out rounded-full"
                        style={{ height: `${(safeIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />
                </div>

                {ORDER_STATUSES.map((status, index) => {
                    const isCompleted = index <= safeIndex;
                    const isCurrent = index === safeIndex;

                    return (
                        <div key={status.id} className="group flex md:flex-col items-center gap-6 md:gap-4 w-full md:w-auto mb-10 md:mb-0 relative last:mb-0">
                            {/* Circle Indicator */}
                            <div className={cn(
                                "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 z-10",
                                isCompleted ? "border-transparent bg-cyan-600 text-white" : "border-slate-200 bg-white text-slate-300",
                                isCurrent && "scale-110 ring-4 ring-cyan-50"
                            )}>
                                {isCompleted ? (
                                    <Check className="w-6 h-6 animate-in zoom-in duration-300" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "flex flex-col md:items-center transition-all duration-500",
                                isCompleted ? "opacity-100 translate-x-0" : "opacity-50",
                                isCurrent && "opacity-100"
                            )}>
                                <span className={cn(
                                    "text-base font-bold mb-0.5",
                                    isCurrent ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400"
                                )}>
                                    {status.label}
                                </span>
                                <span className={cn(
                                    "text-xs font-medium uppercase tracking-wider",
                                    isCurrent ? "text-cyan-600" : "text-slate-400"
                                )}>
                                    {status.labelEn}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
