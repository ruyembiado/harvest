import React, { useEffect } from "react";
import { View, ImageBackground, ScrollView } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Checkbox,
  Card,
  Button,
} from "react-native-paper";
import { Link } from "expo-router";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  return (
    <PaperProvider theme={customTheme}>
      <Card style={GlobalStyles.RiceLandCard}>
        <Card.Content>
          <View style={GlobalStyles.RiceLandContainer}>
            <Text
              variant="headlineLarge"
              style={[
                GlobalStyles.title,
              ]}
            >
              Rice Lands
            </Text>
            <View>
              <Button
                mode="contained"
                style={[
                  GlobalStyles.addButton,
                  { marginBottom: 20, marginTop: 20 },
                ]}
              >
                <Link href="/(lands)/add_land">Add</Link>
              </Button>
              <ScrollView
                contentContainerStyle={GlobalStyles.RiceLandScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <Link href="/(tabs)">
                  <ImageBackground
                    source={require("../../assets/images/rice-field.jpg")}
                    style={GlobalStyles.RiceLandItem}
                  >
                    <Button
                      mode="contained"
                      style={[GlobalStyles.deleteButton]}
                    >
                      Delete
                    </Button>
                    <Text style={GlobalStyles.RiceLandTitle}>AMAR</Text>
                  </ImageBackground>
                </Link>
                <Link href="/(tabs)">
                  <ImageBackground
                    source={require("../../assets/images/rice-field.jpg")}
                    style={GlobalStyles.RiceLandItem}
                  >
                    <Button
                      mode="contained"
                      style={[GlobalStyles.deleteButton]}
                    >
                      Delete
                    </Button>
                    <Text
                      style={{
                        color: "#000",
                        zIndex: 1,
                        fontWeight: 700,
                        textShadowColor: "#fff",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                        fontSize: 30,
                        textAlign: "center",
                      }}
                    >
                      AMAR
                    </Text>
                  </ImageBackground>
                </Link>
                <Link href="/(tabs)">
                  <ImageBackground
                    source={require("../../assets/images/rice-field.jpg")}
                    style={GlobalStyles.RiceLandItem}
                  >
                    <Button
                      mode="contained"
                      style={[GlobalStyles.deleteButton]}
                    >
                      Delete
                    </Button>
                    <Text
                      style={{
                        color: "#000",
                        zIndex: 1,
                        fontWeight: 700,
                        textShadowColor: "#fff",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                        fontSize: 30,
                        textAlign: "center",
                      }}
                    >
                      AMAR
                    </Text>
                  </ImageBackground>
                </Link>
                <Link href="/(tabs)">
                  <ImageBackground
                    source={require("../../assets/images/rice-field.jpg")}
                    style={GlobalStyles.RiceLandItem}
                  >
                    <Button
                      mode="contained"
                      style={[GlobalStyles.deleteButton]}
                    >
                      Delete
                    </Button>
                    <Text
                      style={{
                        color: "#000",
                        zIndex: 1,
                        fontWeight: 700,
                        textShadowColor: "#fff",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                        fontSize: 30,
                        textAlign: "center",
                      }}
                    >
                      AMAR
                    </Text>
                  </ImageBackground>
                </Link>
              </ScrollView>
            </View>
          </View>
        </Card.Content>
      </Card>
    </PaperProvider>
  );
}
