import UserProvider from './src/providers/UserProvider';
import TasteBuddy from './src/components/TasteBuddy'

const App = () => {
  return (
    <UserProvider>
      <TasteBuddy />
    </UserProvider>
  );
}

export default App;
