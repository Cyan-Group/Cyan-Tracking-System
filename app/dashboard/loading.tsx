export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-9 w-48 bg-slate-200 rounded-md animate-pulse"></div>
                    <div className="h-5 w-64 bg-slate-100 rounded-md animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-10 w-32 bg-slate-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <div className="h-10 w-full bg-slate-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-8 w-8 bg-slate-200 rounded-md animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
