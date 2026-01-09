'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function DashboardHeader() {
    const { user, signOut } = useAuth();
    const [profileName, setProfileName] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const supabase = createClient();
            const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
            if (data) setProfileName(data.full_name || user.email);
        }
        fetchProfile();
    }, [user]);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-lg md:text-xl text-primary">
                <Link href="/dashboard">Cyan Tracking</Link>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="p-1 bg-muted rounded-full">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="hidden md:inline-block">{profileName || 'Loading...'}</span>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="icon" onClick={signOut} title="تسجيل الخروج">
                    <LogOut className="w-5 h-5 text-destructive" />
                </Button>
            </div>
        </header>
    );
}
