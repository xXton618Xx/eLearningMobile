import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const bgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const sanitizeInput = (text: string) => {
    return text.replace(/[<>\/\\'";]/g, "");
  };
  const handleSignup = async () => {
    if (!fullName || !username || !password) {
       Alert.alert('Error', 'Please fill in all required fields.');
       return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://10.47.80.15:4000/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, password, school, birthdate }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Alert.alert('Success', 'Account created! Please log in.', [
            { text: 'OK', onPress: () => router.replace('/login') } // Route to Login
        ]);
      } else {
        Alert.alert('Signup Failed', data.error || 'Could not create account');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Ensure the local server is running (node server.js).');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
        
        <TextInput style={[styles.input, { color: textColor, borderColor: textColor }]} placeholder="Full Name" placeholderTextColor="#888" onChangeText={(text) => setFullName(sanitizeInput(text))} />
        <TextInput style={[styles.input, { color: textColor, borderColor: textColor }]} placeholder="Username" placeholderTextColor="#888" onChangeText={(text) => setUsername(sanitizeInput(text))} autoCapitalize="none" />
        <TextInput style={[styles.input, { color: textColor, borderColor: textColor }]} placeholder="School" placeholderTextColor="#888" onChangeText={(text) => setSchool(sanitizeInput(text))} />
        <TextInput style={[styles.input, { color: textColor, borderColor: textColor }]} placeholder="Birthdate (YYYY-MM-DD)" placeholderTextColor="#888" onChangeText={(text) => setBirthdate(sanitizeInput(text))} />
        
        <TextInput 
          style={[styles.input, { color: textColor, borderColor: textColor }]} 
          placeholder="Password" 
          placeholderTextColor="#888" 
          secureTextEntry 
          onChangeText={setPassword} 
        />
        <TextInput 
          style={[styles.input, { color: textColor, borderColor: textColor }]} 
          placeholder="Confirm Password" 
          placeholderTextColor="#888" 
          secureTextEntry 
          onChangeText={setConfirmPassword} 
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <ThemedText type="defaultSemiBold" style={{color: bgColor}}>Sign Up</ThemedText>
        </TouchableOpacity>

        <Link href="/login" style={styles.link}>
          <ThemedText type="link">Already have an account? Log in</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  scroll: { padding: 20 },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15 },
  button: { backgroundColor: '#0a7ea4', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  link: { marginTop: 20, textAlign: 'center' },
});