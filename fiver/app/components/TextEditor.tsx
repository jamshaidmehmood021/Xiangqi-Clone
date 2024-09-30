'use client';
import { useCallback, useEffect, useRef, useState, RefObject } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ReactQuillProps } from "react-quill";
import type ReactQuill from "react-quill";

const ReactQuillComponent = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');

        const Component = ({ forwardedRef, ...props }: { forwardedRef: RefObject<ReactQuill> } & ReactQuillProps) => (
            <RQ ref={forwardedRef} {...props} />
        );

        Component.displayName = 'ReactQuillComponent';
        return Component;
    },
    {
        ssr: false,
    }
);

type EditorType = "Gig";
type SuggestionPosition = { start: number; end: number };

const TextEditor = ({
    value,
    setValue,
    placeholder,
    type,
    ...props
}: {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    type: EditorType;
}) => {
    const quillRef = useRef<ReactQuill | null>(null);
    const suggestionTimeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSuggesting = useRef(false);
    const suggestionPosition = useRef<SuggestionPosition>({ start: 0, end: 0 });
    const [suggestion, setSuggestion] = useState("");

    const handleChange = (value: string) => {
        setValue(value);
    };

    const resetSuggestionPosition = () => {
        suggestionPosition.current = { start: 0, end: 0 };
    };

    const getQuillEditor = () => {
        return quillRef.current?.getEditor() || null;
    };

    const isCursorAtEnd = useCallback(() => {
        const quill = getQuillEditor();
        if (!quill) return false;

        const selection = quill.getSelection();
        if (selection) {
            const cursorPosition = selection.index;
            const textLength = quill.getText().length - 1;
            return cursorPosition >= textLength;
        }
        return false;
    }, []);

    const clearSuggestionText = useCallback(() => {
        const quill = getQuillEditor();
        if (isSuggesting.current && quill) {
            quill.deleteText(suggestionPosition.current.start, suggestionPosition.current.end);
        }
    }, []);

    const handleTab = useCallback((event: KeyboardEvent) => {
        const quill = getQuillEditor();
        if (event.key !== "Tab" || !quill) return;
        event.preventDefault();

        const selection = quill.getSelection();
        if (!isSuggesting.current || !selection) return;

        quill.insertText(selection.index, suggestion, "api");
        quill.setSelection(quill.getLength(), 0);

        resetSuggestionPosition();
    }, [suggestion]);

    const getAiSuggestion = useCallback(async (currentDescription: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
    
            const response: any = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/suggestions?description=${currentDescription}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setSuggestion(data.suggestion);
        } catch (e: any) {
            console.log("Failed to get suggestion", e);
        }
    }, []);
    

    const updateSuggestion = useCallback(
        (quill: any, source: string) => {
            if (source === "api") return;
            clearSuggestionText();
    
            if (suggestionTimeOutRef.current) clearTimeout(suggestionTimeOutRef.current);
            suggestionTimeOutRef.current = setTimeout(async () => {
                await getAiSuggestion(quill.getText(0, quill.getLength()));
            }, 3000);
        },
        [clearSuggestionText, getAiSuggestion]
    );
    

    useEffect(() => {
        const quill = getQuillEditor();
        if (!suggestion || !quill) return;

        const selection = quill.getSelection();
        if (selection && isCursorAtEnd()) {
            const cursorPosition = selection.index;
            isSuggesting.current = true;

            clearSuggestionText();

            suggestionPosition.current = {
                start: cursorPosition,
                end: cursorPosition + 1 + suggestion.length,
            };

            quill.insertText(cursorPosition, suggestion, {
                color: "rgba(0,0,0,0.3)",
                "user-select": "none",
            });

            quill.setSelection(cursorPosition, 0);
        }
    }, [clearSuggestionText, isCursorAtEnd, suggestion]);

    useEffect(() => {
        const quill = getQuillEditor();
        if (!quill || type !== "Gig") return;

        const handleTextChange = (_: any, __: any, source: any) => {
            updateSuggestion(quill, source);
        };

        const handleSelectionChange = (_: any, __: any, source: any) => {
            if (source === "user") {
                clearSuggestionText();
                isSuggesting.current = false;
                resetSuggestionPosition();
            }
        };

        quill.on("text-change", handleTextChange); 
        quill.on("selection-change", handleSelectionChange);

        const tabListener = (e: KeyboardEvent) => handleTab(e);
        window.addEventListener("keydown", tabListener);

        return () => {
            quill.off("text-change", handleTextChange);
            quill.off("selection-change", handleSelectionChange);
            window.removeEventListener("keydown", tabListener);
        };
    }, [clearSuggestionText, handleTab, suggestion, type, updateSuggestion]);

    return (
        <div className="w-full">
            <ReactQuillComponent
                forwardedRef={quillRef}
                theme="snow"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full h-64 pb-11 bg-white"
                style={{ color: 'black' }}
                {...props}
            />
        </div>
    );
};

ReactQuillComponent.displayName = 'ReactQuillComponent';

export default TextEditor;
