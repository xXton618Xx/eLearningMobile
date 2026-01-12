import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect immediately to signup as requested
  return <Redirect href="/signup" />;
}