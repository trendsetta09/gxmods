import React, { useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { useAgentStore } from '../store/agentStore';

interface Props {
  onPressIn: () => void;
  onPressOut: () => void;
}

export function VoiceButton({ onPressIn, onPressOut }: Props) {
  const isListening = useAgentStore((s) => s.isListening);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.25, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [isListening, pulse]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={styles.wrapper}>
      <Animated.View style={[styles.ring, { transform: [{ scale: pulse }], opacity: isListening ? 0.4 : 0 }]} />
      <Animated.View style={[styles.button, isListening && styles.buttonActive]}>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', width: 64, height: 64 },
  ring: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6c47ff',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6c47ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: { backgroundColor: '#ff4757' },
});
