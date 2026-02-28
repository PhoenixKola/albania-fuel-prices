import { Linking, Platform } from "react-native";

export function openMaps(lat: number, lon: number, label?: string) {
  const q = encodeURIComponent(label ? `${label}` : `${lat},${lon}`);
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${q}&ll=${lat},${lon}`
      : `geo:${lat},${lon}?q=${lat},${lon}(${q})`;

  Linking.openURL(url).catch(() => {});
}