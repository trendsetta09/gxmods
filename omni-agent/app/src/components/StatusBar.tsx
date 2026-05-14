import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAgentStore } from '../store/agentStore';

export function AgentStatusBar() {
  const { isListening, isThinking, isSpeaking } = useAgentStore();

  const label = isListening
    ? 'Listening...'
    : isThinking
    ? 'Thinking...'
    : isSpeaking
    ? 'Speaking...'
    : 'Ready';

  const color = isListening
    ? '#ff4757'
    : isThinking
    ? '#ffa502'
    : isSpeaking
    ? '#2ed573'
    : '#555';

  return (
    <View style={styles.bar}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#111',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { color: '#aaa', fontSize: 13 },
});
