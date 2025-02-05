import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { useRiceLand } from "../../context/RiceLandContext";
import { Calendar } from "react-native-calendars";
import { Text, ActivityIndicator, PaperProvider } from "react-native-paper";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";

const CalendarScreen: React.FC = () => {
  const [growthStages, setGrowthStages] = useState<Array<any>>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { riceLandId } = useRiceLand();

  useEffect(() => {
    if (riceLandId) {
      fetchGrowthStages();
    }
  }, [riceLandId]);

  const fetchGrowthStages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/get_rice_growth_stages/${riceLandId}`);

      if (response.data.status === "success") {
        const stages = response.data.data;
        setGrowthStages(stages);
        mapStagesToCalendar(stages);
        console.log(stages);
      } else {
        console.error("Error fetching growth stages:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Germination":
        return "#4CAF50"; // Green
      case "Seeding Establishment":
        return "#FFC107"; // Yellow
      case "Tillering":
        return "#03A9F4"; // Blue
      case "Panicle Initiation":
        return "#9C27B0"; // Purple
      case "Booting":
        return "#FF9800"; // Orange
      case "Heading":
        return "#F44336"; // Red
      case "Flowering":
        return "#E91E63"; // Pink
      case "Grain Filling":
        return "#795548"; // Brown
      case "Maturity":
        return "#607D8B"; // Gray
      default:
        return "#000000"; // Default black
    }
  };

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
          { alignItems: "center", width: "100%", paddingTop: 20 },
        ]}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Calendar
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "#E0E0E0",
              width: 320,
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
            markedDates={markedDates}
            markingType={"multi-dot"} 
          />
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default CalendarScreen;