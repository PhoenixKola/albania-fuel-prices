import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useApp } from "../context/AppContext";
import BottomTabBar from "../components/layout/BottomTabBar";
import RewardUnlockModal from "../components/ads/RewardUnlockModal";
import RateAppModal from "../components/feedback/RateAppModal";

import HomeTab from "../screens/HomeTab";
import StationsTab from "../screens/StationsTab";
import CompareTab from "../screens/CompareTab";
import SettingsTab from "../screens/SettingsTab";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const ctx = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle={ctx.themeName === "dark" ? "light-content" : "dark-content"}
        backgroundColor={ctx.theme.colors.bg}
      />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <BottomTabBar {...props} />}
        >
          <Tab.Screen name="Home" component={HomeTab} />
          <Tab.Screen name="Stations" component={StationsTab} />
          <Tab.Screen name="Compare" component={CompareTab} />
          <Tab.Screen name="Settings" component={SettingsTab} />
        </Tab.Navigator>
      </NavigationContainer>

      <RewardUnlockModal
        theme={ctx.theme}
        t={ctx.t}
        open={ctx.rewardModalOpen}
        minutes={30}
        loadingAd={!ctx.reward.loaded}
        onClose={() => ctx.closeRewardModal(true)}
        onWatch={ctx.onRewardWatch}
        onContinue={ctx.onRewardContinue}
      />

      <RateAppModal
        theme={ctx.theme}
        t={ctx.t}
        open={ctx.rateOpen}
        onClose={() => {
          ctx.setRateOpen(false);
          ctx.rate.snooze();
        }}
        onRate={ctx.openStoreReview}
        onLater={() => {
          ctx.setRateOpen(false);
          ctx.rate.snooze();
        }}
      />
    </SafeAreaView>
  );
}
