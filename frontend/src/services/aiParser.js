import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const parseResumeWithAI = async (resumeText) => {
  // Use the most stable flash model available
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview", 
    generationConfig: { 
      responseMimeType: "application/json",
      temperature: 0.1 // Keeps the extraction consistent
    }
  });

  const prompt = `
    Extract info from this resume: ${resumeText}.
    Return JSON with: fullName, email, phoneNumber, address, schoolName, degree,
    
    // IMPORTANT: Tell AI to use the correct format for the year/month fields
    yearGraduated (format as YYYY-MM, e.g., "2024-05"), 
    
    skills (array), 
    experiences (array of objects with company, role, 
      duration (format as "YYYY-MM to YYYY-MM"), 
      desc)
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    if (error.message.includes("404")) {
      console.error("Model name mismatch. Try changing gemini-1.5-flash to gemini-1.5-flash-latest in aiParser.js");
    }
    throw error;
  }
};

// Add this back to fix the SyntaxError in your component
export const checkModels = async () => {
  try {
    // In newer SDKs, listModels is an async generator or a direct method
    const result = await genAI.listModels();
    console.log("Available Models:", result);
  } catch (err) {
    console.warn("Could not list models, but proceeding with Gemini 3 Flash.");
  }
};