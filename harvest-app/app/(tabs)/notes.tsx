import React, { useState, useCallback } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import { Button, PaperProvider, ActivityIndicator } from "react-native-paper";
import GlobalStyles from "@/assets/styles/styles";
import customTheme from "@/assets/styles/theme";
import { useRiceLand } from "../../context/RiceLandContext";
import api from "@/services/api";
import { Link, useLocalSearchParams, useFocusEffect } from "expo-router";

const NotesScreen: React.FC = () => {
  const { riceLandId } = useRiceLand();
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<Array<any>>([]);
  const { id } = useLocalSearchParams();
  const ID = riceLandId || id;

  const fetchNotes = async () => {
    setLoading(true);

    if (!ID) {
      console.warn("No riceLandId or id found, skipping fetch.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching notes for rice land id:", ID);
      const response = await api.get(`/get_notes/${ID}/`);
      console.log("API Response:", response.data);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      Alert.alert("Error", "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [id, riceLandId])
  );

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
      <View
        style={[
          GlobalStyles.container,
          { alignItems: "center", width: "100%", paddingTop: 10, },
        ]}
      >
        <Button
          mode="contained"
          style={{
            marginTop: 5,
            marginBottom: 15,
            marginEnd: 0,
            width: 150,
            alignSelf: "flex-end",
            backgroundColor: "#00009F",
          }}
        >
          <Link href={`/(notes)/add_note?id=${ID}`} style={{ color: "#fff" }}>
            Add Notes
          </Link>
        </Button>
        <ScrollView
          contentContainerStyle={[
            GlobalStyles.RiceLandScrollContainer,
            { paddingBottom: 10 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {notes.length > 0 ? (
            notes.map((note) => {
              const contentArray = (() => {
                try {
                  return typeof note.content === "string"
                    ? JSON.parse(note.content)
                    : note.content || [];
                } catch {
                  return [];
                }
              })();

              return (
                <View
                  key={note.id}
                  style={[
                    GlobalStyles.Weathercard,
                    { width: 330, marginTop: 0, marginBottom: 0 },
                  ]}
                >
                  <Text style={[GlobalStyles.label]}>{note.title}</Text>
                  {contentArray.length > 0 ? (
                    contentArray.map((item, index) => (
                      <Text key={index} style={[GlobalStyles.dataText]}>
                        - {item}
                      </Text>
                    ))
                  ) : (
                    <Text style={[GlobalStyles.dataText]}>
                      No content available.
                    </Text>
                  )}
                </View>
              );
            })
          ) : (
            <View style={[GlobalStyles.noDataTextContainer]}>
              <Text style={[GlobalStyles.dataText]}>No note available.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default NotesScreen;
