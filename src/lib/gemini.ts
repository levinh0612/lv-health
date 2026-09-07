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

const segmentDetail = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, enum: ["under", "standard", "over"] },
    percent: {
      type: Type.NUMBER,
      nullable: true,
      description: "% of standard range shown on the bar/gauge for this segment, e.g. 115 means 15% over standard. Null if no number is printed.",
    },
  },
  required: ["status", "percent"],
};

const segmentsSchema = {
  type: Type.OBJECT,
  properties: {
    leftArm: segmentDetail,
    rightArm: segmentDetail,
    trunk: segmentDetail,
    leftLeg: segmentDetail,
    rightLeg: segmentDetail,
  },
  required: ["leftArm", "rightArm", "trunk", "leftLeg", "rightLeg"],
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
    obesityDegreePercent: { type: Type.NUMBER, nullable: true },
    weightControlKg: { type: Type.NUMBER, nullable: true },
    bodyFatControlKg: { type: Type.NUMBER, nullable: true },
    muscleControlKg: { type: Type.NUMBER, nullable: true },
    abdominalFatRatio: { type: Type.NUMBER, nullable: true },
    medianaScore: { type: Type.NUMBER, nullable: true },
    totalEnergyExpenditureKcal: { type: Type.NUMBER, nullable: true },
    segmentFat: { ...segmentsSchema, nullable: true },
    segmentMuscle: { ...segmentsSchema, nullable: true },
  },
  required: [
    "date",
    "weightKg",
    "bmi",
    "bodyFatKg",
    "bodyFatPercent",
    "skeletalMuscleKg",
    "visceralFatLevel",
    "bmrKcal",
    "desirableWeightKg",
    "obesityDegreePercent",
    "weightControlKg",
    "bodyFatControlKg",
    "muscleControlKg",
    "abdominalFatRatio",
    "medianaScore",
    "totalEnergyExpenditureKcal",
    "segmentFat",
    "segmentMuscle",
  ],
};

export async function extractInbodyFromImage(imageBase64: string, mimeType: string) {
  const client = getClient();

  const response = await client.models.generateContent({
    model: "gemini-3.5-flash-lite",
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
- obesityDegreePercent: mức độ béo phì (Obesity Degree, %)
- weightControlKg: số kg cần tăng/giảm để đạt cân nặng lý tưởng (Weight Control; âm nếu cần giảm, dương nếu cần tăng)
- bodyFatControlKg: số kg mỡ cần tăng/giảm (Body Fat Control; âm nếu cần giảm)
- muscleControlKg: số kg cơ cần tăng/giảm (Muscle Control; dương nếu cần tăng)
- abdominalFatRatio: tỷ lệ mỡ vùng bụng / vòng eo-hông (Abdominal Fat Ratio hoặc Waist-Hip Ratio)
- medianaScore: điểm tổng thể của máy đo (Mediana Score hoặc InBody Score), thang 0-100
- totalEnergyExpenditureKcal: tổng năng lượng tiêu hao mỗi ngày (Total Energy Expenditure, kcal)
- segmentFat: trạng thái mỡ từng vùng cơ thể (Segmental Analysis, cột Body Fat) — leftArm, rightArm, trunk, leftLeg, rightLeg. Mỗi vùng có "status" ("under"/"standard"/"over") và "percent" (số % so với mức chuẩn nếu tờ giấy có in số cạnh thanh bar, ví dụ "115" nghĩa là vượt chuẩn 15%; để null nếu không thấy số). Nếu tờ giấy không có phần Segmental Analysis, để cả object segmentFat là null.
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

const mealSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "1 câu tóm tắt chiến lược ăn uống hôm nay" },
    breakfast: { type: Type.STRING },
    lunch: { type: Type.STRING },
    dinner: { type: Type.STRING },
    snack: { type: Type.STRING },
  },
  required: ["summary", "breakfast", "lunch", "dinner", "snack"],
};

export async function suggestMeals(context: {
  weightKg?: number | null;
  bodyFatPercent?: number | null;
  bmi?: number | null;
  targetWeightKg?: number | null;
  workoutTitle?: string;
  workoutType?: string;
  recentMealNotes?: string[];
}) {
  const client = getClient();

  const response = await client.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Bạn là huấn luyện viên dinh dưỡng. Dựa vào thông tin sau, gợi ý thực đơn 1 ngày (sáng/trưa/tối/phụ) ngắn gọn, thực tế, dễ chuẩn bị, ưu tiên đạm cao - tinh bột chọn lọc - hạn chế dầu mỡ/đường, phù hợp mục tiêu giảm mỡ giữ cơ:

- Cân nặng hiện tại: ${context.weightKg ?? "không rõ"} kg
- % mỡ cơ thể: ${context.bodyFatPercent ?? "không rõ"}
- BMI: ${context.bmi ?? "không rõ"}
- Cân nặng mục tiêu: ${context.targetWeightKg ?? "không rõ"} kg
- Lịch tập hôm nay: ${context.workoutTitle ?? "không rõ"} (loại: ${context.workoutType ?? "không rõ"})
${context.recentMealNotes?.length ? `- Vài bữa ăn gần đây: ${context.recentMealNotes.join("; ")}` : ""}

Nếu hôm nay là ngày tập tạ hoặc HIIT, tăng nhẹ tinh bột quanh giờ tập để có năng lượng. Nếu là ngày nghỉ, giảm tinh bột. Viết ngắn gọn bằng tiếng Việt, mỗi bữa 1 câu, không dùng markdown.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: mealSuggestionSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini không trả về dữ liệu");
  return JSON.parse(text);
}
