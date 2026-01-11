import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login (temporary)</ThemedText>
      <Link href="/signup" style={styles.link}>
        <ThemedText type="link">Go to Sign-up</ThemedText>
      </Link>
      <Link href="/" style={styles.link}>
        <ThemedText type="link">Go to App (tabs)</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
  },
});
