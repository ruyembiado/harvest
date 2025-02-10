import { View, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Text, ActivityIndicator, PaperProvider } from "react-native-paper";

export default function Index() {
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [rice_land_id, setRiceLandId] = useState<string>("");
  const [rice_land_lat, setRiceLandLat] = useState<string>("");
  const [rice_land_long, setRiceLandLong] = useState<string>("");
  const [rice_land_size, setRiceLandSize] = useState<string>("");
  const [rice_land_condition, setRiceLandCondition] = useState<string>("");
  const [rice_variety, setRiceVariety] = useState<string>("");
  const [rice_land_current_stage, setRiceLandStage] = useState<string>("");
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { land_id } = useLocalSearchParams();

  const today = new Date().toISOString().split("T")[0];
  console.log(today);
  // Fetch advisories
  const fetchAdvisories = async (
    landId: string,
    isGenerating: boolean = false
  ) => {
    if (!landId) return;
    try {
      const response = await api.get(`/get_advisories_today/${landId}`);
      const data = response.data;
      setAdvisories(data);

      if (data.length > 0) {
        if (!isGenerating) {
          Alert.alert(
            "Advisory Alert",
            "There are advisories for today. Please check them."
          );
        }
      } else {
        if (!isGenerating) {
          Alert.alert(
            "Advisory Alert",
            "No advisories found. Generating advisory..."
          );
          generateAdvisory(landId);
        }
      }
    } catch (error) {
      console.error("Error fetching advisories:", error);
      Alert.alert("Error", "Unable to fetch advisories.");
    }
  };

  // Generate advisories
  const generateAdvisory = async (landId: string) => {
    setLoading(true);
    try {
      const response = await api.post("/generate_advisories", {
        rice_land_id: landId,
        rice_land_size,
        rice_land_condition,
        rice_land_current_stage,
        rice_variety,
        weatherData,
        today,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Advisory has been generated successfully.");
        fetchAdvisories(landId, true); // Pass true to prevent duplicate alerts
      } else {
        Alert.alert("Error", "Failed to generate advisory. Please try again.");
      }
    } catch (error) {
      console.error("Error generating advisory:", error);
      Alert.alert(
        "Error",
        "Something went wrong while generating the advisory."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch land details
  const fetchLandDetails = async () => {
    if (!land_id) return;
    setLoading(true);
    try {
      const response = await api.get(`/get_rice_land/${land_id}`);
      const data = response.data;
      console.log(data);
      setRiceLandId(data.id);
      setRiceLandLat(data.rice_land_lat);
      setRiceLandLong(data.rice_land_long);
      setRiceLandSize(data.rice_land_size);
      setRiceLandCondition(data.rice_land_condition);
      setRiceLandStage(data.rice_land_current_stage);
      setRiceVariety(data.rice_variety.rice_variety_name);
      setLoading(false);

      // Fetch advisories after setting land details
      fetchAdvisories(data.id);
    } catch (error) {
      console.error("Error fetching land details:", error);
      Alert.alert("Error", "Unable to fetch land details.");
    }
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const response = await api.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${rice_land_lat}&longitude=${rice_land_long}&current_weather=true`
      );
      setWeatherData(response.data.current_weather);
      setWeatherLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      Alert.alert("Error", "Unable to fetch weather data.");
    }
  };

  // Fetch land details when component mounts
  useEffect(() => {
    fetchLandDetails();
  }, []);

  // Fetch weather data when latitude & longitude are available
  useEffect(() => {
    if (rice_land_lat && rice_land_long) {
      fetchWeatherData();
    }
  }, [rice_land_lat, rice_land_long]);

  // Map weather codes to icons
  const getWeatherIcon = (weatherCode: number) => {
    const weatherIcons: { [key: number]: string } = {
      0: "weather-sunny",
      1: "weather-partly-cloudy",
      2: "weather-cloudy",
      3: "weather-cloudy",
      45: "weather-fog",
      48: "weather-fog",
      51: "weather-rainy",
      53: "weather-rainy",
      55: "weather-rainy",
      61: "weather-pouring",
      63: "weather-pouring",
      65: "weather-pouring",
      66: "weather-snowy-rainy",
      67: "weather-snowy-rainy",
      71: "weather-snowy",
      73: "weather-snowy",
      75: "weather-snowy",
      80: "weather-pouring",
      81: "weather-pouring",
      82: "weather-pouring",
      95: "weather-lightning",
      96: "weather-lightning-rainy",
      99: "weather-lightning-rainy",
    };

    return weatherIcons[weatherCode] || "weather-cloudy"; // Default icon
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PaperProvider theme={customTheme}>
      <View
        style={[
          GlobalStyles.container,
          { alignItems: "center", justifyContent: "flex-start" },
        ]}
      >
        {loading ? (
          <View style={GlobalStyles.loadingContainer}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={GlobalStyles.activityIndicator.color}
            />
          </View>
        ) : (
          <>
            {weatherLoading ? (
              <View style={GlobalStyles.loadingContainer}>
                <ActivityIndicator
                  animating={true}
                  size="large"
                  color={GlobalStyles.activityIndicator.color}
                />
              </View>
            ) : weatherData ? (
              <>
                <View
                  style={[
                    GlobalStyles.mainDetailContainer,
                    {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      alignSelf: "flex-start",
                      marginBottom: 10,
                      width: "100%",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[GlobalStyles.dataText]}>{formattedDate}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Icon
                      name={getWeatherIcon(weatherData.weathercode)}
                      size={40}
                      color="#FFD700"
                    />
                    <Text style={[GlobalStyles.dataText, { fontSize: 28 }]}>
                      {weatherData.temperature}°C
                    </Text>
                  </View>
                  <View>
                    <Text style={[GlobalStyles.dataText]}>
                      {rice_land_current_stage}
                    </Text>
                    <Text
                      style={[GlobalStyles.dataText, { fontWeight: "700" }]}
                    >
                      {rice_variety}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text>No data available</Text>
            )}
          </>
        )}
      </View>
    </PaperProvider>
  );
}
