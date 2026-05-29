import { useColorScheme } from "react-native";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getColor, type ThemeMode } from "@skyface/theme";
import { formatRelativeTime } from "@skyface/utils";

/**
 * RN 은 CSS/Tailwind 를 쓰지 않으므로 @skyface/theme 의 getColor() 로
 * 동일한 디자인 토큰을 StyleSheet 에 주입합니다.
 * (@skyface/ui 는 웹 DOM 전용이라 RN 에서는 사용하지 않습니다.)
 */
export function App() {
  const scheme: ThemeMode = useColorScheme() === "dark" ? "dark" : "light";
  const c = (token: Parameters<typeof getColor>[0]) => getColor(token, scheme);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c("background") }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <View style={styles.center}>
        <Text style={[styles.h1, { color: c("foreground") }]}>Skyface App</Text>
        <Text style={[styles.caption, { color: c("muted") }]}>
          마지막 동기화 {formatRelativeTime(Date.now() - 120000)}
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: c("primary") }]}>
          <Text style={{ color: c("primary-foreground"), fontWeight: "600" }}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  h1: { fontSize: 30, fontWeight: "700" },
  caption: { fontSize: 14 },
  button: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
});
