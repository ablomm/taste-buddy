import UserProvider from './src/providers/UserProvider';
import TasteBuddy from './src/components/TasteBuddy'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <UserProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TasteBuddy />
      </GestureHandlerRootView>
    </UserProvider>
  );
}

export default App;
