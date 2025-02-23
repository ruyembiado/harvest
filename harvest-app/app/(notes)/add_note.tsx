import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import GlobalStyles from "../../assets/styles/styles";
import customTheme from "../../assets/styles/theme";
import api from "../../services/api";

const AddNote: React.FC = () => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContents, setNoteContents] = useState<string[]>([""]); 
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Add a new content field
  const addContentField = () => {
    setNoteContents([...noteContents, ""]);
  };

  // Update a specific content field
  const updateContent = (text: string, index: number) => {
    const updatedContents = [...noteContents];
    updatedContents[index] = text;
    setNoteContents(updatedContents);
  };

  // Delete a content field
  const deleteContentField = (index: number) => {
    if (noteContents.length === 1) {
      Alert.alert("Alert", "At least one note content is required.");
      return;
    }
    const updatedContents = noteContents.filter((_, i) => i !== index);
    setNoteContents(updatedContents);
  };

  const handleAddNote = async () => {
    
    if (!noteTitle) {
      Alert.alert("Alert", "Rice land name is required.");
      return;
    }

    if (noteContents.every((content) => content.trim() === "")) {
      Alert.alert("Alert", "Content field are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/add_note", {
        rice_land_id: id,
        title: noteTitle,
        content: noteContents, 
      });

      router.replace(`/(tabs)/notes?id=${id}`);
      Alert.alert("Success", "Note added successfully.");
    } catch (error) {
      console.error("Add error:", error);
      Alert.alert("Failed", "Could not add note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <View style={[GlobalStyles.TitleContainer]}>
        <Text variant="headlineLarge" style={[GlobalStyles.title]}>
          Add Note
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          GlobalStyles.RiceLandScrollContainer,
          { paddingLeft: 20, paddingRight: 20 },
        ]}
      >
        <View style={[GlobalStyles.FormContainer]}>
          {/* Note Title */}
          <View>
            <Text>Note Title:</Text>
            <TextInput
              label="Enter note title"
              value={noteTitle}
              onChangeText={setNoteTitle}
              mode="outlined"
              style={GlobalStyles.input}
            />
          </View>

          {/* Dynamic Note Content Fields (Textarea) */}
          {noteContents.map((content, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>Note Content {index + 1}:</Text>
              <TextInput
                label="Enter note content"
                value={content}
                onChangeText={(text) => updateContent(text, index)}
                mode="outlined"
                multiline
                numberOfLines={4} // Sets textarea height
                style={[GlobalStyles.input, { minHeight: 100 }]} // Custom styling for textarea
              />
              <Button
                mode="text"
                onPress={() => deleteContentField(index)}
                disabled={noteContents.length === 1}
                style={{ marginTop: 5, alignSelf: "flex-end" }}
              >
                Remove
              </Button>
            </View>
          ))}

          {/* Add Content Button */}
          <Button mode="outlined" onPress={addContentField} style={GlobalStyles.button}>
            + Add More Content
          </Button>

          {/* Submit Button */}
          <Button
            icon="plus"
            mode="contained"
            style={GlobalStyles.button}
            loading={loading}
            disabled={loading}
            onPress={handleAddNote}
          >
            Add Note
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default AddNote;