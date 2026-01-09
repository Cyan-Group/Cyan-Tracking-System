'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NewOrderDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const { createOrderAction } = await import('@/app/actions/orders');
            const result = await createOrderAction(formData);

            if (result.success) {
                setOpen(false);
                router.refresh();
            } else {
                alert(`حدث خطأ: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred');
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    طلب جديد
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>إضافة طلب جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">اسم العميل</label>
                        <Input name="customer_name" required placeholder="مثال: شركة النور" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">رقم الهاتف</label>
                        <Input name="phone_number" required type="tel" placeholder="01xxxxxxxxx" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">تفاصيل الطلب</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            name="details"
                            required
                            placeholder="الكمية، المقاس، الخ."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                            إضافة
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
