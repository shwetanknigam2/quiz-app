import axios from "axios";

const API_URL = "https://thingproxy.freeboard.io/fetch/https://api.jsonserve.com/Uw5CrX";

export const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL);
    const rawQuestions = response.data.questions || [];

    // Transform data into proper format
    const formattedQuestions = rawQuestions.map((q) => ({
      question: q.description, // Extract question text
      options: q.options.map((opt) => opt.description), // Extract choices as strings
      correct_answer: q.options.find((opt) => opt.is_correct)?.description || "",
    }));

    return formattedQuestions;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }
};
