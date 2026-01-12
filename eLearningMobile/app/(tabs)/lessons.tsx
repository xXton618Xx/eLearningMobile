import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { FlatList, StyleSheet, TouchableOpacity, TextInput, View, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LessonsScreen() {
  const [search, setSearch] = useState('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const cardBg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      // Fetches the "Light" list
      const res = await fetch(`http://10.47.80.15:4000/api/lessons`);
      const data = await res.json();
      setLessons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter((item) => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    (item.excerpt && item.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Lessons</ThemedText>
      <View style={[styles.searchContainer, { borderColor: textColor }]}>
        <TextInput 
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search topics..."
          placeholderTextColor={placeholderColor}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
              <TouchableOpacity style={styles.cardInner}>
                {/* We pass the ID to the route, the route will fetch details */}
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
  
  // Search Styles
  searchContainer: {
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    justifyContent: 'center',
    opacity: 0.6
  },
  searchInput: {
    fontSize: 16,
    height: '100%'
  },

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