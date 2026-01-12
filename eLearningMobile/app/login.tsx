import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is installed

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const textColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');
  const sanitizeInput = (text: string) => {
    return text.replace(/[<>\/\\'";]/g, "");
  };
  const handleLogin = async () => {
    if (!username || !password) {
        Alert.alert('Error', 'Please enter username and password');
        return;
    }

    try {
      const res = await fetch(`http://10.47.80.15:4000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Save Session Locally
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        // Route to Dashboard
        router.replace('/(tabs)'); 
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Ensure the local server is running.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
      
      <TextInput 
        style={[styles.input, { color: textColor, borderColor: textColor }]} 
        placeholder="Username" 
        placeholderTextColor="#888" 
        autoCapitalize="none"
        onChangeText={(text) => setUsername(sanitizeInput(text))} 
      />
      <TextInput 
        style={[styles.input, { color: textColor, borderColor: textColor }]} 
        placeholder="Password" 
        placeholderTextColor="#888" 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText type="defaultSemiBold" style={{color: bgColor}}>Log In</ThemedText>
      </TouchableOpacity>

      <Link href="/signup" style={styles.link}>
        <ThemedText type="link">Create an account</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15 },
  button: { backgroundColor: '#0a7ea4', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  link: { marginTop: 20, textAlign: 'center', alignSelf: 'center' },
});