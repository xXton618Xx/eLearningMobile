import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function AssessmentsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Point-based Assessments</ThemedText>
      <ThemedText>Choose a set size:</ThemedText>
      <TouchableOpacity style={styles.option}><ThemedText>10 Questions</ThemedText></TouchableOpacity>
      <TouchableOpacity style={styles.option}><ThemedText>20 Questions</ThemedText></TouchableOpacity>
      <TouchableOpacity style={styles.option}><ThemedText>30 Questions</ThemedText></TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  option: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.04)' },
});
