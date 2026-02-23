import { createClient } from '@supabase/supabase-js';
import { StatusStepper } from '@/components/orders/status-stepper';
import { Package, Clock, User } from 'lucide-react';

function DetailCard({ title, value, icon, className, delay = 0 }: { title: string, value: string, icon: any, className?: string, delay?: number }) {
    return (
        <div
            className={`group bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-5 ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                {icon}
            </div>
            <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
            </div>
        </div>
    )
}

export default async function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    // Use Service Role to allow fetching order without RLS (public specific access)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validate: short_id is alphanumeric, max 10 chars
    const shortIdRegex = /^[A-Z0-9]{1,10}$/i;
    if (!shortIdRegex.test(orderId)) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">رقم الطلب غير صحيح</h1>
                    <p className="text-slate-500">تأكد من الرابط وحاول مرة أخرى</p>
                </div>
            </div>
        )
    }

    // Look up by short_id
    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('short_id', orderId.toUpperCase())
        .single();

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">الطلب غير موجود</h1>
                    <p className="text-slate-500">لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من الرابط.</p>
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
        <main className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 py-8 md:py-12">
                {/* Header */}
                <div className="text-center space-y-5 animate-in slide-in-from-top-4 fade-in duration-700">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
                        <span className="text-sm font-medium text-slate-700">
                            نظام تتبع الطلبات
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        تتبع حالة الطلب
                    </h1>
                    <p className="text-slate-500 font-medium text-lg flex items-center justify-center gap-2" dir="rtl">
                        رقم الطلب: <span className="font-mono bg-white border border-slate-200 px-3 py-1 rounded-md text-slate-700 text-base">{order.short_id}</span>
                    </p>
                </div>

                {/* Status Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-100">
                    <StatusStepper currentStatus={order.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                    <DetailCard
                        title="العميل"
                        value={order.customer_name}
                        icon={<User className="w-5 h-5" />}
                        className="animate-in slide-in-from-left-4 fade-in duration-700 delay-300"
                    />
                    <DetailCard
                        title="آخر تحديث"
                        value={lastUpdated}
                        icon={<Clock className="w-5 h-5" />}
                        className="animate-in slide-in-from-right-4 fade-in duration-700 delay-300"
                    />
                    <DetailCard
                        title="تفاصيل الطلب"
                        value={order.details || 'لا توجد تفاصيل إضافية'}
                        icon={<Package className="w-5 h-5" />}
                        className="md:col-span-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-400"
                    />
                </div>

                <div className="text-center mt-16 pt-8 border-t border-slate-200 animate-in fade-in duration-1000 delay-500">
                    <p className="text-sm font-medium text-slate-400">© 2026 Cyan Printing System</p>
                </div>
            </div>
        </main>
    );
}
