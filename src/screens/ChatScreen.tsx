import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radii } from '../theme';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';
import AssistantMessage from '../components/AssistantMessage';
import ChatInput from '../components/ChatInput';
import AttachmentModal from '../components/AttachmentModal';

/**
 * Main chat screen.
 *
 * Features:
 * - SafeAreaView for notch/status bar safety
 * - KeyboardAvoidingView for keyboard handling
 * - Inverted FlatList for auto-scroll to bottom
 * - Header with title + new chat button
 * - Bottom input with attachment support
 */
export default function ChatScreen() {
    const { messages, sendMessage, clearChat, isStreaming } = useChat();
    const [attachments, setAttachments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const flatListRef = useRef(null);

    // Reverse messages for inverted FlatList (newest at bottom)
    const reversedMessages = [...messages].reverse();

    const handleSend = useCallback(
        (text, currentAttachments) => {
            sendMessage(text, currentAttachments);
            setAttachments([]);
        },
        [sendMessage]
    );

    const handleClear = useCallback(() => {
        clearChat();
        setAttachments([]);
    }, [clearChat]);

    const handleAttach = useCallback((uri) => {
        setAttachments((prev) => [...prev, uri]);
    }, []);

    const handleRemoveAttachment = useCallback((index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const renderMessage = useCallback(({ item }) => {
        if (item.role === 'user') {
            return <ChatBubble message={item} />;
        }
        return <AssistantMessage message={item} />;
    }, []);

    const renderEmpty = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Start a conversation</Text>
                <Text style={styles.emptySubtitle}>
                    Send a message to begin chatting
                </Text>
            </View>
        ),
        []
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="sparkles" size={22} color={colors.accent} />
                    <Text style={styles.headerTitle}>Chat</Text>
                </View>
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.headerButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="create-outline" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Chat area */}
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={reversedMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    inverted
                    contentContainerStyle={[
                        styles.messagesContent,
                        messages.length === 0 && styles.emptyContent,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={renderEmpty}
                />

                {/* Input */}
                <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
                    <ChatInput
                        onSend={handleSend}
                        onClear={handleClear}
                        onAttachPress={() => setModalVisible(true)}
                        isStreaming={isStreaming}
                        attachments={attachments}
                        onRemoveAttachment={handleRemoveAttachment}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>

            {/* Attachment modal */}
            <AttachmentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAttach={handleAttach}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: typography.headerSize,
        fontWeight: typography.fontWeight.semibold,
    },
    headerButton: {
        padding: spacing.xs,
    },
    messagesContent: {
        paddingVertical: spacing.lg,
    },
    emptyContent: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // Inverted FlatList flips the empty view, so we un-flip it
        transform: [{ scaleY: -1 }],
        paddingHorizontal: spacing.xl,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        color: colors.textMuted,
        fontSize: typography.bodySize,
        textAlign: 'center',
    },
    inputSafeArea: {
        backgroundColor: colors.background,
    },
});
