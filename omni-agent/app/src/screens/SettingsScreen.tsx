import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAgentStore } from '../store/agentStore';
import { healthCheck } from '../services/api';

export function SettingsScreen() {
  const { backendUrl, setBackendUrl, clearMessages } = useAgentStore();
  const [urlDraft, setUrlDraft] = useState(backendUrl);

  async function testConnection() {
    const ok = await healthCheck(urlDraft);
    Alert.alert(ok ? 'Connected' : 'Failed', ok ? `Backend at ${urlDraft} is reachable.` : 'Could not reach backend. Check URL and that the server is running.');
  }

  function save() {
    setBackendUrl(urlDraft.replace(/\/$/, ''));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Backend URL</Text>
      <Text style={styles.hint}>
        Your local machine IP or Tailscale address. Example: http://100.x.x.x:8000
      </Text>
      <TextInput
        style={styles.input}
        value={urlDraft}
        onChangeText={setUrlDraft}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="http://192.168.x.x:8000"
        placeholderTextColor="#555"
      />
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={testConnection}>
          <Text style={styles.btnText}>Test Connection</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={save}>
          <Text style={styles.btnText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />
      <Text style={styles.heading}>Session</Text>
      <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => {
        clearMessages();
        Alert.alert('Cleared', 'Message history cleared.');
      }}>
        <Text style={styles.btnText}>Clear Chat History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  heading: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 16 },
  hint: { color: '#888', fontSize: 13, marginBottom: 10, lineHeight: 18 },
  input: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: '#6c47ff' },
  btnDanger: { backgroundColor: '#c0392b', flex: 0, paddingHorizontal: 20 },
  btnText: { color: '#fff', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#222', marginTop: 24, marginBottom: 8 },
});
