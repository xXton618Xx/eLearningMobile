import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Import the 60-question pool
import quizPool from '../../backend/data/quiz_pool.json';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AssessmentsScreen() {
  const router = useRouter();
  
  // -- State --
  const [session, setSession] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // -- Actions --
  const startSession = (count: number) => {
    const shuffled = shuffle(quizPool);
    const selected = shuffled.slice(0, count);
    setSession(selected);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setGameOver(false);
  };

  const handleAnswer = (option: string) => {
    if (feedback || !session) return; // Prevent double taps

    const currentQ = session[currentIndex];
    setSelectedOption(option);
    
    if (option === currentQ.answer) {
        setScore(s => s + 1);
        setFeedback('correct');
    } else {
        setFeedback('wrong');
    }
  };

  const nextQuestion = () => {
    if (!session) return;
    
    setFeedback(null);
    setSelectedOption(null);

    if (currentIndex < session.length - 1) {
        setCurrentIndex(i => i + 1);
    } else {
        setGameOver(true);
    }
  };

  // -- Render: Menu Mode --
  if (!session) {
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title">Point-based Assessments</ThemedText>
          <ThemedText style={{marginTop: 10, marginBottom: 20}}>
            Test your knowledge with random questions from the Constitution, Presidents, and Republic Acts.
          </ThemedText>
          
          <ThemedText type="subtitle">Select Length:</ThemedText>
          <View style={{marginTop: 15}}>
            {[10, 20, 30].map((num) => (
                <TouchableOpacity key={num} style={styles.menuBtn} onPress={() => startSession(num)}>
                    <ThemedText type="defaultSemiBold">{num} Questions</ThemedText>
                    <ThemedText style={{fontSize: 12, opacity: 0.7}}>Randomized from pool</ThemedText>
                </TouchableOpacity>
            ))}
          </View>
        </ThemedView>
      );
  }

  // -- Render: Game Over --
  if (gameOver) {
      const percentage = (score / session.length) * 100;
      return (
        <ThemedView style={styles.container}>
            <View style={styles.resultCard}>
                <ThemedText type="title">Assessment Complete</ThemedText>
                <ThemedText type="title" style={{fontSize: 48, marginVertical: 20, color: percentage >= 60 ? '#4caf50' : '#f44336'}}>
                    {score} / {session.length}
                </ThemedText>
                <ThemedText type="subtitle">{percentage >= 60 ? 'Great Job!' : 'Keep Reviewing'}</ThemedText>
                
                <TouchableOpacity style={styles.exitBtn} onPress={() => setSession(null)}>
                     <ThemedText style={{color: 'white'}}>Return to Menu</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
      );
  }

  // -- Render: Question Mode --
  const currentQ = session[currentIndex];

  return (
    <ThemedView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scroll}>
             <View style={styles.headerRow}>
                <ThemedText type="subtitle">Question {currentIndex + 1} of {session.length}</ThemedText>
                <ThemedText>Score: {score}</ThemedText>
             </View>
             
             <View style={styles.card}>
                 <ThemedText style={styles.questionText}>{currentQ.question}</ThemedText>
                 
                 {currentQ.options.map((opt, i) => {
                     let btnStyle = styles.optionBtn;
                     let txtStyle = {};
                     
                     // Styling Logic based on feedback state
                     if (feedback) {
                         if (opt === currentQ.answer) {
                             btnStyle = {...styles.optionBtn, ...styles.correctBtn}; // Always show correct answer
                             txtStyle = {color: 'white', fontWeight: 'bold'};
                         } else if (opt === selectedOption && feedback === 'wrong') {
                             btnStyle = {...styles.optionBtn, ...styles.wrongBtn}; // Show wrong selection
                             txtStyle = {color: 'white'};
                         } else {
                             btnStyle = {...styles.optionBtn}; // Fade others
                         }
                     }

                     return (
                         <TouchableOpacity 
                            key={i} 
                            style={btnStyle} 
                            onPress={() => handleAnswer(opt)}
                            disabled={!!feedback}
                         >
                             <ThemedText style={txtStyle}>{opt}</ThemedText>
                         </TouchableOpacity>
                     );
                 })}
             </View>

             {feedback && (
                 <View style={styles.feedbackArea}>
                     <ThemedText type="defaultSemiBold" style={{marginBottom: 10}}>
                         {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                     </ThemedText>
                     <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
                         <ThemedText style={{color: 'white'}}>Next Question →</ThemedText>
                     </TouchableOpacity>
                 </View>
             )}
             
             {!feedback && (
                 <TouchableOpacity style={styles.quitBtn} onPress={() => setSession(null)}>
                     <ThemedText style={{color: 'red', fontSize: 12}}>Quit Assessment</ThemedText>
                 </TouchableOpacity>
             )}
         </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scroll: { paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  menuBtn: { 
      padding: 20, marginVertical: 8, 
      backgroundColor: 'rgba(0,0,0,0.05)', 
      borderRadius: 10, borderWidth: 1, borderColor: '#ccc' 
  },
  card: { padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  questionText: { marginBottom: 25, fontSize: 18, lineHeight: 26, textAlign: 'center' },
  optionBtn: { 
      padding: 15, borderWidth: 1, borderColor: '#ccc', 
      borderRadius: 8, marginBottom: 10, backgroundColor: 'transparent' 
  },
  correctBtn: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  wrongBtn: { backgroundColor: '#f44336', borderColor: '#f44336' },
  
  feedbackArea: { marginTop: 20, alignItems: 'center' },
  nextBtn: { paddingVertical: 12, paddingHorizontal: 30, backgroundColor: '#0288d1', borderRadius: 25 },
  exitBtn: { marginTop: 30, paddingVertical: 12, paddingHorizontal: 40, backgroundColor: '#0288d1', borderRadius: 25 },
  quitBtn: { marginTop: 30, alignSelf: 'center', opacity: 0.7 },
  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});