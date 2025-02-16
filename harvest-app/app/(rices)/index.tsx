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
import CropDetails from "../../crop_types/CropDetails";

const Index: React.FC = () => {
  const [riceVariety, setRiceVariety] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const { rice_land_id } = useLocalSearchParams();

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
                    {/* <ImageBackground
                      source={require("../../assets/images/rice-field.jpg")}
                      style={GlobalStyles.RiceLandItem}
                    >
                      <View style={GlobalStyles.overlay}></View>
                      <Text style={GlobalStyles.RiceLandTitle}>
                        {riceVariety.rice_variety_name}
                      </Text>
                    </ImageBackground> */}
                    <CropDetails cropType={riceVariety.rice_variety_name} />
                  </View>
                ) : (
                  <View style={[GlobalStyles.noDataTextContainer]}>
                    <Text style={[GlobalStyles.dataText]}>
                      No rice variety.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
            <Button
              icon="arrow-left"
              mode="contained"
              style={GlobalStyles.button}
            >
              <Link href={`/(tabs)/?id=${rice_land_id}`}>Back</Link>
            </Button>
          </View>
        </Card.Content>
      </Card>
    </PaperProvider>
  );
};

export default Index;
