import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

const PAIRS = [
  'Separation of Powers',
  'Executive',
  'Legislative',
  'Judiciary',
  'Bill of Rights',
  'Constitution',
];

export default function MatchingScreen() {
  const [cards, setCards] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const items = PAIRS.concat(PAIRS).slice(0, 12);
    setCards(shuffle(items));
  }, []);

  useEffect(() => {
    if (revealed.length === 2) {
      const [a, b] = revealed;
      if (cards[a] === cards[b]) {
        setMatched((m) => [...m, a, b]);
        setScore((s) => s + 10);
      }
      setTimeout(() => setRevealed([]), 700);
    }
  }, [revealed]);

  function onPress(idx: number) {
    if (revealed.includes(idx) || matched.includes(idx)) return;
    if (revealed.length === 2) return;
    setRevealed((r) => [...r, idx]);
  }

  function saveProgress() {
    fetch('http://localhost:4000/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyPoints: score, lastLessonId: null }),
    })
      .then((r) => r.json())
      .then(() => Alert.alert('Saved', 'Progress saved to backend'))
      .catch(() => Alert.alert('Offline', 'Could not save — running fallback'));
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Matching</ThemedText>
      <ThemedText>Score: {score}</ThemedText>
      <View style={styles.grid}>
        {cards.map((label, i) => {
          const isRevealed = revealed.includes(i) || matched.includes(i);
          return (
            <TouchableOpacity key={i} style={styles.card} onPress={() => onPress(i)}>
              <ThemedText type={isRevealed ? 'defaultSemiBold' : 'default'}>
                {isRevealed ? label : 'Tap'}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.save} onPress={saveProgress}>
        <ThemedText type="link">Save progress</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  grid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    width: '30%',
    minHeight: 56,
    margin: 6,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  save: { marginTop: 12, alignItems: 'center' },
});
