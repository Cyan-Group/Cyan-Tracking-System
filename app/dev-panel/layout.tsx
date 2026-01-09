import { createClient } from '@/utils/supabase/server';
import { AuthProvider } from '@/components/providers/auth-provider';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';

export default async function DevPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Double check role server-side
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (profile?.role !== 'developer') {
        redirect('/dashboard');
    }

    return (
        <AuthProvider initialSession={null}>
            <div className="flex min-h-screen flex-col bg-gray-100/50">
                <DashboardHeader />
                <div className="bg-red-900 text-white text-center py-1 text-xs font-bold">
                    DEVELOPER MODE
                </div>
                <main className="flex-1 container mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
