import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SettingsScreen() {
  const cardBg = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <View style={styles.section}>
        <TouchableOpacity style={[styles.action, { backgroundColor: cardBg }]}> 
          <Link href="/login" asChild>
            <ThemedText type="defaultSemiBold">Sign out</ThemedText>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.action, { backgroundColor: cardBg }]}> 
          <Link href="/signup" asChild>
            <ThemedText type="defaultSemiBold">Delete account (go to Sign-up)</ThemedText>
          </Link>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginTop: 12 },
  action: { padding: 14, borderRadius: 10, marginBottom: 12 },
});
