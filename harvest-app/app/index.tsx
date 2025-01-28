import React, { useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Card,
  Button,
} from "react-native-paper";
import { Link, useRouter } from "expo-router";
import GlobalStyles from "../assets/styles/styles";
import customTheme from "../assets/styles/theme";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        router.replace("/(lands)");
      }
    };
    loadAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem("authToken", token);

      router.replace("/(condition)");
      Alert.alert("Login Successfully.");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login failed.Please try again.");
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <View style={GlobalStyles.container}>
        <Card style={GlobalStyles.card}>
          <Card.Content>
            <Text variant="headlineLarge" style={GlobalStyles.title}>
              H.A.R.V.E.S.T
            </Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(email) => setEmail(email)}
              mode="outlined"
              style={GlobalStyles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(password) => setPassword(password)}
              mode="outlined"
              style={GlobalStyles.input}
              secureTextEntry
              autoCapitalize="none"
            />
            <Button
              icon="login"
              mode="contained"
              onPress={handleLogin}
              style={GlobalStyles.button}
              loading={loading} // Show loading spinner when registering
              disabled={loading} // Disable the button while loading
            >
              Login
            </Button>

            <Text>
              Don't have an account?
              <Link href="/register" style={GlobalStyles.registerLink}>
                Register here
              </Link>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
};
export default Index;
