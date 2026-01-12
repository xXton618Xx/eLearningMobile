import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';

// Pool of terms for the Law context
const TERM_POOL = [
  'Executive', 'Enforces Law',
  'Legislative', 'Makes Law',
  'Judiciary', 'Interprets Law',
  'Corazon Aquino', '1st President (5th Rep)',
  'Fidel Ramos', 'Philippines 2000',
  'Joseph Estrada', 'Erap Para sa Mahirap',
  'Gloria Arroyo', 'Strong Republic',
  'Rodrigo Duterte', 'Build Build Build',
  'Bill of Rights', 'Article III',
  'Suffrage', 'Right to Vote'
];

function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

export default function MatchingScreen() {
  const [cards, setCards] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    // Select random 5 to 10 pairs
    const pairCount = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    
    // Create pairs structure
    let selectedPairs: string[] = [];
    for (let i = 0; i < pairCount; i++) {
        const termIndex = i * 2;
        if(termIndex + 1 < TERM_POOL.length) {
            const term = TERM_POOL[termIndex]; 
            selectedPairs.push(term, term); 
        }
    }
    
    setCards(shuffle(selectedPairs));
    setMatched([]);
    setRevealed([]);
    setScore(0);
  }

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
      body: JSON.stringify({ dailyPoints: score, type: 'matching' }),
    })
      .then((r) => r.json())
      .then(() => Alert.alert('Saved', `Score of ${score} saved!`))
      .catch(() => Alert.alert('Error', 'Could not connect to backend'));
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title">Matching</ThemedText>
        <ThemedText>Pairs matched: {matched.length / 2} | Score: {score}</ThemedText>
        
        <View style={styles.grid}>
          {cards.map((label, i) => {
            const isRevealed = revealed.includes(i) || matched.includes(i);
            const isMatched = matched.includes(i);
            return (
              <TouchableOpacity 
                key={i} 
                style={[styles.card, isMatched && styles.cardMatched]} 
                onPress={() => onPress(i)}
              >
                <ThemedText style={styles.cardText}>
                  {isRevealed ? label : '?'}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={saveProgress}>
                <ThemedText style={styles.btnText}>Save Progress</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={startNewGame}>
                <ThemedText style={styles.btnText}>New Game</ThemedText>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  grid: { marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  card: {
    width: '30%',
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#253047',
    padding: 5,
  },
  cardMatched: { backgroundColor: '#264486' },
  cardText: { textAlign: 'center', fontSize: 12 },
  controls: { flexDirection: 'row', marginTop: 30, justifyContent: 'space-around' },
  button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  resetBtn: { backgroundColor: '#757575' },
  btnText: { color: 'white', fontWeight: 'bold' }
});