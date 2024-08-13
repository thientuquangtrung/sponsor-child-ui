import { useState } from 'react';
const useFileSelection = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const addFiles = (files) => {
        setSelectedFiles((currentSelection) => [...currentSelection, ...files]);
    };

    const removeFiles = (files) => {
        setSelectedFiles((currentSelection) => {
            return currentSelection.filter(file => !files.includes(file));
        });
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        // setError(null);
    };

    return { selectedFiles, addFiles, removeFiles, clearFiles };
};

export default useFileSelection;
