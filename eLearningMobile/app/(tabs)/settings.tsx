import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '../theme-context';

export default function SettingsScreen() {
  const cardBg = useThemeColor({}, 'background');
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(u => {
        if (u) setUser(JSON.parse(u));
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
        "Delete Account",
        "Are you sure? This action is permanent.",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        const res = await fetch(`http://192.168.1.109:4000/api/auth/delete`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: user.username })
                        });

                        if (res.ok) {
                            await AsyncStorage.removeItem('user');
                            Alert.alert("Account Deleted", "You will be redirected to signup.");
                            router.replace("/signup");
                        } else {
                            Alert.alert("Error", "Could not delete account.");
                        }
                    } catch (e) {
                        Alert.alert("Error", "Server is offline.");
                    }
                } 
            }
        ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>Preferences</ThemedText>
        <View style={[styles.row, { backgroundColor: cardBg }]}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch 
              value={theme === 'dark'} 
              onValueChange={toggleTheme} // Enable toggle
            />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>Account: {user?.username || 'Guest'}</ThemedText>
        
        <TouchableOpacity style={[styles.action, { backgroundColor: cardBg }]} onPress={handleLogout}> 
            <ThemedText type="defaultSemiBold">Log out</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.action, { backgroundColor: '#ffcdd2' }]} onPress={handleDeleteAccount}> 
            <ThemedText type="defaultSemiBold" style={{color: '#d32f2f'}}>Delete Account</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginTop: 24 },
  sectionHeader: { marginBottom: 8 },
  row: { padding: 14, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  action: { padding: 14, borderRadius: 10, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
});