import React from "react";
import { View, StyleSheet, Alert } from "react-native";
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

const Register: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [phone, setPhoneNumber] = React.useState<string>("");
  const [confirm_pass, setConfirmPass] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleRegister = async () => {
    if (password !== confirm_pass) {
      alert("Passwords do not match!");
      return;
    }

    if (!email) {
      alert("Email is required.");
      return;
    }
    if (!password) {
      alert("Password is required.");
      return;
    }
    if (!name) {
      alert("Name is required.");
      return;
    }
    if (!phone) {
      alert("Phone is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        name,
        email,
        phone,
        password,
      });

      console.log("User:", response.data.user);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPass("");
      alert(response.data.message);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registration failed", "Please try again.");
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
              value={phone}
              onChangeText={(phone) => setPhoneNumber(phone)}
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
              loading={loading} // Show loading spinner when registering
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
};
export default Register;
