import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const ViewLand: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [rice_land_name, setRiceLandName] = React.useState<string>("");
  const [rice_land_lat, setRiceLandLat] = React.useState<string>("");
  const [rice_land_long, setRiceLandLong] = React.useState<string>("");
  const [rice_land_size, setRiceLandSize] = React.useState<string>("");
  const [rice_land_condition, setRiceLandCondition] = React.useState<string>("");
  const [rice_land_current_stage, setRiceLandStage] = React.useState<string>("not_yet_started");
  const [loading, setLoading] = React.useState<boolean>(false);

  const riceLandConditions = [
    { label: "-- Select Condition --", value: "" },
    { label: "Irrigated Lowland Rice", value: "irrigated_lowland_rice" },
    { label: "Rainfed Lowland Rice", value: "rainfed_lowland_rice" },
    { label: "Upland Rice", value: "upland_rice" },
  ];

  const riceLandStages = [
    { label: "Not Yet Started", value: "not_yet_started" },
    { label: "Germination", value: "germination" },
    { label: "Seeding Establishment", value: "seeding_establishment" },
    { label: "Tillering", value: "tillering" },
    { label: "Panicle Initiation", value: "panicle_initiation" },
    { label: "Booting", value: "booting" },
    { label: "Heading", value: "heading" },
    { label: "Flowering", value: "flowering" },
    { label: "Grain Filling", value: "grain_filling" },
    { label: "Maturity", value: "maturity" },
  ];

  // Fetch rice land details for viewing
  useEffect(() => {
    setLoading(true);
    const fetchLandDetails = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/get_rice_land/${id}`);
        const data = response.data;
        setRiceLandName(data.rice_land_name);
        setRiceLandLat(data.rice_land_lat);
        setRiceLandLong(data.rice_land_long);
        setRiceLandSize(data.rice_land_size);
        setRiceLandCondition(data.rice_land_condition);
        setRiceLandStage(data.rice_land_current_stage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching land details:", error);
        Alert.alert("Error", "Unable to fetch land details.");
      }
    };

    fetchLandDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={GlobalStyles.activityIndicator.color}
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={customTheme}>
      <View style={[GlobalStyles.TitleContainer]}>
        <Text variant="headlineLarge" style={[GlobalStyles.title]}>
          {rice_land_name}
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
            <Text style={GlobalStyles.label}>Rice Land Name:</Text>
            <Text style={GlobalStyles.dataText}>{rice_land_name}</Text>
          </View>

          <View>
            <Text style={GlobalStyles.label}>Location:</Text>
            <Text style={[GlobalStyles.dataText, { marginBottom: 0 }]}>Latitude: {rice_land_lat}</Text>
            <Text style={[GlobalStyles.dataText]}>Longitude: {rice_land_long}</Text>
          </View>

          <View>
            <Text style={GlobalStyles.label}>Size of the Land (hectares):</Text>
            <Text style={GlobalStyles.dataText}>{rice_land_size}</Text>
          </View>

          <View>
            <Text style={GlobalStyles.label}>Land Condition:</Text>
            <Text style={GlobalStyles.dataText}>
              {riceLandConditions.find(
                (condition) => condition.value === rice_land_condition
              )?.label || "Not available"}
            </Text>
          </View>

          <View>
            <Text style={GlobalStyles.label}>Current Stage of Rice Growth:</Text>
            <Text style={GlobalStyles.dataText}>
              {riceLandStages.find(
                (stage) => stage.value === rice_land_current_stage
              )?.label || "Not available"}
            </Text>
          </View>

          {/* Optional: You can add a "back" or "edit" button to go back to the list or edit the land */}
          <Button
            icon="arrow-left"
            mode="outlined"
            style={GlobalStyles.button}
            onPress={() => router.back()} // Go back to previous screen
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default ViewLand;