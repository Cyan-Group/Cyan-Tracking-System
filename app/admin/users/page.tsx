import { createAdminClient } from '@/utils/supabase/admin';
import { InviteUserDialog } from '@/components/admin/invite-user-dialog';
import { UserRow } from '@/components/admin/user-row';
import { Users } from 'lucide-react';

export default async function EmployeesPage() {
    // Use Service Key to bypass potential RLS issues just in case, though managers should have read access.
    // Using Service Key ensures we see ALL users even if RLS is tricky.
    const supabase = createAdminClient();

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to load profiles:', error);
        return (
            <div className="space-y-6">
                <div className="rounded-xl border bg-white shadow-sm p-8 text-center text-red-600">
                    حدث خطأ أثناء تحميل بيانات الموظفين. يرجى المحاولة مرة أخرى لاحقاً.
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إدارة الموظفين</h1>
                        <p className="text-muted-foreground">إدارة صلاحيات المستخدمين وإضافة موظفين جدد</p>
                    </div>
                </div>
                <InviteUserDialog />
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-6 font-medium text-slate-500">الاسم</th>
                            <th className="h-12 px-6 font-medium text-slate-500">الدور</th>
                            <th className="h-12 px-6 font-medium text-slate-500">المعرف (ID)</th>
                            <th className="h-12 px-6 font-medium text-slate-500">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y relative">
                        {profiles?.map((profile) => (
                            <UserRow key={profile.id} profile={profile} />
                        ))}
                        {!profiles?.length && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">لا يوجد موظفين حالياً</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
