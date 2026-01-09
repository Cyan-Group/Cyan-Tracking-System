'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children, initialSession, initialUser }: { children: React.ReactNode, initialSession?: Session | null, initialUser?: User | null }) {
    const [user, setUser] = useState<User | null>(initialSession?.user ?? initialUser ?? null);
    const [session, setSession] = useState<Session | null>(initialSession || null);
    const [isLoading, setIsLoading] = useState(!initialSession && !initialUser);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);

            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
