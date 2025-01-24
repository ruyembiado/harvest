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

export default function Terms() {

  return (
    <PaperProvider theme={customTheme}>
      <View style={GlobalStyles.container}>
        <Card style={GlobalStyles.card}>
          <Card.Content>
            <Text variant="headlineLarge" style={GlobalStyles.title}>
              H.A.R.V.E.S.T
            </Text>
            
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}