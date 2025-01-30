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
import { Link, useRouter } from "expo-router";
import * as Location from "expo-location";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateLand: React.FC = () => {
  const [rice_land_name, setRiceLandName] = useState<string>("");
  const [rice_land_lat, setRiceLandLat] = useState<string>("");
  const [rice_land_long, setRiceLandLong] = useState<string>("");
  const [rice_land_size, setRiceLandSize] = useState<string>("");
  const [rice_land_condition, setRiceLandCondition] = useState<string>("");
  const [rice_land_current_stage, setRiceLandStage] = useState<string>("not_yet_started");
  const [loading, setLoading] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const router = useRouter();

  const riceLandConditions = [
    { label: "-- Select Condition --", value: "" },
    { label: "Irrigated Lowland Rice", value: "irrigated_lowland_rice" },
    { label: "Rainfed Lowland Rice", value: "rainfed_lowland_rice" },
    { label: "Upland Rice", value: "upland_rice" },
  ];

  const riceLandStages = [
    { label: "Not Yet Started", value: "not_yet_started" },
  ];

  // Fetch current location
  const fetchLocation = async () => {
    setLocationLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      setLocationLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRiceLandLat(location.coords.latitude.toString());
    setRiceLandLong(location.coords.longitude.toString());
    setLocationLoading(false);
  };

  const handleUpdateLand = async () => {
    if (!rice_land_name) {
      alert("Rice land name is required.");
      return;
    }
    if (!rice_land_lat || !rice_land_long) {
      alert("Location coordinates are required.");
      return;
    }
    if (!rice_land_size) {
      alert("Size of the land is required.");
      return;
    }
    if (!rice_land_condition) {
      alert("Land condition is required.");
      return;
    }

    setLoading(true);

    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await api.post("/add_rice_land", {
        user_id,
        rice_land_name,
        rice_land_lat,
        rice_land_long,
        rice_land_size,
        rice_land_condition,
        rice_land_current_stage,
      });

      router.replace("/(lands)");
      Alert.alert("Rice land added Successfully.");
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
          Add Rice Land
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
            <Text>Rice Land Name:</Text>
            <TextInput
              label="Enter rice land name"
              value={rice_land_name}
              onChangeText={setRiceLandName}
              mode="outlined"
              style={GlobalStyles.input}
            />
          </View>

          <View>
            <Text>Location:</Text>
            <TextInput
              label="Enter location (Latitude)"
              value={rice_land_lat}
              onChangeText={setRiceLandLat}
              mode="outlined"
              style={GlobalStyles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Enter location (Longitude)"
              value={rice_land_long}
              onChangeText={setRiceLandLong}
              mode="outlined"
              style={GlobalStyles.input}
              keyboardType="numeric"
            />

            <Button
              style={[GlobalStyles.button, { marginBottom: 10 }]}
              mode="outlined"
              onPress={fetchLocation}
              loading={locationLoading}
              disabled={locationLoading}
              icon={locationLoading ? undefined : "crosshairs-gps"}
            >
              {locationLoading
                ? "Fetching Location..."
                : "Get Current Location"}
            </Button>
          </View>

          <View>
            <Text>Size of the Land (hectares):</Text>
            <TextInput
              label="Enter size of the land (hectares)"
              value={rice_land_size}
              onChangeText={setRiceLandSize}
              mode="outlined"
              style={GlobalStyles.input}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text>Current Stage of Rice Growth:</Text>
            <TextInput
              label="Current Stage"
              value={
                riceLandStages.find(
                  (stage) => stage.value === rice_land_current_stage
                )?.label || ""
              }
              mode="outlined"
              disabled
              style={GlobalStyles.input}
            />
          </View>

          <View>
            <Text>Select Land Condition:</Text>
            <Picker
              selectedValue={rice_land_condition}
              onValueChange={(itemValue) => setRiceLandCondition(itemValue)}
              style={{ height: 50, width: 250 }}
            >
              {riceLandConditions.map((condition) => (
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
            onPress={handleUpdateLand}
          >
            Add Land
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default UpdateLand;
