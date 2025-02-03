import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const AddRice: React.FC = () => {
  const [rice_variety_name, setRiceVariety] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { rice_land_id } = useLocalSearchParams();

  const riceVarities = [
    { label: "-- Select Variety --", value: "" },
    { label: "NSIC Rc 222", value: "nsic_rc_222" },
    { label: "NSIC Rc 216", value: "nsic_rc_216" },
    { label: "NSIC Rc 480", value: "nsic_rc_480" },
    { label: "NSIC Rc 10", value: "nsic_rc_10" },
  ];

  const handleAddRiceVariety = async () => {
    if (!rice_variety_name) {
      alert("Rice land name is required.");
      return;
    }

    setLoading(true);

    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) {
        return;
      }

      if (!rice_land_id) {
        return;
      }

      const response = await api.post("/add_rice_variety", {
        rice_land_id,
        rice_variety_name,
      });

      router.replace("/(rices)");
      Alert.alert("Rice variety added Successfully.");
    } catch (error) {
      console.error("Add error:", error);
      Alert.alert("Add failed.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <View style={[GlobalStyles.TitleContainer]}>
        <Text variant="headlineLarge" style={[GlobalStyles.title]}>
          Add Rice Variety
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          GlobalStyles.RiceLandScrollContainer,
          { paddingLeft: 20, paddingRight: 20 },
        ]}
      >
        <View style={[GlobalStyles.FormContainer]}>
          <View>
            <Text>Select Rice Variety:</Text>
            <Picker
              selectedValue={rice_variety_name}
              onValueChange={(itemValue) => setRiceVariety(itemValue)}
              style={{ height: 50, width: 250 }}
            >
              {riceVarities.map((condition) => (
                <Picker.Item
                  label={condition.label}
                  value={condition.value}
                  key={condition.value}
                />
              ))}
            </Picker>
          </View>

          <Button
            icon="plus"
            mode="contained"
            style={GlobalStyles.button}
            loading={loading}
            disabled={loading}
            onPress={handleAddRiceVariety}
          >
            Add Rice Variety
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default AddRice;
