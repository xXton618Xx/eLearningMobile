import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Linking, TouchableOpacity, Alert, Image, TextInput, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

// 1. CONFIG: Import your API URL (ensure you have this file in app/config.ts)

// 2. DATA: Keep importing Assessments directly (lightweight enough to keep local for now)
import rawAssessments from '../../../backend/data/assessment.json';

type Question = {
  id: string;
  type: 'multiple' | 'true_false' | 'identification';
  question: string;
  options?: string[];
  answer?: string | boolean;
  answerRegex?: string;
};

export default function LessonDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const bg = useThemeColor({}, 'background');

  // -- State --
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  
  // -- Fetch Lesson Content from Server --
  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
        try {
            // This prevents "overloading" by only fetching the specific lesson needed
            const res = await fetch(`http://10.47.80.15:4000/api/lessons/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (isMounted) setLesson(data);
            } else {
                Alert.alert("Error", "Lesson not found on server.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Connection Error", "Ensure server is running.");
        } finally {
            if (isMounted) setLoading(false);
        }
    };
    if (id) fetchLesson();
    return () => { isMounted = false; };
  }, [id]);

  // -- Quiz Logic --
  // Load questions for this specific lesson ID
  const assessmentData = (rawAssessments as Record<string, Question[]>)[id as string] || [];

  const handleAnswer = (qId: string, val: string | boolean) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const submitQuiz = () => {
    let score = 0;
    const total = assessmentData.length;

    assessmentData.forEach(q => {
      const userAns = answers[q.id];
      if (q.type === 'multiple' || q.type === 'true_false') {
        if (userAns === q.answer) score++;
      } else if (q.type === 'identification') {
        if (typeof userAns === 'string' && q.answerRegex) {
           const regex = new RegExp(q.answerRegex, 'i');
           if (regex.test(userAns.trim())) score++;
        }
      }
    });

    const passed = score >= (total * 0.6);
    Alert.alert(
      passed ? "Congratulations!" : "Keep Studying",
      `You scored ${score} / ${total}`,
      [
        { text: "Review Lesson", onPress: () => setQuizMode(false) },
        { text: "Back to Lessons", onPress: () => router.back() }
      ]
    );
  };

  // -- Loading View --
  if (loading) {
      return (
          <ThemedView style={[styles.container, { justifyContent: 'center' }]}>
              <ActivityIndicator size="large" />
              <ThemedText style={{textAlign: 'center', marginTop: 10}}>Loading Lesson...</ThemedText>
          </ThemedView>
      );
  }

  // -- Not Found View --
  if (!lesson) {
      return (
          <ThemedView style={styles.container}>
              <Stack.Screen options={{ title: 'Error' }} />
              <ThemedText style={{textAlign: 'center', marginTop: 50}}>Lesson content unavailable.</ThemedText>
          </ThemedView>
      );
  }

  // -- Render: Quiz View --
  const renderQuiz = () => (
    <View style={styles.quizContainer}>
      <ThemedText type="subtitle" style={styles.quizHeader}>Assessment: {lesson.title}</ThemedText>
      <ThemedText style={{marginBottom: 20}}>Answer all {assessmentData.length} questions.</ThemedText>

      {assessmentData.map((q, index) => (
        <View key={q.id} style={styles.questionCard}>
          <ThemedText type="defaultSemiBold" style={styles.qText}>{index + 1}. {q.question}</ThemedText>
          
          {/* Multiple Choice */}
          {q.type === 'multiple' && q.options?.map((opt) => (
            <TouchableOpacity 
              key={opt} 
              style={[styles.optBtn, answers[q.id] === opt && styles.optSelected]}
              onPress={() => handleAnswer(q.id, opt)}
            >
              <ThemedText style={answers[q.id] === opt ? {color: 'white'} : {}}>{opt}</ThemedText>
            </TouchableOpacity>
          ))}

          {/* True / False */}
          {q.type === 'true_false' && (
            <View style={styles.tfContainer}>
              <TouchableOpacity 
                style={[styles.optBtn, styles.tfBtn, answers[q.id] === true && styles.optSelected]}
                onPress={() => handleAnswer(q.id, true)}
              >
                <ThemedText style={answers[q.id] === true ? {color: 'white'} : {}}>True</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optBtn, styles.tfBtn, answers[q.id] === false && styles.optSelected]}
                onPress={() => handleAnswer(q.id, false)}
              >
                 <ThemedText style={answers[q.id] === false ? {color: 'white'} : {}}>False</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Identification */}
          {q.type === 'identification' && (
            <TextInput 
              style={styles.input}
              placeholder="Type your answer..."
              placeholderTextColor="#888"
              value={(answers[q.id] as string) || ''}
              onChangeText={(text) => handleAnswer(q.id, text)}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
        <ThemedText type="subtitle" style={{color: 'white'}}>Submit Assessment</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelBtn} onPress={() => setQuizMode(false)}>
        <ThemedText style={{color: 'red'}}>Cancel</ThemedText>
      </TouchableOpacity>
    </View>
  );

  // -- Render: Main Lesson View --
  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen options={{ title: lesson.title }} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {!quizMode ? (
          <>
            <View style={styles.header}>
              <ThemedText type="title">{lesson.title}</ThemedText>
            </View>

            {/* Images Fetching from URL provided in JSON */}
            {lesson.images && lesson.images.length > 0 && (
                <ScrollView horizontal style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
                    {lesson.images.map((img: string, idx: number) => (
                        <Image 
                            key={idx} 
                            source={{ uri: img }} 
                            style={styles.image} 
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
            )}

            <ThemedText style={styles.body}>{lesson.content}</ThemedText>
            
            {lesson.sources && lesson.sources.length > 0 && (
                <View style={styles.section}>
                    <ThemedText type="defaultSemiBold">Sources:</ThemedText>
                    {lesson.sources.map((src: string, idx: number) => (
                        <ThemedText key={idx} type="link" onPress={() => Linking.openURL(src)}>• {src}</ThemedText>
                    ))}
                </View>
            )}

            {/* Assessment Entry Point */}
            <View style={styles.assessmentBox}>
                <ThemedText type="subtitle">Post-Lesson Assessment</ThemedText>
                
                {assessmentData.length > 0 ? (
                  <>
                    <ThemedText style={{marginBottom: 10}}>
                        {assessmentData.length} Questions • Passing Score: 60%
                    </ThemedText>
                    <TouchableOpacity style={styles.quizBtn} onPress={() => { setAnswers({}); setQuizMode(true); }}>
                        <ThemedText style={{color: 'white'}}>Take Assessment</ThemedText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <ThemedText style={{fontStyle: 'italic', color: 'gray', marginTop: 5}}>
                      No assessment available for this lesson.
                  </ThemedText>
                )}
            </View>
          </>
        ) : (
          renderQuiz()
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { marginBottom: 12 },
  imageScroll: { marginBottom: 16, flexDirection: 'row' },
  image: { width: 300, height: 180, borderRadius: 8, marginRight: 10, backgroundColor: '#ddd' },
  body: { fontSize: 16, lineHeight: 24 },
  section: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderColor: '#ccc' },
  
  // Assessment Box
  assessmentBox: { marginTop: 30, padding: 15, backgroundColor: '#e0f7fa', borderRadius: 8, alignItems: 'center' },
  quizBtn: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 30, backgroundColor: '#00796b', borderRadius: 25 },
  
  // Quiz Styles
  quizContainer: { paddingBottom: 40 },
  quizHeader: { marginBottom: 10, textAlign: 'center' },
  questionCard: { padding: 16, borderRadius: 10, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
  qText: { marginBottom: 12, fontSize: 16 },
  optBtn: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 8, backgroundColor: 'white' },
  optSelected: { backgroundColor: '#00796b', borderColor: '#00796b' },
  tfContainer: { flexDirection: 'row', gap: 10 },
  tfBtn: { flex: 1, alignItems: 'center' },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  submitBtn: { backgroundColor: '#00796b', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  cancelBtn: { marginTop: 20, alignItems: 'center' }
});