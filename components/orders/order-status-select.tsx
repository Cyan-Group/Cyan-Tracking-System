'use client';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUSES } from '@/components/orders/status-stepper';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast'; // We might need to make a toast hook or just alert
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleValueChange = async (value: string) => {
        setLoading(true);

        try {
            const { updateOrderStatusAction } = await import('@/app/actions/orders');
            const result = await updateOrderStatusAction(orderId, value);

            if (result.error) {
                console.error(result.error);
                alert(`فشل تحديث الحالة: ${result.error}`);
            } else {
                // Router refresh is handled in the server action, but doing it here helps instant feedback feeling
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ غير متوقع');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            <Select defaultValue={currentStatus} onValueChange={handleValueChange} disabled={loading}>
                <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {ORDER_STATUSES.map(status => (
                        <SelectItem key={status.id} value={status.id}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
