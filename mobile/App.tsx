import { AppProvider } from "./src/context/AppContext";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <AppProvider>
      <TabNavigator />
    </AppProvider>
  );
}