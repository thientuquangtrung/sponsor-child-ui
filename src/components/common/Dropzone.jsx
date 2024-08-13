import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({ ...props }) {
    
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ ...props });

    return (
        <div
            className={cn(
                'group w-full p-8 flex flex-col justify-center items-center rounded-lg border-dashed border-2 hover:border-primary hover:bg-primary/10 hover:cursor-pointer transition-all',
                isDragActive && 'border-primary bg-primary/10',
                isDragReject && 'border-error bg-destructive/10',
            )}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <CloudUpload
                className={cn({
                    'w-16 h-16 text-muted-foreground group-hover:text-primary transition-all': true,
                    'animate-bounce text-primary': isDragActive,
                    'text-destructive': isDragReject,
                })}
            />
            <p className="text-muted-foreground mt-4">
                Drop files here or <span className="text-primary underline">click to upload</span>
            </p>
        </div>
    );
}
