import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { OrdersTable } from '@/components/orders/orders-table';
import { NewOrderDialog } from '@/components/orders/new-order-dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || '';

    // Use direct Supabase Client with Service Key to ensure ADMIN access (Bypass RLS)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    // Basic query
    let dbQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    // If search exists
    if (query) {
        dbQuery = dbQuery.or(`customer_name.ilike.%${query}%,phone_number.ilike.%${query}%,short_id.ilike.%${query}%`);
    }

    const { data: orders, error } = await dbQuery;

    if (error) {
        console.error('Dashboard Fetch Error:', error);
    } else {
        console.log('Dashboard Orders Fetched:', orders?.length);
    }

    // Auth Check: Use the Cookie-based client to identify the user
    // We cannot use the 'supabase' service client above for auth.getUser() because it has no cookies.
    const { createClient: createAuthClient } = await import('@/utils/supabase/server');
    const supabaseAuth = await createAuthClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    let userRole = null;

    if (user) {
        // Use the Service Client (already defined as 'supabase') to fetch the role bypassing RLS
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        userRole = profile?.role;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">الطلبات</h1>
                    <p className="text-muted-foreground">إدارة ومتابعة طلبات الطباعة</p>
                </div>
                <div className="flex items-center gap-2">
                    <NewOrderDialog />
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                    {/* 
                We would normally use a Client Component for search input that pushes to URL router.
                For now, I'll put a simple placeholder explaining this or just a standard input 
                that doesn't actually filter without client-side logic wrapper.
                Let's use a server form for simplicity or just the UI.
            */}
                    <form action="/dashboard">
                        <Input
                            name="query"
                            type="search"
                            placeholder="بحث باسم العميل أو رقم الهاتف..."
                            className="w-full pr-9 bg-white"
                            defaultValue={query}
                        />
                    </form>
                </div>
            </div>

            <OrdersTable orders={orders || []} userRole={userRole || undefined} />
        </div>
    );
}
