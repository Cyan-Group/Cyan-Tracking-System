import { createClient } from '@/utils/supabase/server';
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

    // We can also fetch the profile role here if we want to pass it down or verify it again,
    // but Middleware already checked basic auth.

    return (
        <AuthProvider initialUser={user}>
            {/* We can add a common Sidebar or Header here */}
            <div className="flex min-h-screen flex-col bg-gray-100/50">
                <DashboardHeader />
                <main className="flex-1 container mx-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
