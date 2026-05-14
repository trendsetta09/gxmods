import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { useAgentStore } from '../store/agentStore';
import { MessageBubble } from '../components/MessageBubble';
import { VoiceButton } from '../components/VoiceButton';
import { AgentStatusBar } from '../components/StatusBar';
import { sendChat, synthesizeSpeech } from '../services/api';
import { useVoice } from '../hooks/useVoice';

export function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);
  const { messages, addMessage, setThinking, setSpeaking } = useAgentStore();
  const { startRecording, stopRecording } = useVoice();

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInputText('');
    addMessage({ role: 'user', content: trimmed });

    setThinking(true);
    try {
      const { reply } = await sendChat(trimmed);
      addMessage({ role: 'assistant', content: reply });

      setSpeaking(true);
      const audioUrl = await synthesizeSpeech(reply);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setSpeaking(false);
          sound.unloadAsync();
        }
      });
      await sound.playAsync();
    } catch (err: any) {
      addMessage({ role: 'assistant', content: `Error: ${err.message}` });
    } finally {
      setThinking(false);
    }
  }, [addMessage, setThinking, setSpeaking]);

  const handleVoicePressIn = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleVoicePressOut = useCallback(async () => {
    const transcript = await stopRecording();
    if (transcript) handleSend(transcript);
  }, [stopRecording, handleSend]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AgentStatusBar />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a command..."
          placeholderTextColor="#555"
          multiline
          onSubmitEditing={() => handleSend(inputText)}
          returnKeyType="send"
        />
        <VoiceButton onPressIn={handleVoicePressIn} onPressOut={handleVoicePressOut} />
        <Pressable style={styles.sendBtn} onPress={() => handleSend(inputText)}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  list: { paddingVertical: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    gap: 8,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: '#6c47ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendText: { color: '#fff', fontWeight: '600' },
});
