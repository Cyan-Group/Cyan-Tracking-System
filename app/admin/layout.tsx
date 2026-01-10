import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { AuthProvider } from '@/components/providers/auth-provider';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check Role
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await supabaseAdmin.from('profiles').select('full_name, role').eq('id', user.id).single();

    if (!profile || (profile.role !== 'developer' && profile.role !== 'manager')) {
        redirect('/dashboard');
    }

    return (
        <AuthProvider initialSession={null}>
            <div className="flex min-h-screen flex-col bg-gray-50">
                <DashboardHeader user={user} profileName={profile.full_name} userRole={profile.role} />
                <main className="flex-1 container mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
