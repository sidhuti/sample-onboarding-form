import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingForm } from './components/OnboardingForm';
import { GlobalStyles } from './styles/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <OnboardingForm />
    </QueryClientProvider>
  );
}

export default App;