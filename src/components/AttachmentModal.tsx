import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    StyleSheet,
    Platform,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii, typography } from '../theme';

interface AttachmentModalProps {
    visible: boolean;
    onClose: () => void;
    onAttach: (uri: string) => void;
}

/**
 * Bottom-sheet modal for attaching photos.
 *
 * Options:
 * - Camera: launches system camera via expo-image-picker
 * - Photos: launches system gallery via expo-image-picker
 */
export default function AttachmentModal({ visible, onClose, onAttach }: AttachmentModalProps) {
    const handleCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            alert('Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets?.[0]) {
            onAttach(result.assets[0].uri);
            onClose();
        }
    };

    const handleGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Gallery permission is required to select photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsMultipleSelection: true,
            selectionLimit: 4,
        });

        if (!result.canceled && result.assets) {
            result.assets.forEach((asset) => onAttach(asset.uri));
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            {/* Backdrop */}
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill} />
            </Pressable>

            {/* Sheet */}
            <Animated.View entering={SlideInDown.duration(300).springify()} style={styles.sheet}>
                {/* Handle bar */}
                <View style={styles.handleBar} />

                <Text style={styles.title}>Add Photo</Text>

                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionCard} onPress={handleCamera}>
                        <View style={styles.optionIcon}>
                            <Ionicons name="camera" size={28} color={colors.accent} />
                        </View>
                        <Text style={styles.optionLabel}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} onPress={handleGallery}>
                        <View style={styles.optionIcon}>
                            <Ionicons name="images" size={28} color={colors.accent} />
                        </View>
                        <Text style={styles.optionLabel}>Photos</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: colors.overlay,
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.modalBg,
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: colors.textMuted,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.headerSize,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.lg,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    optionCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        paddingVertical: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    optionIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.inputBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    optionLabel: {
        color: colors.textPrimary,
        fontSize: typography.bodySize,
        fontWeight: typography.fontWeight.medium,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    cancelText: {
        color: colors.textMuted,
        fontSize: typography.bodySize,
    },
});
