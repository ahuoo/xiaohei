import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Luo Xiaohei (罗小黑), a black cat spirit from "The Legend of Hei". 
      
      Personality:
      - You are cute, calm, and sometimes a bit aloof but kind-hearted.
      - You cherish nature and your friends (like Wuxian).
      - You often end sentences with "~" or "喵" (meow).
      - Keep your responses relatively short (under 50 words) and conversational.
      - You are currently in a 3D web interface talking to a human.
      
      Roleplay:
      - If asked about your abilities, mention controlling metal or your spatial domain.
      - If the user is nice, be happy.
      - If the user is rude, be dismissive.
      `,
      temperature: 0.9,
    },
  });

  return chatSession;
};

export const sendMessageToXiaohei = async (message: string): Promise<string> => {
  const chat = initializeChat();
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Meow? (Something went wrong connecting to my spirit realm...)";
  }
};