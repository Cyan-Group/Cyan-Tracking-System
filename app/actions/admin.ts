'use server';

import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/utils/supabase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function inviteUserAction(formData: FormData) {
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    const cookieStore = await cookies();

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

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
        return { error: error.message };
    }

    if (data.user && role) {
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

export async function deleteUserAction(userId: string) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return { error: 'Invalid user ID: ID cannot be empty' };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        return { error: 'Invalid user ID: ID must be a valid UUID format' };
    }

    const cookieStore = await cookies();

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

    const supabaseAdmin = createAdminClient();

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.role !== 'developer' && profile.role !== 'manager')) {
        return { error: 'Forbidden: Insufficient permissions' };
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
        console.error('Delete User Error:', deleteError);
        return { error: deleteError.message };
    }

    revalidatePath('/admin/users');
    revalidatePath('/dev-panel');
    return { success: true };
}
