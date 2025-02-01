import axios from "axios";

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; 

export async function getAgricultureAdvisoryFromOpenAI(
  cropType: string,
  weather: {
    temperature: number;
    precipitation: number;
    humidity: number;
    windspeed: number;
    weathercode: number;
  }
): Promise<string> {
  const prompt = `You are an agriculture expert. Provide an agriculture advisory for a ${cropType} crop given the following weather conditions:
  - Temperature: ${weather.temperature}°C
  - Precipitation: ${weather.precipitation} mm
  - Humidity: ${weather.humidity}%
  - Wind Speed: ${weather.windspeed} km/h
  - Weather Code: ${weather.weathercode}
  
  Provide a detailed advisory message with recommendations for irrigation, fertilizer, and general crop care.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are an agriculture expert." }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    const advisoryMessage = response.data.choices[0].message.content.trim();
    return advisoryMessage;
  } catch (error) {
    console.error("Error fetching advisory from OpenAI:", error);
    return "Unable to generate advisory at this time.";
  }
}