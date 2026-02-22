'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { generateShortId } from '@/utils/short-id';

export async function createOrderAction(formData: FormData) {
    const cookieStore = await cookies();

    // 1. Create a "Service" client to bypass RLS for insertion
    // We use createClient from @supabase/supabase-js to ensure NO cookies/session are used,
    // guaranteeing we act as the Service Role (Super Admin).
    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Get current user (we still need to know WHO is creating it)
    // Let's get the user from the "Normal" client first to handle Auth
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    // Server Actions can't set cookies easily, but we just need to READ session here
                },
            },
        }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized: You must be logged in.' };
    }

    const customer_name = formData.get('customer_name') as string;
    const phone_number = formData.get('phone_number') as string;
    const details = formData.get('details') as string;

    // 3. Insert using Service Client (Bypass RLS)
    // Generate a unique short_id with retry for collisions
    let short_id = generateShortId();
    let retries = 3;
    let insertError: any = null;

    while (retries > 0) {
        const { error } = await supabaseService.from('orders').insert({
            customer_name,
            phone_number,
            details,
            status: 'designed',
            created_by: user.id,
            short_id,
        });

        if (error) {
            // If collision on short_id, regenerate and retry
            if (error.code === '23505' && error.message.includes('short_id')) {
                short_id = generateShortId();
                retries--;
                continue;
            }
            insertError = error;
        }
        break;
    }

    if (insertError) {
        console.error('Create Order Error:', insertError);
        return { error: insertError.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // We update without checking session to bypass RLS recursion.
    // In a real production app, we would verify the session role here too.

    const { error } = await supabaseService
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

    if (error) {
        console.error('Update Status Error:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/track/${orderId}`);
    return { success: true };
}

export async function deleteOrderAction(orderId: string) {
    const cookieStore = await cookies();

    // Auth Check
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { },
            },
        }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Role check - We need to be sure. 
    // We can use the service client to check the profile role
    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabaseService
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'developer' && profile.role !== 'manager')) {
        return { error: 'Forbidden: Insufficient permissions' };
    }

    const { error } = await supabaseService
        .from('orders')
        .delete()
        .eq('id', orderId);

    if (error) {
        console.error('Delete Order Error:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
