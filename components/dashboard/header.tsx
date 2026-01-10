'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function DashboardHeader({ user, profileName, userRole }: { user?: any, profileName?: string, userRole?: string }) {
    const { signOut } = useAuth();

    // Fallback to useAuth user if not passed (though server should pass it)
    const displayUser = user;
    const isAdmin = userRole === 'manager' || userRole === 'developer';

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-6 font-semibold text-lg md:text-xl text-primary">
                <Link href="/dashboard">Cyan Tracking</Link>
                {isAdmin && (
                    <Link href="/admin/users" className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors">
                        الموظفين
                    </Link>
                )}
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="p-1 bg-muted rounded-full">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="hidden md:inline-block">{profileName || displayUser?.email || 'User'}</span>
                </div>

                {/* Logout */}
                <Button variant="ghost" size="icon" onClick={signOut} title="تسجيل الخروج">
                    <LogOut className="w-5 h-5 text-destructive" />
                </Button>
            </div>
        </header>
    );
}
