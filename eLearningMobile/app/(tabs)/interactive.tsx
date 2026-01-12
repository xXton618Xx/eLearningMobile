import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function InteractiveIndex() {
  const cardBg = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Interactive Games</ThemedText>
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]}> 
          <Link href="/../interactive/matching" asChild>
            <ThemedText type="defaultSemiBold">Matching (Memory Game)</ThemedText>
          </Link>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]}> 
          <Link href="/../interactive/fill" asChild>
            <ThemedText type="defaultSemiBold">Identification (Fill-in-the-blanks)</ThemedText>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]}> 
          <Link href="/../interactive/truefalse" asChild>
            <ThemedText type="defaultSemiBold">True or False (Speed Round)</ThemedText>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]}> 
          <Link href="/../interactive/assessments" asChild>
            <ThemedText type="defaultSemiBold">Point-based Assessments</ThemedText>
          </Link>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16, marginTop: 10 },
  grid: { marginTop: 12, gap: 12 },
  card: { padding: 14, borderRadius: 10, marginBottom: 12 },
});