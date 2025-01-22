import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F3F4F6", // Soft gray background
  },
  card: {
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50", // Green title
    fontSize: 36,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
    marginBottom: 10,
    paddingVertical: 8,
  },
  registerLink: {
    textAlign: "center",
    color: "#4CAF50",
    fontSize: 14,
    textDecorationLine: "underline",
  }
});

export default globalStyles;