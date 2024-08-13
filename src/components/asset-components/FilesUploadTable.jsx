import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { humanFileSize } from '@/lib/utils';
import { Trash } from 'lucide-react';

const fallbackComponent = <p className="text-muted-foreground italic text-center">No files uploaded</p>;

export default function FilesUploadTable({ files = [], removeFiles, fallback = fallbackComponent }) {
    const removeFile = (file) => {
        removeFiles([file]);
    };

    if (!files.length) {
        return fallback;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Files</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Remove</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files.map((file) => (
                    <TableRow key={file.name}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{humanFileSize(file.size)}</TableCell>
                        <TableCell className="flex">
                            <Trash
                                onClick={() => removeFile(file)}
                                className="ml-auto text-muted-foreground hover:cursor-pointer hover:text-destructive"
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
