import { Text, View, TextInput, StyleSheet } from "react-native";
import { AuthStore } from "stores";
import { Redirect, useRouter } from "expo-router";
import { useRef } from "react";
import { signIn } from "services/Auth";

export default function LogIn() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { initialized, isLoggedIn } = AuthStore.useState();

  return initialized && isLoggedIn ? (
    <Redirect href={`/(app)/home`} />
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <Text
        onPress={async () =>
          await signIn(emailRef.current, passwordRef.current)
        }
      >
        Login
      </Text>
      <Text onPress={() => router.push("/create-account")}>Create Account</Text>
    </View>
  );
  // return (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <View>
  //       <Text style={styles.label}>Email</Text>
  //       <TextInput
  //         placeholder="email"
  //         autoCapitalize="none"
  //         nativeID="email"
  //         onChangeText={(text) => {
  //           emailRef.current = text;
  //         }}
  //         style={styles.textInput}
  //       />
  //     </View>
  //     <View>
  //       <Text style={styles.label}>Password</Text>
  //       <TextInput
  //         placeholder="password"
  //         secureTextEntry={true}
  //         nativeID="password"
  //         onChangeText={(text) => {
  //           passwordRef.current = text;
  //         }}
  //         style={styles.textInput}
  //       />
  //     </View>
  //     <Text
  //       onPress={async () =>
  //         (await signIn(emailRef.current, passwordRef.current))
  //           ? router.replace("/(app)/home")
  //           : null
  //       }
  //     >
  //       Login
  //     </Text>
  //     <Text onPress={() => router.push("/create-account")}>Create Account</Text>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#455fff",
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#455fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
});
