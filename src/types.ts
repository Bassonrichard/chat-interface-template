export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    attachments: string[];
    timestamp: Date;
    isStreaming: boolean;
}

export interface StreamCallbacks {
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError?: (error: Error) => void;
}

export interface StreamHandle {
    cancel: () => void;
}
