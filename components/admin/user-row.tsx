'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserRow({ profile }: { profile: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState(profile.role);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', profile.id);

        if (error) {
            alert('Failed to update role');
            console.error(error);
        } else {
            setIsEditing(false);
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <tr className="hover:bg-gray-50 bg-white border-b">
            <td className="p-4 font-medium">{profile.full_name || profile.email || 'بدون اسم'}</td>
            <td className="p-4">
                {isEditing ? (
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="staff">موظف (Staff)</SelectItem>
                            <SelectItem value="manager">مدير (Manager)</SelectItem>
                            <SelectItem value="developer">مطور (Dev)</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <span className={`
                    px-2 py-1 rounded-full text-xs font-medium 
                    ${profile.role === 'developer' ? 'bg-purple-100 text-purple-700' :
                            profile.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'}
                `}>
                        {profile.role === 'developer' ? 'مطور' :
                            profile.role === 'manager' ? 'مدير' : 'موظف'}
                    </span>
                )}
            </td>
            <td className="p-4 text-muted-foreground text-xs font-mono">
                {profile.id.slice(0, 8)}...
            </td>
            <td className="p-4">
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSave} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setIsEditing(false)} disabled={loading}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>تعديل</Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="حذف المستخدم"
                            onClick={async () => {
                                if (confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
                                    setLoading(true);
                                    try {
                                        const { deleteUserAction } = await import('@/app/actions/admin');
                                        const res = await deleteUserAction(profile.id);
                                        if (res.error) {
                                            alert(res.error);
                                        } else {
                                            alert('تم حذف المستخدم بنجاح');
                                            router.refresh();
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert('حدث خطأ أثناء الحذف');
                                    }
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    );
}
