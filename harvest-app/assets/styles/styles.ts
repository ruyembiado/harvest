import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F3F4F6", 
  },

  RiceLandScrollContainer: {
    flexGrow: 1,
    gap: 10,
    paddingBottom: 20
  },
  RiceLandItem: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  RiceLandContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  RiceLandCard: {
    width: "100%",
    height: "100%",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", 
    borderRadius: 0,
  },

  card: {
    width: "95%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50",
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
  addButton: {
    marginTop: 5,
    marginBottom: 10,
    width: 100,
    alignSelf: "flex-end",
    backgroundColor: "#00009F",
  },
  deleteButton: {
    width: 100,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#B50E2C",
  },
  registerLink: {
    textAlign: "center",
    color: "#4CAF50",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  textCenter: {
    textAlign: "center", 
  },
  TermsButtonContainer: {
    paddingTop: 50,
  }
});

export default globalStyles;