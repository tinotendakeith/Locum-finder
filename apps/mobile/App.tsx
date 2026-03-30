import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 10 }}>Locum Finder</Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>Expo scaffold for the locum mobile app is ready.</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
