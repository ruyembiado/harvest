import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Card,
  Button,
} from "react-native-paper";
import { Link } from "expo-router";
import GlobalStyles from "../assets/styles/styles";
import customTheme from "../assets/styles/theme";

export default function Index() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
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
            >
              Login
            </Button>

            <Text>
              Don't have an account?
              <Link href="/register" style={GlobalStyles.registerLink}>
                Register here
              </Link>
            </Text>
            <Link href="/terms" style={GlobalStyles.registerLink}>
                Terms
              </Link>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}
