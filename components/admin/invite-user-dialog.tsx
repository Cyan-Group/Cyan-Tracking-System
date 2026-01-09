'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function InviteUserDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const { inviteUserAction } = await import('@/app/actions/admin');
            const result = await inviteUserAction(formData);

            if (result.success) {
                alert('تم إرسال الدعوة بنجاح!');
                setOpen(false);
                router.refresh();
            } else {
                alert(`خطأ: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ غير متوقع');
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    دعوة مستخدم جديد
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>دعوة مستخدم جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">البريد الإلكتروني</label>
                        <Input name="email" type="email" required placeholder="user@cyan.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">الوظيفة / الدور</label>
                        <Select name="role" defaultValue="staff">
                            <SelectTrigger>
                                <SelectValue placeholder="اختر الدور" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">موظف (Staff)</SelectItem>
                                <SelectItem value="manager">مدير (Manager)</SelectItem>
                                <SelectItem value="developer">مطور (Developer)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                            إرسال الدعوة
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
