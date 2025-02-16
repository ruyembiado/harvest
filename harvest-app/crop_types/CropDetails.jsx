import React from "react";
import { View, Text, StyleSheet } from "react-native";

const cropDetails = {
  "NSIC Rc 222": {
    averageYield: "4.8 t/ha",
    maximumYield: "7.5 t/ha",
    maturity: "106 days after seeding",
    height: "77 cm",
    reactionToPestsAndDiseases:
      "Resistant to blast and brown planthopper. Intermediate reaction to bacterial leaf blight, tungro, and stem borer. Moderately resistant to green leaf hopper.",
    grainSize: "Medium",
    millingRecovery: "66.62%",
    eatingQuality: "Hard",
  },
  "NSIC Rc 216": {
    averageYield: "5.2 t/ha",
    maximumYield: "8.0 t/ha",
    maturity: "110 days after seeding",
    height: "80 cm",
    reactionToPestsAndDiseases:
      "Resistant to blast and bacterial leaf blight. Intermediate reaction to tungro and stem borer. Moderately resistant to green leaf hopper.",
    grainSize: "Medium",
    millingRecovery: "68.5%",
    eatingQuality: "Medium",
  },
  "NSIC Rc 480": {
    averageYield: "5.5 t/ha",
    maximumYield: "8.5 t/ha",
    maturity: "115 days after seeding",
    height: "85 cm",
    reactionToPestsAndDiseases:
      "Resistant to blast and brown planthopper. Intermediate reaction to bacterial leaf blight and tungro. Moderately resistant to stem borer.",
    grainSize: "Long",
    millingRecovery: "70.0%",
    eatingQuality: "Soft",
  },
  "NSIC Rc 10": {
    averageYield: "4.5 t/ha",
    maximumYield: "7.0 t/ha",
    maturity: "100 days after seeding",
    height: "75 cm",
    reactionToPestsAndDiseases:
      "Resistant to blast and green leaf hopper. Intermediate reaction to bacterial leaf blight and tungro. Moderately resistant to stem borer.",
    grainSize: "Short",
    millingRecovery: "65.0%",
    eatingQuality: "Medium",
  },
};

const CropDetails = ({ cropType }) => {
  const details = cropDetails[cropType];

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Crop type not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cropType}</Text>
      <Text style={styles.label}>Average Yield:</Text>
      <Text style={styles.value}>{details.averageYield}</Text>
      <Text style={styles.label}>Maximum Yield:</Text>
      <Text style={styles.value}>{details.maximumYield}</Text>
      <Text style={styles.label}>Maturity:</Text>
      <Text style={styles.value}>{details.maturity}</Text>
      <Text style={styles.label}>Height:</Text>
      <Text style={styles.value}>{details.height}</Text>
      <Text style={styles.label}>Reaction to Pests & Diseases:</Text>
      <Text style={styles.value}>{details.reactionToPestsAndDiseases}</Text>
      <Text style={styles.label}>Grain Size:</Text>
      <Text style={styles.value}>{details.grainSize}</Text>
      <Text style={styles.label}>Milling Recovery:</Text>
      <Text style={styles.value}>{details.millingRecovery}</Text>
      <Text style={styles.label}>Eating Quality:</Text>
      <Text style={styles.value}>{details.eatingQuality}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    marginBottom: 0,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default CropDetails;