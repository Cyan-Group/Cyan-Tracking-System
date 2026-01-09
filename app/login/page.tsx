import { login, signup } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-primary">تسجيل الدخول</h1>
                    <p className="text-muted-foreground">نظام متابعة طلبات الطباعة - Cyan</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                            البريد الإلكتروني
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="text-left"
                            dir="ltr"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">
                            كلمة المرور
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="text-left"
                            dir="ltr"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Button formAction={login} className="w-full">
                            دخول
                        </Button>
                        {/* 
                <Button formAction={signup} variant="outline" className="w-full">
                    إنشاء حساب جديد
                </Button> 
                */}
                    </div>

                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-red-50 text-red-600 text-center rounded-md text-sm">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
