import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { colors, spacing } from '../theme';

const DOT_SIZE = 8;
const BOUNCE_HEIGHT = -8;
const DURATION = 300;

/**
 * Three bouncing dots typing indicator.
 */
export default function TypingIndicator() {
    return (
        <View style={styles.container}>
            <BouncingDot delay={0} />
            <BouncingDot delay={DURATION * 0.33} />
            <BouncingDot delay={DURATION * 0.66} />
        </View>
    );
}

interface BouncingDotProps {
    delay: number;
}

function BouncingDot({ delay }: BouncingDotProps) {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(BOUNCE_HEIGHT, { duration: DURATION }),
                    withTiming(0, { duration: DURATION })
                ),
                -1, // infinite
                false
            )
        );
    }, [delay, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs + 2,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: colors.textMuted,
    },
});
