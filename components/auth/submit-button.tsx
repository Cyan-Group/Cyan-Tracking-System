'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SubmitButton({
    children,
    ...props
}: React.ComponentProps<typeof Button> & { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <Button {...props} disabled={pending || props.disabled}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}
