import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Checkbox,
  Card,
  Button,
} from "react-native-paper";
import { Link } from "expo-router";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [checkbox, setChecked] = React.useState<Boolean>(false);

  useEffect(() => {
    const loadTermsCondition = async () => {
      const storedCondition = await AsyncStorage.getItem("TermsCondition");
      if (storedCondition) {
        setChecked(JSON.parse(storedCondition));
      }
    };
    loadTermsCondition();
  }, []);

  useEffect(() => {
    const saveTermsCondition = async () => {
      await AsyncStorage.setItem("TermsCondition", JSON.stringify(checkbox));
    };
    saveTermsCondition();
  }, [checkbox]);

  return (
    <PaperProvider theme={customTheme}>
      <View style={GlobalStyles.container}>
        <Card style={GlobalStyles.card}>
          <Card.Content>
            <Text variant="headlineLarge" style={GlobalStyles.title}>
              H.A.R.V.E.S.T
            </Text>
            <Text variant="bodyLarge" style={GlobalStyles.textCenter}>
              Welcome to H.A.R.V.E.S.T an app that can provide real time weather
              updates, this requires your location and some of your information
              including your mobile number accurate data.
            </Text>
            <View style={GlobalStyles.TermsButtonContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox.Android
                  status={checkbox ? "checked" : "unchecked"}
                  onPress={() => setChecked(!checkbox)}
                />
                <Text variant="bodySmall" style={GlobalStyles.textCenter}>
                  I agree to the Terms and Conditions
                </Text>
              </View>
              <Button disabled={!checkbox} mode="contained">
                <Link href="/(lands)" style={{ color: "white" }}>
                  Continue
                </Link>
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}
