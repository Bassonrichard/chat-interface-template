import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import TypingIndicator from './TypingIndicator';

/**
 * Assistant message — full-width, left-aligned with markdown rendering.
 * Shows a small sparkle icon and renders content via markdown.
 * Displays a typing indicator while streaming with no content yet.
 */
export default function AssistantMessage({ message }) {
    const showTyping = message.isStreaming && !message.content;

    return (
        <Animated.View
            entering={FadeInLeft.duration(300).springify()}
            style={styles.wrapper}
        >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Ionicons
                    name="sparkles"
                    size={18}
                    color={colors.assistantIcon}
                />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {showTyping ? (
                    <TypingIndicator />
                ) : (
                    <Markdown style={markdownStyles}>
                        {message.content}
                    </Markdown>
                )}

                {/* Blinking cursor while streaming */}
                {message.isStreaming && message.content ? (
                    <StreamingCursor />
                ) : null}
            </View>
        </Animated.View>
    );
}

/**
 * Simple blinking block cursor during streaming.
 */
function StreamingCursor() {
    return (
        <Animated.View style={styles.cursor}>
            <View style={styles.cursorBlock} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    avatarContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        marginTop: 2,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cursor: {
        marginLeft: 2,
        marginTop: 2,
    },
    cursorBlock: {
        width: 7,
        height: 18,
        backgroundColor: colors.accent,
        borderRadius: 2,
        opacity: 0.8,
    },
});

/**
 * Markdown style overrides for dark theme.
 */
const markdownStyles = StyleSheet.create({
    body: {
        color: colors.assistantText,
        fontSize: typography.bodySize,
        lineHeight: 24,
    },
    heading1: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    heading2: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    heading3: {
        color: colors.textPrimary,
        fontSize: 17,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.sm,
    },
    paragraph: {
        marginBottom: spacing.sm,
    },
    blockquote: {
        backgroundColor: colors.surface,
        borderLeftColor: colors.accent,
        borderLeftWidth: 3,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginVertical: spacing.sm,
        borderRadius: radii.sm,
    },
    code_inline: {
        backgroundColor: colors.surface,
        color: colors.accent,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'monospace',
    },
    code_block: {
        backgroundColor: '#12121F',
        color: colors.accent,
        padding: spacing.md,
        borderRadius: radii.sm,
        fontSize: 14,
        fontFamily: 'monospace',
        marginVertical: spacing.sm,
    },
    fence: {
        backgroundColor: '#12121F',
        color: colors.accent,
        padding: spacing.md,
        borderRadius: radii.sm,
        fontSize: 14,
        fontFamily: 'monospace',
        marginVertical: spacing.sm,
    },
    list_item: {
        marginBottom: spacing.xs,
    },
    bullet_list: {
        marginBottom: spacing.sm,
    },
    ordered_list: {
        marginBottom: spacing.sm,
    },
    strong: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
    em: {
        fontStyle: 'italic',
        color: colors.textSecondary,
    },
    hr: {
        backgroundColor: colors.border,
        height: 1,
        marginVertical: spacing.md,
    },
    link: {
        color: colors.accent,
        textDecorationLine: 'underline',
    },
});
