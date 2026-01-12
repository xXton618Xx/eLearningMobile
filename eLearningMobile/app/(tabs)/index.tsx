import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// --- Mock Data for Presentation ---
const WEEKLY_DATA = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.5 },
  { day: 'Wed', hours: 1.0 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 3.2 },
  { day: 'Sat', hours: 0.5 },
  { day: 'Sun', hours: 2.0 },
];

export default function Dashboard() {
  const cardBg = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  
  const [user, setUser] = useState<{ fullName?: string; username?: string } | null>(null);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // 1. Load User
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) setUser(JSON.parse(storedUser));

          // 2. Calculate Streak
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const lastLogin = await AsyncStorage.getItem('lastLoginDate');
          let currentStreak = parseInt(await AsyncStorage.getItem('streak') || '0');

          if (lastLogin !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            if (lastLogin === yesterday) {
              currentStreak += 1; // Continued streak
            } else {
              currentStreak = 1; // Broken streak or first login
            }
            
            // Save new state
            await AsyncStorage.setItem('lastLoginDate', today);
            await AsyncStorage.setItem('streak', currentStreak.toString());
          }
          setStreak(currentStreak);

        } catch (e) { console.error(e); }
      };
      loadData();
    }, [])
  );

  // Chart Logic
  const maxHours = Math.max(...WEEKLY_DATA.map(d => d.hours));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ThemedText type="title" style={styles.header}>Dashboard</ThemedText>
        
        {/* WELCOME CARD WITH STREAK */}
        <View style={[styles.card, { borderColor: tint, backgroundColor: 'rgba(0,0,0,0.03)' }]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                    <ThemedText type="subtitle">
                        Welcome, {user?.username || 'Student'}
                    </ThemedText>
                    <ThemedText>Ready to continue your Law journey?</ThemedText>
                </View>
                
                {/* STREAK BADGE */}
                <View style={styles.streakBadge}>
                    <ThemedText style={{fontSize: 24}}>🔥</ThemedText>
                    <ThemedText type="defaultSemiBold" style={{color: '#ff5722'}}>{streak}</ThemedText>
                    <ThemedText style={{fontSize: 10, color: '#ff5722'}}>Days</ThemedText>
                </View>
            </View>
        </View>

        {/* BAR CHART SECTION */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Weekly Activity</ThemedText>
        <View style={[styles.chartContainer, { borderColor: '#ccc' }]}>
            <View style={styles.chartRow}>
                {WEEKLY_DATA.map((item, index) => {
                    const barHeight = (item.hours / maxHours) * 100;
                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View style={[
                                styles.bar, 
                                { 
                                    height: `${barHeight}%`, 
                                    backgroundColor: item.hours === maxHours ? tint : '#b0bec5' 
                                }
                            ]} />
                            <ThemedText style={styles.barLabel}>{item.day}</ThemedText>
                        </View>
                    );
                })}
            </View>
            <ThemedText style={styles.axisLabel}>Usage in Hours</ThemedText>
        </View>

        {/* ACTIVITY HISTORY */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Activity History</ThemedText>
        <View style={styles.historySection}>
            <ThemedText type="defaultSemiBold">Last 3 Lessons:</ThemedText>
            <ThemedText>• 1987 Constitution (In Progress)</ThemedText>
            <ThemedText>• Executive Branch (Completed)</ThemedText>
            <ThemedText>• Bill of Rights (In Progress)</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16, marginTop: 10 },
  card: { padding: 20, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  sectionTitle: { marginBottom: 15, marginTop: 10, fontSize: 18 },

  // Streak Styles
  streakBadge: { alignItems: 'center', backgroundColor: 'rgba(255, 87, 34, 0.1)', padding: 10, borderRadius: 12 },

  // Chart Styles
  chartContainer: {
    height: 275, padding: 15, borderRadius: 12, borderWidth: 1,
    marginBottom: 20, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.02)'
  },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, marginBottom: 10 },
  barWrapper: { alignItems: 'center', width: 30, height: '100%', justifyContent: 'flex-end' },
  bar: { width: 12, borderRadius: 6, marginBottom: 8 },
  barLabel: { fontSize: 10, opacity: 0.7 },
  axisLabel: { textAlign: 'center', fontSize: 10, opacity: 0.5, marginTop: 5 },

  // History Styles
  historySection: { marginBottom: 15, padding: 15, backgroundColor: 'rgba(150, 150, 150, 0.08)', borderRadius: 8 }
});