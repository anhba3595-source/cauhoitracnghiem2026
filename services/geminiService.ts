
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateMathQuiz = async (topic: string): Promise<Question[]> => {
  // Khởi tạo instance mới mỗi lần gọi để đảm bảo lấy đúng API Key mới nhất từ môi trường
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  if (!process.env.API_KEY) {
    throw new Error("Không tìm thấy API Key. Vui lòng cấu hình API_KEY trong Environment Variables trên Vercel và Redeploy.");
  }

  const prompt = `Bạn là một giáo viên Toán cấp Trung học cơ sở (THCS) dày dạn kinh nghiệm tại Việt Nam. 
  Hãy tạo 10 câu hỏi trắc nghiệm khách quan (MCQ) về chủ đề: "${topic}".
  
  Yêu cầu:
  1. Nội dung phù hợp với chương trình GDPT mới cấp THCS (Lớp 6, 7, 8, hoặc 9).
  2. Mỗi câu hỏi có đúng 4 lựa chọn.
  3. Độ khó phân bổ: 4 câu dễ (nhận biết), 3 câu trung bình (thông hiểu), 2 câu khá (vận dụng), 1 câu khó (vận dụng cao).
  4. Sử dụng ngôn ngữ tiếng Việt chuẩn, ký hiệu toán học dễ hiểu (ví dụ x^2 cho x bình phương, sqrt(x) cho căn bậc hai nếu cần).
  5. Cung cấp lời giải chi tiết cho mỗi câu hỏi.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "Nội dung câu hỏi toán học",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 lựa chọn trả lời",
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "Chỉ số của đáp án đúng (0-3)",
              },
              explanation: {
                type: Type.STRING,
                description: "Lời giải chi tiết cho câu hỏi",
              },
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
          },
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Không nhận được dữ liệu từ AI.");
    }

    return JSON.parse(jsonStr) as Question[];
  } catch (error: any) {
    if (error.message?.includes("API key not found")) {
        throw new Error("API Key không hợp lệ hoặc chưa được cấu hình đúng trên Vercel.");
    }
    console.error("Error generating quiz:", error);
    throw error;
  }
};
