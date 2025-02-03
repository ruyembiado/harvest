import React, { useState, useEffect } from "react";
import { View, ImageBackground, ScrollView, Alert } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  PaperProvider,
  Card,
} from "react-native-paper";
import GlobalStyles from "../../assets/styles/styles";
import api from "../../services/api";
import customTheme from "../../assets/styles/theme";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const Index: React.FC = () => {
  const [riceVariety, setRiceVariety] = useState<any>(null); // Now it's a single object
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { rice_land_id } = useLocalSearchParams();

  const riceVarities = [
    { label: "-- Select Variety --", value: "" },
    { label: "NSIC Rc 222", value: "nsic_rc_222" },
    { label: "NSIC Rc 216", value: "nsic_rc_216" },
    { label: "NSIC Rc 480", value: "nsic_rc_480" },
    { label: "NSIC Rc 10", value: "nsic_rc_10" },
  ];

  const fetchRiceVariety = async () => {
    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) return;

      if (!rice_land_id) return;

      console.log(rice_land_id);

      const response = await api.get(`/get_rice_variety/${rice_land_id}`);

      if (response.status === 200) {
        console.log("Rice Variety:", response.data.variety);
        setRiceVariety(response.data.variety);
      } else {
        console.error("Error fetching rice variety:", response.data.error);
        setRiceVariety(null);
      }
    } catch (error) {
      console.error("Network error:", error);
      setRiceVariety(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiceVariety();
  }, []);

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
          Rice Variety
        </Text>
      </View>
      <Card style={GlobalStyles.RiceLandCard}>
        <Card.Content>
          <View style={[GlobalStyles.RiceLandContainer]}>
            <View>
              {!riceVariety && ( 
                <Button
                  mode="contained"
                  style={[GlobalStyles.addButton, { marginBottom: 20 }]}
                >
                  <Link href={`/(rices)/add_rice?rice_land_id=${rice_land_id}`}>
                    Add
                  </Link>
                </Button>
              )}
              <ScrollView
                contentContainerStyle={GlobalStyles.RiceLandScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {riceVariety ? (
                  <View key={riceVariety.id}>
                    <ImageBackground
                      source={require("../../assets/images/rice-field.jpg")}
                      style={GlobalStyles.RiceLandItem}
                    >
                      <View style={GlobalStyles.overlay}></View>
                      <Text style={GlobalStyles.RiceLandTitle}>
                        {riceVarities.find(
                          (stage) =>
                            stage.value === riceVariety.rice_variety_name
                        )?.label || "Not available"}
                      </Text>
                    </ImageBackground>
                  </View>
                ) : (
                  <View style={[GlobalStyles.noDataTextContainer]}>
                    <Text style={[GlobalStyles.noDataText]}>
                      No rice variety.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Card.Content>
      </Card>
    </PaperProvider>
  );
};

export default Index;
