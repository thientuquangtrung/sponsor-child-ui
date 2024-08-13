import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ButtonLoading({ isLoading, ...props }) {
    if (!isLoading) return <Button {...props} />;
    return (
        <Button disabled {...props}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
        </Button>
    );
}
