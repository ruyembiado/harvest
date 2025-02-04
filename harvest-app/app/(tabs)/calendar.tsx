import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Text,
  Button,
  Menu,
  Divider,
  IconButton,
  ActivityIndicator,
  PaperProvider,
  Card,
} from "react-native-paper";
import * as Location from "expo-location";
import { Calendar } from "react-native-calendars";
import { useRiceLand } from "../../context/RiceLandContext";

const CalendarScreen: React.FC = () => {
  const [growthStages, setGrowthStages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { riceLandId } = useRiceLand();

  console.log(riceLandId);

  const fetchGrowthStages = async () => {
    if (!riceLandId) return;
    try {
      setLoading(true);
      const response = await api.get(`/get_rice_growth_stages/${riceLandId}`);

      if (response.data.status === "success") {
        setGrowthStages(response.data.data);
      } else {
        console.error("Error fetching growth stages:", response.data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthStages();
  }, [riceLandId]);

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={customTheme}>
      <View
        style={[
          GlobalStyles.container,
          {
            alignItems: "center",
            justifyContent: "flex-start",
            paddingBottom: 10,
            width: "100%",
          },
        ]}
      >
        <Text style={[GlobalStyles.label, { paddingBottom: 10 }]}>
          RICE GROWTH STAGES
        </Text>
        <ScrollView
          contentContainerStyle={[GlobalStyles.RiceLandScrollContainer]}
          showsVerticalScrollIndicator={false}
        >
          {growthStages.length > 0 ? (
            growthStages.map((stage, index) => (
              <View key={index} style={{ width: "300" }}>
                <View style={[GlobalStyles.mainDetailContainer]}>
                  <Text style={GlobalStyles.label}>
                    {stage.rice_growth_stage}
                  </Text>
                  <Text style={[GlobalStyles.dataText]}>
                    Start: {stage.rice_growth_stage_start}
                  </Text>
                  <Text style={[GlobalStyles.dataText]}>
                    Start: {stage.rice_growth_stage_end}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={GlobalStyles.noDataText}>
              No growth stages available.
            </Text>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default CalendarScreen;
