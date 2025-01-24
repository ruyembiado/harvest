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
import api from "../services/api";

export default function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone_number, setPhoneNumber] = React.useState("");
  const [confirm_pass, setConfirmPass] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (password !== confirm_pass) {
      alert("Passwords do not match!");
      return;
    }

    if (!email || !password || !name || !phone_number) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        name,
        email,
        phone_number,
        password,
      });

      console.log("User:", response.data.user);
      // You can handle success like redirecting or showing success message here
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
              label="Full Name"
              value={name}
              onChangeText={(name) => setName(name)}
              mode="outlined"
              style={GlobalStyles.input}
              autoCapitalize="none"
            />
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
              label="Phone Number"
              value={phone_number}
              onChangeText={(phone_number) => setPhoneNumber(phone_number)}
              mode="outlined"
              style={GlobalStyles.input}
              keyboardType="number-pad"
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
            <TextInput
              label="Confirm Password"
              value={confirm_pass}
              onChangeText={(confirm_pass) => setConfirmPass(confirm_pass)}
              mode="outlined"
              style={GlobalStyles.input}
              secureTextEntry
              autoCapitalize="none"
            />
            <Button
              icon="login"
              mode="contained"
              onPress={handleRegister}
              style={GlobalStyles.button}
              loading={loading}  // Show loading spinner when registering
              disabled={loading} // Disable the button while loading
            >
              Register
            </Button>

            <Text>
              Already have an account?
              <Link href="/" style={GlobalStyles.registerLink}>
                Login here
              </Link>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}