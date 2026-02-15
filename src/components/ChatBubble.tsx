import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { colors, spacing, radii, typography } from '../theme';
import type { ChatMessage } from '../types';

interface ChatBubbleProps {
    message: ChatMessage;
}

/**
 * User message bubble — right-aligned teal pill.
 * Shows attached images as thumbnails above the text.
 */
export default function ChatBubble({ message }: ChatBubbleProps) {
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const hasAttachments =
        message.attachments && message.attachments.length > 0;

    return (
        <Animated.View
            entering={FadeInRight.duration(300).springify()}
            style={styles.wrapper}
        >
            {hasAttachments && (
                <Animated.View
                    entering={FadeInUp.duration(200)}
                    style={styles.attachmentsRow}
                >
                    {message.attachments.map((uri, idx) => (
                        <Image
                            key={idx}
                            source={{ uri }}
                            style={styles.attachmentImage}
                            resizeMode="cover"
                        />
                    ))}
                </Animated.View>
            )}

            {message.content ? (
                <View style={styles.bubble}>
                    <Text style={styles.text}>{message.content}</Text>
                </View>
            ) : null}

            <Text style={styles.timestamp}>{time}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        maxWidth: '80%',
        marginBottom: spacing.md,
        marginRight: spacing.lg,
        marginLeft: spacing.xl * 2,
    },
    attachmentsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    attachmentImage: {
        width: 120,
        height: 120,
        borderRadius: radii.md,
    },
    bubble: {
        backgroundColor: colors.userBubble,
        borderRadius: radii.lg,
        borderBottomRightRadius: radii.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    text: {
        color: colors.userBubbleText,
        fontSize: typography.bodySize,
        lineHeight: 22,
    },
    timestamp: {
        color: colors.textMuted,
        fontSize: typography.captionSize,
        marginTop: spacing.xs,
        marginRight: spacing.xs,
    },
});
