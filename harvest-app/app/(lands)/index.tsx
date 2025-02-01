import React, { useState, useEffect } from "react";
import { View, ImageBackground, ScrollView, Alert } from "react-native";
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
import GlobalStyles from "../../assets/styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import customTheme from "../../assets/styles/theme";
import { Link, useRouter } from "expo-router";
import getUserIdOrLogout from "@/hooks/getUserIdOrLogout";

const Index: React.FC = () => {
  const [riceLands, setRiceLands] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState(false); // State to control Menu visibility
  const [selectedLandId, setSelectedLandId] = React.useState<string | null>(null); // State for the selected land
  const router = useRouter();

  const fetchRiceLands = async () => {
    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) {
        return;
      }

      const response = await api.post("/rice_lands", {
        user_id,
      });

      if (response.status === 200) {
        console.log("Rice Lands:", response.data.lands);
        setRiceLands(response.data.lands);
      } else {
        console.error("Error fetching rice lands:", response.data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRiceLand = async (id: string) => {
    try {
      const user_id = await getUserIdOrLogout(router);
      if (!user_id) {
        return;
      }

      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this rice land?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              const response = await api.delete("/delete_rice_land/", {
                data: {
                  id,
                  user_id
                }
              });
              if (response.status === 200) {
                alert("Rice land deleted successfully!");
                console.log("Rice land deleted successfully!");
                fetchRiceLands();
              } else {
                console.error("Error deleting rice land:", response.data.error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiceLands();
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
          Rice Lands
        </Text>
      </View>
      <Card style={GlobalStyles.RiceLandCard}>
        <Card.Content>
          <View style={[GlobalStyles.RiceLandContainer]}>
            <View>
              <Button
                mode="contained"
                style={[GlobalStyles.addButton, { marginBottom: 20 }]}
              >
                <Link href="/(lands)/add_land">Add</Link>
              </Button>
              <ScrollView
                contentContainerStyle={GlobalStyles.RiceLandScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {riceLands.length > 0 ? (
                  riceLands.map((land) => (
                    <View key={land.id}>
                      <ImageBackground
                        source={require("../../assets/images/rice-field.jpg")}
                        style={GlobalStyles.RiceLandItem}
                      >
                        <View style={GlobalStyles.overlay}></View>
                        <View style={[GlobalStyles.moreOptionsButtonContainer]}>
                          <Menu
                            visible={visible && selectedLandId === land.id}
                            onDismiss={() => setVisible(false)}
                            anchor={
                              <IconButton
                                icon="dots-vertical"
                                onPress={() => {
                                  setSelectedLandId(land.id);
                                  setVisible(true);
                                }}
                                style={[GlobalStyles.menuButton]}
                                iconColor="#fff"
                              />
                            }
                          >
                            <Menu.Item
                              onPress={() => {
                                setVisible(false);
                                router.push(
                                  `/(tabs)/?id=${land.id}`
                                );
                              }}
                              title="View"
                            />
                            <Menu.Item
                              onPress={() => {
                                setVisible(false);
                                router.push(
                                  `/(lands)/view_land?id=${land.id}`
                                );
                              }}
                              title="Details"
                            />
                            <Menu.Item
                              onPress={() => {
                                setVisible(false);
                                router.push(
                                  `/(lands)/update_land?id=${land.id}`
                                );
                              }}
                              title="Update"
                            />
                            <Divider />
                            <Menu.Item
                              onPress={() => {
                                setVisible(false);
                                deleteRiceLand(land.id);
                              }}
                              title="Delete"
                            />
                          </Menu>
                        </View>
                        <Text style={GlobalStyles.RiceLandTitle}>
                          {land.rice_land_name}
                        </Text>
                      </ImageBackground>
                    </View>
                  ))
                ) : (
                  <View style={[GlobalStyles.noDataTextContainer]}>
                    <Text style={[GlobalStyles.noDataText]}>
                      No rice lands available.
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
