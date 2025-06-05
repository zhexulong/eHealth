import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';

import { ThemeProvider } from '@/theme';
import { ApplicationNavigator } from '@/navigation/Application';
import { TTSProvider } from '@/context/TTSContext';
import { PaperThemeWrapper } from '@/components/PaperThemeWrapper';

import '@/translations';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKV();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <PaperThemeWrapper>
            <TTSProvider>
              <ApplicationNavigator />
            </TTSProvider>
          </PaperThemeWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
