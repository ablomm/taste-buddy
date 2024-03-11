import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from './src/providers/UserProvider';
import TasteBuddy from './src/components/TasteBuddy'


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
