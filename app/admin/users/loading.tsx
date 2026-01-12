import { Users } from 'lucide-react';

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إدارة الموظفين</h1>
                        <p className="text-muted-foreground">جاري تحميل البيانات...</p>
                    </div>
                </div>
                {/* Button Skeleton */}
                <div className="h-10 w-32 bg-slate-200 rounded-md animate-pulse"></div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-6 font-medium text-slate-500">الاسم</th>
                            <th className="h-12 px-6 font-medium text-slate-500">الدور</th>
                            <th className="h-12 px-6 font-medium text-slate-500">المعرف (ID)</th>
                            <th className="h-12 px-6 font-medium text-slate-500">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y relative">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                                </td>
                                <td className="p-4">
                                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                </td>
                                <td className="p-4">
                                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
