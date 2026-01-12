import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Import Questions
import questionData from '../../backend/data/interactive_question.json';

type Question = { id: string; question: string; answer: string; regex: string };

function shuffle<T>(arr: T[]) {
  return arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(x => x.v);
}

export default function IdentificationScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize Session
  useEffect(() => {
    const allQuestions = questionData.identification as Question[];
    const selected = shuffle(allQuestions).slice(0, 10);
    setSession(selected);
  }, []);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const currentQ = session[index];
    const regex = new RegExp(currentQ.regex, 'i');
    const isCorrect = regex.test(userAnswer.trim());

    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setFeedback(null);
    setUserAnswer('');
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
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <ThemedText style={{color: 'white'}}>Return to Menu</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const currentQ = session[index];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title">Identification</ThemedText>
        <ThemedText style={styles.progress}>Question {index + 1} of 10</ThemedText>
        
        <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.qText}>{currentQ.question}</ThemedText>
            
            {/* Input Area */}
            {!feedback && (
                <>
                    <TextInput 
                        style={styles.input} 
                        value={userAnswer} 
                        onChangeText={setUserAnswer} 
                        placeholder="Type answer here..." 
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                        <ThemedText style={{color: 'white'}}>Submit</ThemedText>
                    </TouchableOpacity>
                </>
            )}

            {/* Feedback & Routing */}
            {feedback && (
                <View style={[styles.feedback, feedback === 'correct' ? styles.success : styles.error]}>
                    <ThemedText type="defaultSemiBold" style={{color: 'white', fontSize: 18}}>
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                    </ThemedText>
                    <ThemedText style={{color: 'white', marginTop: 5}}>
                        Answer: {currentQ.answer}
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
  card: { padding: 20, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12 },
  qText: { marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, fontSize: 16 },
  btn: { backgroundColor: '#0288d1', padding: 15, borderRadius: 8, alignItems: 'center' },
  feedback: { marginTop: 20, padding: 20, borderRadius: 8, alignItems: 'center' },
  success: { backgroundColor: '#4caf50' },
  error: { backgroundColor: '#f44336' },
  nextBtn: { marginTop: 15, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }
});