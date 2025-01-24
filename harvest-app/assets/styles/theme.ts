import {
  DefaultTheme,
} from "react-native-paper";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4CAF50", // Green for buttons and outlines
    text: "#008640", // Green for text
    background: "#F3F4F6", // Soft gray background
  },
};

export default customTheme;