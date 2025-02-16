import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { useRiceLand } from "../../context/RiceLandContext";
import { Calendar } from "react-native-calendars";
import { Text, ActivityIndicator, PaperProvider } from "react-native-paper";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";

const CalendarScreen: React.FC = () => {
  const { riceLandId } = useRiceLand();

  const [growthStages, setGrowthStages] = useState<Array<any>>([]);
  const [advisories, setAdvisories] = useState<Array<any>>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Fetch growth stages & advisories when riceLandId is available
  useEffect(() => {
    if (riceLandId) {
      fetchGrowthStages();
      fetchAdvisories();
    }
  }, [riceLandId]);

  // Fetch Growth Stages
  const fetchGrowthStages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/get_rice_growth_stages/${riceLandId}`);

      if (response.data.status === "success") {
        setGrowthStages(response.data.data);
        mapStagesToCalendar(response.data.data);
      } else {
        console.error("Error fetching growth stages:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Advisories
  const fetchAdvisories = async () => {
    try {
      const response = await api.get(`/get_all_advisories/${riceLandId}`);

      if (response) {
        setAdvisories(response.data);
      } else {
        console.error("Error fetching advisories:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Map growth stages to the calendar
  const mapStagesToCalendar = (stages: any[]) => {
    const marked: { [key: string]: any } = {};

    stages.forEach((stage) => {
      const startDate = new Date(stage.rice_growth_stage_start);
      const endDate = new Date(stage.rice_growth_stage_end);
      const stageColor = getStageColor(stage.rice_growth_stage);

      while (startDate <= endDate) {
        const formattedDate = startDate.toISOString().split("T")[0];

        marked[formattedDate] = {
          selected: true,
          marked: true,
          selectedColor: stageColor,
        };

        startDate.setDate(startDate.getDate() + 1);
      }
    });

    setMarkedDates(marked);
  };

  // Get color based on rice growth stage
  const getStageColor = (stage: string) => {
    const stageColors: { [key: string]: string } = {
      Germination: "#4CAF50", // Green
      "Seeding Establishment": "#FFC107", // Yellow
      Tillering: "#03A9F4", // Blue
      "Panicle Initiation": "#9C27B0", // Purple
      Booting: "#FF9800", // Orange
      Heading: "#F44336", // Red
      Flowering: "#E91E63", // Pink
      "Grain Filling": "#795548", // Brown
      Maturity: "#607D8B", // Gray
    };

    return stageColors[stage] || "#000000"; // Default: Black
  };

  // Display Loading Indicator
  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <PaperProvider theme={customTheme}>
      <View
        style={[
          GlobalStyles.container,
          { alignItems: "center", width: "100%", padding: 0, paddingTop: 10 },
        ]}
      >
        <ScrollView
          contentContainerStyle={GlobalStyles.RiceLandScrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar */}
          <Calendar
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "#E0E0E0",
              width: 340,
              alignSelf: "center",
            }}
            theme={{
              arrowColor: "#4CAF50",
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#000",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#4CAF50",
              dayTextColor: "#000",
              textDisabledColor: "#CBCBCB",
            }}
            markedDates={{
              ...markedDates,
              ...(selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: "#00adf5",
                    },
                  }
                : {}),
            }}
            markingType={"multi-dot"}
            onDayPress={(day) => setSelectedDate(day.dateString)}
          />

          {/* Growth Stages */}
          <View style={[GlobalStyles.Weathercard, { width: 340, marginHorizontal: 10, alignContent: "center", marginBottom:0  }]}>
            <Text style={[GlobalStyles.label, { marginTop: 5 }]}>
              Growth Stages
            </Text>
            {growthStages.map((stage) => (
              <View key={stage.id} style={GlobalStyles.stageContainer}>
                <View
                  style={[
                    GlobalStyles.circle,
                    { backgroundColor: getStageColor(stage.rice_growth_stage) },
                  ]}
                />
                <Text style={GlobalStyles.dataText}>
                  {stage.rice_growth_stage}
                </Text>
              </View>
            ))}
          </View>

          {/* Advisories */}
          <View style={[GlobalStyles.Weathercard, { width: 340, marginHorizontal: 10, alignContent: "center", marginTop: 0 }]}>
            <Text style={[GlobalStyles.label, { marginTop: 5 }]}>
              Advisories
            </Text>
            {selectedDate ? (
              advisories.some((advisory) => advisory.date === selectedDate) ? (
                advisories
                  .filter((advisory) => advisory.date === selectedDate)
                  .map((advisory, index) => {
                    const advisoryMessages = JSON.parse(advisory.advisories);
                    return (
                      <View key={index}>
                        {advisoryMessages.map(
                          (message: string, msgIndex: number) => (
                            <Text key={msgIndex} style={GlobalStyles.dataText}>
                              • {message}
                            </Text>
                          )
                        )}
                      </View>
                    );
                  })
              ) : (
                <Text style={GlobalStyles.dataText}>
                  No advisories for this date.
                </Text>
              )
            ) : (
              <Text style={GlobalStyles.dataText}>
                Select a date to view advisories.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default CalendarScreen;
