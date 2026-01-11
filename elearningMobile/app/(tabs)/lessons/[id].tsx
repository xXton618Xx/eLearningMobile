import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const FALLBACK = {
  '1': { title: '1987 Constitution — Overview', content: 'Full lesson content for 1987 Constitution (mock).' },
  '2': { title: 'Presidents since 1987', content: 'Full lesson content for recent presidents (mock).' },
  '3': { title: 'Recent Republic Acts', content: 'Full lesson content for recent laws (mock).' },
};

export default function LessonDetail() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState(FALLBACK[id as string] || { title: 'Loading...', content: '' });
  const [loading, setLoading] = useState(true);
  const bg = useThemeColor({}, 'background');

  useEffect(() => {
    let mounted = true;
    fetch(`http://localhost:4000/api/lessons/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        if (mounted) setLesson({ title: data.title, content: data.content || data.body || '' });
      })
      .catch(() => {
        if (mounted && FALLBACK[id as string]) setLesson(FALLBACK[id as string]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen options={{ title: lesson.title }} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <ThemedText type="title">{lesson.title}</ThemedText>
          </View>
          <ThemedText style={styles.body}>{lesson.content}</ThemedText>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24 },
});
