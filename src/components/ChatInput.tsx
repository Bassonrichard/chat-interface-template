import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Platform,
    type NativeSyntheticEvent,
    type TextInputContentSizeChangeEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../theme';

const MAX_INPUT_LINES = 5;
const INPUT_LINE_HEIGHT = 22;
const MIN_INPUT_HEIGHT = 44;

interface ChatInputProps {
    onSend: (text: string, attachments: string[]) => void;
    onAttachPress: () => void;
    isStreaming: boolean;
    attachments?: string[];
    onRemoveAttachment?: (index: number) => void;
}

/**
 * Bottom chat input bar.
 *
 * Features:
 * - Multi-line auto-growing text input
 * - Send button (arrow)
 * - Attach button (+) opens AttachmentModal
 * - Thumbnail previews for attached images
 */
export default function ChatInput({
    onSend,
    onAttachPress,
    isStreaming,
    attachments = [],
    onRemoveAttachment,
}: ChatInputProps) {
    const [text, setText] = useState('');
    const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
    const inputRef = useRef<TextInput>(null);

    const canSend = (text.trim().length > 0 || attachments.length > 0) && !isStreaming;

    const handleSend = useCallback(() => {
        if (!canSend) return;
        onSend(text, attachments);
        setText('');
        setInputHeight(MIN_INPUT_HEIGHT);
    }, [text, attachments, canSend, onSend]);

    const handleContentSizeChange = useCallback(
        (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
            const contentHeight = e.nativeEvent.contentSize.height;
            const maxHeight = INPUT_LINE_HEIGHT * MAX_INPUT_LINES + 22; // padding
            setInputHeight(Math.min(Math.max(MIN_INPUT_HEIGHT, contentHeight), maxHeight));
        },
        []
    );

    return (
        <View style={styles.container}>
            {/* Attachment previews */}
            {attachments.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.attachmentPreviewRow}
                    contentContainerStyle={styles.attachmentPreviewContent}
                >
                    {attachments.map((uri, idx) => (
                        <View key={idx} style={styles.attachmentPreview}>
                            <Image
                                source={{ uri }}
                                style={styles.attachmentThumb}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.removeAttachment}
                                onPress={() => onRemoveAttachment?.(idx)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="close-circle" size={18} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Input row */}
            <View style={styles.inputRow}>
                {/* Attach button */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onAttachPress}
                    disabled={isStreaming}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={26}
                        color={isStreaming ? colors.textMuted : colors.accent}
                    />
                </TouchableOpacity>

                {/* Text input */}
                <View style={[styles.inputWrapper, { height: Math.max(MIN_INPUT_HEIGHT, inputHeight) }]}>
                    <TextInput
                        ref={inputRef}
                        style={[styles.textInput, { height: Math.max(MIN_INPUT_HEIGHT, inputHeight) }]}
                        value={text}
                        onChangeText={setText}
                        placeholder="Message..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        autoFocus
                        onContentSizeChange={handleContentSizeChange}
                        textAlignVertical="center"
                        returnKeyType={Platform.OS === 'ios' ? 'default' : 'send'}
                        blurOnSubmit={false}
                        editable={!isStreaming}
                    />
                </View>

                {/* Send button */}

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!canSend}
                >
                    <Ionicons
                        name="arrow-up"
                        size={20}
                        color={canSend ? '#FFFFFF' : colors.textMuted}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
    },
    attachmentPreviewRow: {
        marginBottom: spacing.sm,
    },
    attachmentPreviewContent: {
        gap: spacing.sm,
    },
    attachmentPreview: {
        position: 'relative',
    },
    attachmentThumb: {
        width: 64,
        height: 64,
        borderRadius: radii.sm,
    },
    removeAttachment: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: colors.background,
        borderRadius: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    iconButton: {
        paddingBottom: 10,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: colors.inputBg,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
    },
    textInput: {
        color: colors.textPrimary,
        fontSize: 16,
        paddingHorizontal: spacing.lg,
        paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
        lineHeight: INPUT_LINE_HEIGHT,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    sendButtonActive: {
        backgroundColor: colors.accent,
    },
    sendButtonDisabled: {
        backgroundColor: colors.surface,
    },
});
