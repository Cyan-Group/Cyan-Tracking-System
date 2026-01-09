import { createClient } from '@/utils/supabase/server';
import { StatusStepper } from '@/components/orders/status-stepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Phone, User, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

// Mock Card since we can't install shadcn/ui cli yet
function DetailCard({ title, value, icon }: { title: string, value: string, icon: any }) {
    return (
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    )
}

export default async function TrackOrderPage({ params }: { params: { orderId: string } }) {
    const supabase = createClient();

    // Basic validation for UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.orderId)) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-destructive">رقم الطلب غير صحيح</h1>
                    <p className="text-muted-foreground">تأكد من الرابط وحاول مرة أخرى</p>
                </div>
            </div>
        )
    }

    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.orderId)
        .single();

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-destructive">الطلب غير موجود</h1>
                    <p className="text-muted-foreground">لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من الرابط.</p>
                </div>
            </div>
        )
    }

    const lastUpdated = new Date(order.updated_at || order.created_at).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <main className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">تتبع حالة الطلب</h1>
                    <p className="text-muted-foreground">رقم الطلب: <span className="font-mono">{order.id}</span></p>
                </div>

                {/* Stepper */}
                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 mb-8">
                    <StatusStepper currentStatus={order.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailCard
                        title="العميل"
                        value={order.customer_name}
                        icon={<User className="w-6 h-6" />}
                    />
                    <DetailCard
                        title="آخر تحديث"
                        value={lastUpdated}
                        icon={<Clock className="w-6 h-6" />}
                    />
                    <DetailCard
                        title="تفاصيل الطلب"
                        value={order.details || 'لا توجد تفاصيل إضافية'}
                        icon={<Package className="w-6 h-6" />}
                    />
                    {/* We might hide phone number for privacy if the link is shared publicly, but requested in schema */}
                    {/* <DetailCard title="رقم الهاتف" value={order.phone_number} icon={<Phone className="w-6 h-6" />} /> */}
                </div>

                <div className="text-center mt-12 pt-8 border-t">
                    <p className="text-sm text-muted-foreground">© 2024 Cyan Printing System</p>
                </div>
            </div>
        </main>
    );
}
