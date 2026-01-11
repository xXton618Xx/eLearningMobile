import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function FillScreen() {
  const [answer, setAnswer] = useState('');

  function submit() {
    const ok = answer.trim().length > 0;
    Alert.alert('Submitted', ok ? `You answered: ${answer}` : 'Empty answer');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Fill-in-the-blanks</ThemedText>
      <ThemedText>Type your answer (identification-style)</ThemedText>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter answer"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.submit} onPress={submit}>
        <ThemedText type="link">Submit</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { marginTop: 12, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  submit: { marginTop: 12, alignItems: 'center' },
});
