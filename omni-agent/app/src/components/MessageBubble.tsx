import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/agentStore';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAgent]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAgent]}>
          {message.content}
        </Text>
        <Text style={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 4, paddingHorizontal: 12 },
  rowUser: { alignItems: 'flex-end' },
  rowAgent: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  bubbleUser: {
    backgroundColor: '#6c47ff',
    borderBottomRightRadius: 4,
  },
  bubbleAgent: {
    backgroundColor: '#1e1e2e',
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: 15, lineHeight: 22 },
  textUser: { color: '#fff' },
  textAgent: { color: '#e0e0e0' },
  time: { fontSize: 11, color: '#888', marginTop: 4 },
});
