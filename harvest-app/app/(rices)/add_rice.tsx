import React, { useState } from "react";
import { View, ScrollView, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Provider as PaperProvider,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const AddRice: React.FC = () => {
  const [rice_variety_name, setRiceVariety] = React.useState<string>("");
  const [planting_date, setPlantingDate] = React.useState(new Date());
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { rice_land_id } = useLocalSearchParams();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Hide the date picker
    if (selectedDate) {
      setPlantingDate(selectedDate);
    }
  };

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
    if (!planting_date) {
      alert("Please select a planting date.");
      return;
    }

    // Format the date to "YYYY-MM-DD"
    const formattedDate = planting_date.toISOString().split("T")[0];
    console.log(formattedDate);

    setLoading(true);

    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) return;
      if (!rice_land_id) return;

      // Step 1: Add the rice variety with planting date
      const response = await api.post("/add_rice_variety", {
        rice_land_id,
        rice_variety_name,
      });

      if (response.data.status === "success") {
        alert("Rice variety added successfully.");

        // Step 2: Generate growth stage schedule
        const scheduleResponse = await api.get(
          "/generate_stage_growth_schedule",
          {
            params: {
              rice_variety_name,
              rice_land_id,
              planting_date: formattedDate,
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
              {riceVarities.map((variety) => (
                <Picker.Item
                  label={variety.label}
                  value={variety.value}
                  key={variety.value}
                />
              ))}
            </Picker>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text>Select Planting Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text
                style={[
                  GlobalStyles.dataText,
                  { padding: 10, borderWidth: 1, borderRadius: 5, margin: 10 },
                ]}
              >
                {planting_date.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={planting_date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
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
