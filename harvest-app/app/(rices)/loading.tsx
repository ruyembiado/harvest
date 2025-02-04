import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const LoadScreen: React.FC = () => {
  return (
    <PaperProvider theme={customTheme}>
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={GlobalStyles.activityIndicator.color}
        />
      </View>
    </PaperProvider>
  );
};

export default LoadScreen;
