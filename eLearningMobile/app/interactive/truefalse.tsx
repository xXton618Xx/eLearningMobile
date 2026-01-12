import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Import Questions
import questionData from '../../backend/data/interactive_question.json';

type Question = { id: string; question: string; answer: boolean };

function shuffle<T>(arr: T[]) {
  return arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(x => x.v);
}

export default function TrueFalseScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize Session
  useEffect(() => {
    const allQuestions = questionData.true_false as Question[];
    const selected = shuffle(allQuestions).slice(0, 10);
    setSession(selected);
  }, []);

  const handleAnswer = (choice: boolean) => {
    const currentQ = session[index];
    const isCorrect = choice === currentQ.answer;

    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setFeedback(null);
    if (index < 9) {
      setIndex(i => i + 1);
    } else {
      setGameOver(true);
    }
  };

  if (session.length === 0) return <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView>;

  if (gameOver) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Session Complete</ThemedText>
        <ThemedText type="subtitle" style={{marginTop: 20}}>Score: {score} / 10</ThemedText>
        <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
          <ThemedText style={{color: 'white'}}>Return to Menu</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const currentQ = session[index];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title">True or False</ThemedText>
        <ThemedText style={styles.progress}>Question {index + 1} of 10</ThemedText>
        
        <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.qText}>{currentQ.question}</ThemedText>
            
            {/* Buttons Area */}
            {!feedback && (
                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.btn, styles.falseBtn]} onPress={() => handleAnswer(false)}>
                        <ThemedText style={{color: 'white', fontWeight: 'bold'}}>FALSE</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.trueBtn]} onPress={() => handleAnswer(true)}>
                        <ThemedText style={{color: 'white', fontWeight: 'bold'}}>TRUE</ThemedText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Feedback & Routing */}
            {feedback && (
                <View style={[styles.feedback, feedback === 'correct' ? styles.success : styles.error]}>
                    <ThemedText type="defaultSemiBold" style={{color: 'white', fontSize: 18}}>
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                    </ThemedText>
                    <ThemedText style={{color: 'white', marginTop: 5}}>
                        The statement is {currentQ.answer ? 'TRUE' : 'FALSE'}.
                    </ThemedText>
                    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                        <ThemedText>Next Question →</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scroll: { paddingBottom: 40 },
  progress: { marginBottom: 20, opacity: 0.7 },
  card: { padding: 20, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, minHeight: 300, justifyContent: 'center' },
  qText: { marginBottom: 40, textAlign: 'center', fontSize: 20, lineHeight: 28 },
  btnRow: { flexDirection: 'row', gap: 15 },
  btn: { flex: 1, padding: 20, borderRadius: 12, alignItems: 'center' },
  trueBtn: { backgroundColor: '#4caf50' },
  falseBtn: { backgroundColor: '#f44336' },
  feedback: { padding: 20, borderRadius: 8, alignItems: 'center', width: '100%' },
  success: { backgroundColor: '#4caf50' },
  error: { backgroundColor: '#f44336' },
  nextBtn: { marginTop: 20, backgroundColor: '#243e58', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  returnBtn: { marginTop: 20, backgroundColor: '#0288d1', padding: 15, borderRadius: 8, alignItems: 'center' }
});