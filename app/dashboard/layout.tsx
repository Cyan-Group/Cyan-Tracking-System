import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { AuthProvider } from '@/components/providers/auth-provider';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Use Service Role to ensure we can read the profile/role ignoring RLS specific policies
    const supabaseAdmin = createAdminClient();

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

    // Log for debugging
    console.log('Dashboard Layout Profile Fetch:', { uid: user.id, role: profile?.role });

    return (
        <AuthProvider initialUser={user}>
            {/* We can add a common Sidebar or Header here */}
            <div className="flex min-h-screen flex-col bg-gray-100/50">
                <DashboardHeader user={user} profileName={profile?.full_name} userRole={profile?.role} />
                <main className="flex-1 container mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
