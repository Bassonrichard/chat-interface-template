import { useState, useCallback, useRef } from 'react';
import { streamResponse } from '../services/streamService';
import type { ChatMessage, StreamHandle } from '../types';

/**
 * Generates a unique ID for messages.
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (text: string, attachments?: string[]) => void;
    clearChat: () => void;
    isStreaming: boolean;
}

/**
 * Custom hook for chat state management.
 */
export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const activeStreamRef = useRef<StreamHandle | null>(null);

    const sendMessage = useCallback((text: string, attachments: string[] = []) => {
        if (!text.trim() && attachments.length === 0) return;

        // 1. Add user message
        const userMessage: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: text.trim(),
            attachments,
            timestamp: new Date(),
            isStreaming: false,
        };

        // 2. Create placeholder assistant message
        const assistantId = generateId();
        const assistantMessage: ChatMessage = {
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
