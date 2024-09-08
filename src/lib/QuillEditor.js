import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ]
                }
            });

            quillRef.current.on('text-change', () => {
                const content = quillRef.current.root.innerHTML;
                onChange(content);
            });
        }

        if (quillRef.current && value !== undefined) {
            if (value !== quillRef.current.root.innerHTML) {
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value, onChange]);

    return <div ref={editorRef} />;
};

export default QuillEditor;