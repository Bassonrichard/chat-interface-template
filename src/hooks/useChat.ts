import { useState, useCallback, useRef } from 'react';
import { streamResponse } from '../services/streamService';

/**
 * Generates a unique ID for messages.
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Custom hook for chat state management.
 *
 * Returns:
 *   messages       - array of message objects
 *   sendMessage    - (text, attachments?) => void
 *   clearChat      - () => void
 *   isStreaming     - boolean, true while assistant is responding
 */
export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const activeStreamRef = useRef(null);

    const sendMessage = useCallback((text, attachments = []) => {
        if (!text.trim() && attachments.length === 0) return;

        // 1. Add user message
        const userMessage = {
            id: generateId(),
            role: 'user',
            content: text.trim(),
            attachments,
            timestamp: new Date(),
            isStreaming: false,
        };

        // 2. Create placeholder assistant message
        const assistantId = generateId();
        const assistantMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            attachments: [],
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setIsStreaming(true);

        // 3. Start streaming the mock response
        const stream = streamResponse(text.trim(), {
            onChunk: (chunk) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            },
            onComplete: () => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId ? { ...msg, isStreaming: false } : msg
                    )
                );
                setIsStreaming(false);
                activeStreamRef.current = null;
            },
            onError: (err) => {
                console.error('Stream error:', err);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantId
                            ? {
                                ...msg,
                                content: msg.content + '\n\n*[Stream error occurred]*',
                                isStreaming: false,
                            }
                            : msg
                    )
                );
                setIsStreaming(false);
                activeStreamRef.current = null;
            },
        });

        activeStreamRef.current = stream;
    }, []);

    const clearChat = useCallback(() => {
        // Cancel any active stream
        activeStreamRef.current?.cancel();
        activeStreamRef.current = null;
        setMessages([]);
        setIsStreaming(false);
    }, []);

    return { messages, sendMessage, clearChat, isStreaming };
}
