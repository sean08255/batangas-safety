// App entry point. It decides which screen to show, like a simple traffic controller.
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HomeScreen from './src/screens/HomeScreen';
import LocatingScreen from './src/screens/LocatingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TownPickerScreen, { PickerReason } from './src/screens/TownPickerScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { Town } from './src/data/towns';
import { colors } from './src/theme';
import { locateTown } from './src/utils/location';

// The town the user is currently using, and how we got it.
type Current = { town: Town; source: 'gps' | 'manual' };

// Every possible screen state.
type Stage =
  | { name: 'welcome' }
  | { name: 'locating' }
  | { name: 'picker'; reason: PickerReason }
  | { name: 'home' }
  | { name: 'emergency' }
  | { name: 'settings' };

function Main() {
  const insets = useSafeAreaInsets(); // keeps content away from the notch and nav bar
  const [stage, setStage] = useState<Stage>({ name: 'welcome' });
  const [current, setCurrent] = useState<Current | null>(null);

  // Go to the home screen with a town.
  function goHome(town: Town, source: 'gps' | 'manual') {
    setCurrent({ town, source });
    setStage({ name: 'home' });
  }

  // Ask permission, read GPS, and move to the right screen.
  async function findMyTown() {
    setStage({ name: 'locating' });
    const result = await locateTown();

    if (result.status === 'denied') {
      setStage({ name: 'picker', reason: { type: 'denied' } });
    } else if (result.status === 'unavailable') {
      setStage({ name: 'picker', reason: { type: 'unavailable' } });
    } else if (result.status === 'outside') {
      setStage({
        name: 'picker',
        reason: result.placeName
          ? { type: 'notCovered', place: result.placeName }
          : { type: 'outside' },
      });
    } else if (!result.town.covered) {
      // In Batangas, but not one of the covered towns yet
      setStage({ name: 'picker', reason: { type: 'notCovered', place: result.town.name } });
    } else {
      goHome(result.town, 'gps');
    }
  }

  // Android back button: go back one screen instead of closing the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stage.name === 'emergency' || stage.name === 'settings') {
        setStage({ name: 'home' });
        return true; // we handled it
      }
      if ((stage.name === 'picker' || stage.name === 'locating') && current) {
        setStage({ name: 'home' });
        return true;
      }
      return false; // let Android do its normal thing
    });
    return () => subscription.remove();
  }, [stage, current]);

  let screen: React.ReactNode = null;
  if (stage.name === 'welcome') {
    screen = (
      <WelcomeScreen
        onContinue={findMyTown}
        onChooseManually={() => setStage({ name: 'picker', reason: { type: 'manual' } })}
      />
    );
  } else if (stage.name === 'locating') {
    screen = <LocatingScreen />;
  } else if (stage.name === 'picker') {
    screen = (
      <TownPickerScreen reason={stage.reason} onPick={(town) => goHome(town, 'manual')} />
    );
  } else if (current && stage.name === 'home') {
    screen = (
      <HomeScreen
        town={current.town}
        source={current.source}
        onOpenEmergency={() => setStage({ name: 'emergency' })}
        onOpenSettings={() => setStage({ name: 'settings' })}
      />
    );
  } else if (current && stage.name === 'emergency') {
    screen = <EmergencyScreen town={current.town} onBack={() => setStage({ name: 'home' })} />;
  } else if (current && stage.name === 'settings') {
    screen = (
      <SettingsScreen
        town={current.town}
        onBack={() => setStage({ name: 'home' })}
        onChangeTown={() => setStage({ name: 'picker', reason: { type: 'manual' } })}
        onUseGps={findMyTown}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {screen}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Main />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
