import { AppProvider } from "./src/context/AppContext";
import { useOtaUpdateOnLaunch } from "./src/hooks/useOtaUpdateOnLaunch";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  useOtaUpdateOnLaunch();

  return (
    <AppProvider>
      <TabNavigator />
    </AppProvider>
  );
}
