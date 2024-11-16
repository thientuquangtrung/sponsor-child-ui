'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef((props, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            {...props}
            align={props.align || 'center'}
            sideOffset={props.sideOffset || 4}
            className={cn(
                'z-50 w-[600px] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
                'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                props.className,
            )}
        />
    </PopoverPrimitive.Portal>
));


PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
