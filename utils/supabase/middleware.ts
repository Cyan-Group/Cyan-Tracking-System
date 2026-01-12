import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from './admin'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Public Routes can be accessed by anyone
    // Login page
    if (path.startsWith('/login') || path === '/' || path.startsWith('/track') || path.startsWith('/auth')) {
        return response
    }

    // Protected Routes
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role based protection
    if (path.startsWith('/dev-panel') || path.startsWith('/admin')) {
        // Use Admin Client to bypass RLS policies for role check
        const supabaseAdmin = createAdminClient();
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'developer' && profile?.role !== 'manager') {
            // Redirect to dashboard or 403
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}
