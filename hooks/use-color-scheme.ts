import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSurveys } from '../context/SurveyContext';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const context = useSurveys();
    if (context && context.themeMode) {
      return context.themeMode as 'light' | 'dark';
    }
  } catch (e) {
    // Fallback to system color scheme if called outside SurveyProvider
  }
  return (useSystemColorScheme() || 'light') as 'light' | 'dark';
}
