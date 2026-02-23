'use client';

import { OrderStatusSelect } from './order-status-select';
import { DeleteOrderDialog } from './delete-order-dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function OrdersTable({ orders: initialOrders, userRole }: { orders: any[], userRole?: string }) {
    const [orders, setOrders] = useState<any[]>(initialOrders);
    const supabase = createClient();

    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        const channel = supabase
            .channel('realtime-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Change received!', payload);
                    if (payload.eventType === 'INSERT') {
                        setOrders((prev) => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((prev) => prev.map((order) => order.id === payload.new.id ? payload.new : order));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase]);

    if (orders.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-white">
                <p className="text-muted-foreground">لا توجد طلبات حالياً</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 font-medium text-muted-foreground w-[100px]">رقم الطلب</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">العميل</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground hidden md:table-cell">التفاصيل</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">التاريخ</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">الحالة</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order) => {
                            const trackingLink = `${origin}/track/${order.short_id || order.id}`;
                            const waLink = `https://wa.me/${order.phone_number}?text=${encodeURIComponent(`مرحباً ${order.customer_name}،\nيمكنك تتبع حالة طلبك لدى Cyan Printing System من خلال الرابط التالي:\n${trackingLink}`)}`;

                            return (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-muted-foreground">
                                        {order.short_id || order.id.slice(0, 8)}
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div>{order.customer_name}</div>
                                        <div className="text-xs text-muted-foreground md:hidden">{order.phone_number}</div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell max-w-[200px] truncate" title={order.details}>
                                        {order.details}
                                    </td>
                                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="p-4">
                                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {(userRole === 'manager' || userRole === 'developer') && (
                                                <DeleteOrderDialog orderId={order.id} />
                                            )}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" asChild title="إرسال واتساب">
                                                <a href={waLink} target="_blank" rel="noopener noreferrer">
                                                    <MessageCircle className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild title="فتح صفحة التتبع">
                                                <Link href={`/track/${order.short_id || order.id}`} target="_blank">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
