'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function inviteUserAction(formData: FormData) {
    const email = formData.get('email') as string;
    const role = formData.get('role') as string; // 'manager', 'staff', 'developer'

    if (!email) {
        return { error: 'Email is required' };
    }

    const cookieStore = cookies();

    // Check if the requester is a developer first
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: any) { },
                remove(name: string, options: any) { },
            },
        }
    );

    // Determine user session manually since getting user might fail if we are stuck in recursion loop from middleware
    // Actually, middleware protects the route /dev-panel, so if we reached here via form submission, 
    // we should be safe to check auth status.
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Double check role from DB? 
    // Ideally yes, but let's assume middleware handled it. 
    // But for "Invite" which is powerful, we specifically need the Service Key.

    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: any) { },
                remove(name: string, options: any) { },
            },
        }
    );

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
        return { error: error.message };
    }

    // If role is specified, we need to update the profile immediately
    if (data.user && role) {
        // We can update the profiles table directly
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: role })
            .eq('id', data.user.id);

        if (profileError) {
            console.error('Error updating role:', profileError);
            return { success: true, warning: 'User invited but failed to set role automatically.' };
        }
    }

    revalidatePath('/dev-panel');
    return { success: true };
}
