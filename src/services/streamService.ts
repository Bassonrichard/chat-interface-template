/**
 * Mock SSE streaming service.
 *
 * Pipeline:
 *   1. Receive user text
 *   2. Format into a rich markdown echo response
 *   3. Split into small chunks (word-by-word)
 *   4. Emit chunks at intervals via onChunk callback
 *   5. Call onComplete when done
 *
 * To swap with a real SSE backend later, replace this file
 * with an EventSource-based implementation that calls the
 * same onChunk / onComplete callbacks.
 */

const CHUNK_DELAY_MS = 30;

/**
 * Generates a rich markdown response that echoes the user's message.
 */
function formatEchoResponse(userText) {
    return `## Echo Response

I received your message:

> ${userText}

Here's a **formatted** version of what you said, with some extras:

- **Original message**: ${userText}
- **Character count**: ${userText.length}
- **Word count**: ${userText.split(/\s+/).filter(Boolean).length}

### Code Example

\`\`\`javascript
const message = "${userText.replace(/"/g, '\\"')}";
console.log(message);
\`\`\`

---

*This is a mock response. Connect a real SSE endpoint to get actual AI responses.*`;
}

/**
 * Splits text into word-level chunks, preserving whitespace and newlines.
 */
function chunkify(text) {
    const chunks = [];
    let current = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        current += char;

        // Emit on space, newline, or when we have a decent-sized chunk
        if (char === ' ' || char === '\n' || current.length >= 8) {
            chunks.push(current);
            current = '';
        }
    }

    if (current) {
        chunks.push(current);
    }

    return chunks;
}

/**
 * Streams a mock response for the given user message.
 *
 * @param {string} userText - The user's message text
 * @param {object} callbacks
 * @param {(chunk: string) => void} callbacks.onChunk - Called for each text chunk
 * @param {() => void} callbacks.onComplete - Called when streaming is done
 * @param {(error: Error) => void} [callbacks.onError] - Called on error
 * @returns {{ cancel: () => void }} - Call cancel() to abort the stream
 */
export function streamResponse(userText, { onChunk, onComplete, onError }) {
    const formatted = formatEchoResponse(userText);
    const chunks = chunkify(formatted);

    let index = 0;
    let cancelled = false;

    function emitNext() {
        if (cancelled) return;

        if (index < chunks.length) {
            try {
                onChunk(chunks[index]);
                index++;
                setTimeout(emitNext, CHUNK_DELAY_MS);
            } catch (err) {
                onError?.(err);
            }
        } else {
            onComplete();
        }
    }

    // Small initial delay to simulate network latency
    const startTimeout = setTimeout(emitNext, 400);

    return {
        cancel: () => {
            cancelled = true;
            clearTimeout(startTimeout);
        },
    };
}
