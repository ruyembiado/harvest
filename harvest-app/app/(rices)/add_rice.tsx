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

const AddRice: React.FC = () => {
  const [rice_variety_name, setRiceVariety] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { rice_land_id } = useLocalSearchParams();

  const riceVarities = [
    { label: "-- Select Variety --", value: "" },
    { label: "NSIC Rc 222", value: "NSIC Rc 222" },
    { label: "NSIC Rc 216", value: "NSIC Rc 216" },
    { label: "NSIC Rc 480", value: "NSIC Rc 480" },
    { label: "NSIC Rc 10", value: "NSIC Rc 10" },
  ];

  const handleAddRiceVariety = async () => {
    if (!rice_variety_name) {
      alert("Rice variety name is required.");
      return;
    }

    setLoading(true); // Set loading to true before starting the API calls

    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) {
        return;
      }

      if (!rice_land_id) {
        return;
      }

      // Step 1: Add the rice variety
      const response = await api.post("/add_rice_variety", {
        rice_land_id,
        rice_variety_name,
      });

      if (response.data.status === "success") {
        alert("Rice variety added successfully.");

        // Step 2: Automatically generate the growth stage schedule
        const scheduleResponse = await api.get(
          "/generate_stage_growth_schedule",
          {
            params: {
              rice_variety_name: rice_variety_name,
              rice_land_id: rice_land_id,
            },
          }
        );

        if (scheduleResponse.data.status === "success") {
          alert("Growth stage schedule generated successfully!");
          console.log("Generated Schedule:", scheduleResponse.data.data);
        } else {
          alert(
            "Failed to generate schedule: " + scheduleResponse.data.message
          );
        }
        router.replace(`/(rices)?rice_land_id=${rice_land_id}`);
      } else {
        alert("Adding variety failed. Please try again.");
      }
    } catch (error) {
      console.error("Add error:", error);
      alert("Add failed. Please try again.");
    } finally {
      // Ensure loading is set to false after both API calls have finished
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
