const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace with your actual API key for testing
const API_KEY = "your-api-key-here";

async function testAPI() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    // List available models
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    const result = await model.generateContent("Hello, test message");
    const response = await result.response;
    console.log("Success! Response:", response.text());
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Status:", error.status);
    console.error("Details:", error);
  }
}

testAPI();
