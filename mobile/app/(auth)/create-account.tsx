import { Text, View, TextInput, StyleSheet } from "react-native";
import { useRef } from "react";
import { AuthStore } from "stores";
import { Stack, useRouter } from "expo-router";
import { signUp } from "services/Auth";

export default function CreateAccount() {
  const router = useRouter();
  const emailRef = useRef("");
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const passwordRef = useRef("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      />
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          placeholder="firstName"
          nativeID="firstName"
          onChangeText={(text) => {
            firstNameRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          placeholder="lastName"
          nativeID="lastName"
          onChangeText={(text) => {
            lastNameRef.current = text;
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
        style={{ marginBottom: 8 }}
        onPress={async () => {
          const resp = await signUp(emailRef.current, passwordRef.current);
          if (resp?.user) {
            router.replace("/(app)/home");
          } else {
            console.log(resp.error);
            alert("Sign Up Error" + (resp.error as any)?.message);
          }
        }}
      >
        SAVE NEW USER
      </Text>
      {router.canGoBack() && (
        <Text
          onPress={() => {
            AuthStore.update((s) => {
              s.isLoggedIn = false;
            });
            router.back();
          }}
        >
          CANCEL
        </Text>
      )}
    </View>
  );
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
