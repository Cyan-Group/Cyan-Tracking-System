import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { UserRow } from '@/components/admin/user-row';
import { InviteUserDialog } from '@/components/admin/invite-user-dialog';

export default async function DevPanelPage() {

    // Use Service Key to bypass RLS recursion issues
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('role');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">إدارة النظام</h1>
                <InviteUserDialog />
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 font-medium text-muted-foreground">الاسم</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">الدور</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">المعرف (ID)</th>
                            <th className="h-12 px-4 font-medium text-muted-foreground">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y relative">
                        {profiles?.map((profile) => (
                            <UserRow key={profile.id} profile={profile} />
                        ))}
                        {!profiles?.length && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">لا يوجد مستخدمين</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
