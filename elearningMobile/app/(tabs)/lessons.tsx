import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const FALLBACK_LESSONS = [
  { id: '1', title: '1987 Constitution — Overview', excerpt: 'Introduction to the 1987 Philippine Constitution' },
  { id: '2', title: 'Presidents since 1987', excerpt: 'Short bios and major acts' },
  { id: '3', title: 'Recent Republic Acts', excerpt: 'Latest laws and summaries' },
];

export default function LessonsScreen() {
  const [lessons, setLessons] = useState(FALLBACK_LESSONS);
  const [loading, setLoading] = useState(true);
  const cardBg = useThemeColor({}, 'background');

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:4000/api/lessons')
      .then((r) => r.json())
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length) setLessons(data);
      })
      .catch(() => {
        // keep fallback
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Lessons</ThemedText>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
              <TouchableOpacity style={styles.cardInner}>
                <Link href={`/lessons/${item.id}`} asChild>
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                </Link>
              </TouchableOpacity>
              {item.excerpt ? <ThemedText type="subtitle">{item.excerpt}</ThemedText> : null}
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingTop: 12, paddingBottom: 32 },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  cardInner: { paddingBottom: 6 },
});
