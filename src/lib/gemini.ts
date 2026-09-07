import { GoogleGenAI, Type } from "@google/genai";

let _client: GoogleGenAI | null = null;

function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

const segmentEnum = { type: Type.STRING, enum: ["under", "standard", "over"] };

const segmentsSchema = {
  type: Type.OBJECT,
  properties: {
    leftArm: segmentEnum,
    rightArm: segmentEnum,
    trunk: segmentEnum,
    leftLeg: segmentEnum,
    rightLeg: segmentEnum,
  },
};

const inbodySchema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING, nullable: true, description: "yyyy-MM-dd, from the printed date on the report" },
    weightKg: { type: Type.NUMBER, nullable: true },
    bmi: { type: Type.NUMBER, nullable: true },
    bodyFatKg: { type: Type.NUMBER, nullable: true },
    bodyFatPercent: { type: Type.NUMBER, nullable: true },
    skeletalMuscleKg: { type: Type.NUMBER, nullable: true },
    visceralFatLevel: { type: Type.NUMBER, nullable: true },
    bmrKcal: { type: Type.NUMBER, nullable: true },
    desirableWeightKg: { type: Type.NUMBER, nullable: true },
    segmentFat: { ...segmentsSchema, nullable: true },
    segmentMuscle: { ...segmentsSchema, nullable: true },
  },
};

export async function extractInbodyFromImage(imageBase64: string, mimeType: string) {
  const client = getClient();

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          {
            text: `Đây là ảnh chụp tờ kết quả đo máy InBody (body composition analyzer).
Đọc và trích xuất các chỉ số sau, trả về đúng schema JSON:
- date: ngày đo in trên tờ giấy (định dạng yyyy-MM-dd)
- weightKg: cân nặng (kg)
- bmi: chỉ số BMI
- bodyFatKg: khối lượng mỡ cơ thể (kg, mục Body Fat trong Body Composition Analysis)
- bodyFatPercent: % mỡ cơ thể nếu có hiển thị riêng (Percent Body Fat), null nếu không thấy
- skeletalMuscleKg: khối lượng cơ xương (kg, Skeletal Muscle)
- visceralFatLevel: mức mỡ nội tạng (Visceral Fat Level)
- bmrKcal: BMR (kcal)
- desirableWeightKg: cân nặng lý tưởng/mong muốn (Desirable Weight, kg)
- segmentFat: trạng thái mỡ từng vùng cơ thể (Segmental Analysis, cột Body Fat) — leftArm, rightArm, trunk, leftLeg, rightLeg, mỗi giá trị là "under" (dưới chuẩn), "standard" (chuẩn), hoặc "over" (vượt chuẩn). Nếu tờ giấy không có phần này, để cả object là null.
- segmentMuscle: tương tự nhưng cho cột Muscle (cơ) trong Segmental Analysis.

Nếu không đọc được một giá trị nào đó, để null cho giá trị đó. Chỉ trả về JSON, không giải thích thêm.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: inbodySchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini không trả về dữ liệu");
  return JSON.parse(text);
}
