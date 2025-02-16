import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, FlatList } from "react-native";
import { Text, ActivityIndicator, PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRiceLand } from "../../context/RiceLandContext";
import api from "../../services/api";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";

const WeatherScreen: React.FC = () => {
  const { riceLandId, setRiceLandId } = useRiceLand();
  const [landLoading, setLandLoading] = useState<boolean>(false);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [rice_land_lat, setRiceLandLat] = useState<string | null>(null);
  const [rice_land_long, setRiceLandLong] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<Array<any>>([]);
  const [current_weather_temperature, setCurrentWeatherTemp] =
    useState<any>(null);

  useEffect(() => {
    const fetchLandDetails = async () => {
      if (!riceLandId) return;
      setLandLoading(true);
      try {
        const response = await api.get(`/get_rice_land/${riceLandId}`);
        const data = response.data;
        if (data && data.rice_land_lat && data.rice_land_long) {
          setRiceLandId(data.id);
          setRiceLandLat(data.rice_land_lat);
          setRiceLandLong(data.rice_land_long);
        } else {
          throw new Error("Invalid land data received");
        }
      } catch (error) {
        console.error("Error fetching land details:", error);
        Alert.alert("Error", "Unable to fetch land details.");
      } finally {
        setLandLoading(false);
      }
    };

    fetchLandDetails();
  }, [riceLandId]);

  useEffect(() => {
    if (rice_land_lat && rice_land_long) {
      fetchWeatherData();
    }
  }, [rice_land_lat, rice_land_long]);

  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${rice_land_lat}&longitude=${rice_land_long}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunshine_duration,weathercode&timezone=auto&current_weather=true`
      );
      const data = await response.json();

      if (!data || !data.daily || !data.daily.time) {
        throw new Error("Invalid API response structure");
      }

      setCurrentWeatherTemp(data.current_weather.temperature);

      const transformedData = data.daily.time.map((date, index) => ({
        date,
        high: data.daily.temperature_2m_max?.[index] ?? "N/A",
        low: data.daily.temperature_2m_min?.[index] ?? "N/A",
        rain: `${data.daily.precipitation_sum?.[index] ?? 0} mm`,
        wind: `${data.daily.windspeed_10m_max?.[index] ?? "N/A"} km/h`,
        sun: `${Math.round(
          (data.daily.sunshine_duration?.[index] ?? 0) / 3600
        )}h`,
        weatherCode: data.daily.weathercode?.[index] ?? 0,
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      }));

      // Map weather codes to icons
      const updatedWeatherData = transformedData.map((item) => ({
        ...item,
        icon: getWeatherIcon(item.weatherCode),
      }));

      setWeatherData(updatedWeatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      Alert.alert("Error", "Unable to fetch weather data. Please try again.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const weatherIcons = {
    0: "weather-sunny", // Clear sky
    1: "weather-partly-cloudy", // Mainly clear
    2: "weather-cloudy", // Partly cloudy
    3: "weather-cloudy", // Overcast
    45: "weather-fog", // Fog
    48: "weather-fog", // Depositing rime fog
    51: "weather-rainy", // Drizzle: Light
    53: "weather-rainy", // Drizzle: Moderate
    55: "weather-rainy", // Drizzle: Dense
    61: "weather-rainy", // Rain: Slight
    63: "weather-pouring", // Rain: Moderate
    65: "weather-pouring", // Rain: Heavy
    80: "weather-rainy", // Showers: Slight
    81: "weather-rainy", // Showers: Moderate
    82: "weather-pouring", // Showers: Heavy
    95: "weather-lightning", // Thunderstorm: Slight
    96: "weather-lightning-rainy", // Thunderstorm: Moderate
    99: "weather-lightning-rainy", // Thunderstorm: Heavy
  };

  const getWeatherIcon = (code: number) => {
    return weatherIcons[code] || "weather-cloudy";
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <PaperProvider theme={customTheme}>
      <View style={styles.container}>
        {landLoading || weatherLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={GlobalStyles.activityIndicator.color}
            />
          </View>
        ) : (
          <FlatList
            data={weatherData}
            style={{ padding: 10, paddingTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.Weathercard}>
                <View style={styles.row}>
                  <Text style={styles.day}>{item.day}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <View style={styles.row}>
                  <Icon
                    name={item.icon}
                    size={40}
                    color="#FFD700"
                    style={styles.icon}
                  />
                  {item.date === today && (
                    <View style={styles.tempContainer}>
                      <Text style={styles.highTemp}>
                        🌡️{current_weather_temperature}°C
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.info}>
                  🌡️ Highest Temperature: {item.high}°C
                </Text>
                <Text style={styles.info}>
                  🌡️ Lowest Temperature: {item.low}°C
                </Text>
                <Text style={styles.info}>🌬️ Wind: {item.wind}</Text>
                <Text style={styles.info}>💧 Rain: {item.rain}</Text>
                <Text style={styles.info}>☀️ Sunshine: {item.sun}</Text>
              </View>
            )}
          />
        )}
      </View>
    </PaperProvider>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Weathercard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#F9F9F9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  icon: {
    marginRight: 10,
  },
  tempContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  highTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100",
    marginRight: 5,
  },
  lowTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0277BD",
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});