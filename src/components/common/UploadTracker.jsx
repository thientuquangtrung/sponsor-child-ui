import React from 'react';
import { ChevronsDownUp, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { RemoveUpload } from '@/redux/app/appActionCreators';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CircularProgressBar from '@/components/common/CircularProgressBar';
import { useCancelAssetMutation } from '@/redux/asset/assetApi';

const UploadTracker = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const { uploads } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const [cancelUpload] = useCancelAssetMutation();

    const numberOfUploads = Object.keys(uploads).length;

    const handleCancelUpload = (id) => {
        dispatch(RemoveUpload(id));

        cancelUpload({ uploadId: id });
    };

    if (numberOfUploads <= 0) return null;

    return (
        <div
            className={cn('fixed py-4 bottom-4 left-4 z-50 w-80 bg-primary rounded-lg transition-all', {
                'bg-primary/50': !collapsed,
                'px-2': collapsed,
            })}
        >
            <span className="absolute top-4 right-4" onClick={() => setCollapsed(!collapsed)}>
                <ChevronsDownUp className="w-6 h-6 opacity-80" />
            </span>
            {collapsed ? (
                <p>{numberOfUploads} asset(s) are being uploaded...</p>
            ) : (
                <>
                    <p className="px-2 mb-4">All uploading assets</p>
                    <div className="w-full max-h-[300px] space-y-2 overflow-auto [scrollbarGutter:stable_both-edges] bg-transparent">
                        {Object.values(uploads).map((upload) => (
                            <div key={upload.id} className="bg-background w-full rounded-lg p-4 flex items-center">
                                <CircularProgressBar progress={upload.progress} size={50} />
                                <div className="ml-4 flex flex-col">
                                    <p className="text-sm font-medium truncate">{upload.fileName}</p>
                                    <span className="text-xs text-foreground">{upload.totalFiles} files attached</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-auto text-gray-500 hover:text-gray-700"
                                    onClick={() => handleCancelUpload(upload.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UploadTracker;
