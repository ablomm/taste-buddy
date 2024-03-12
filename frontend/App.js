import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserProvider from './src/providers/UserProvider';
import LoadingProvider from './src/providers/LoadingProvider';

import TasteBuddy from './src/components/TasteBuddy'


const App = () => {
  return (
    <UserProvider>
      <LoadingProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <TasteBuddy />
        </GestureHandlerRootView>
      </LoadingProvider>
    </UserProvider>
  );
}

export default App;
