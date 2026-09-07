export type TemplateExercise = { name: string; sets: string; rest: string };

export type DayTemplate = {
  dayType: "strength" | "cardio" | "hiit" | "rest";
  title: string;
  duration: string;
  exercises: TemplateExercise[];
  note?: string;
};

// Keyed by JS Date#getDay(): 0 = Sunday ... 6 = Saturday
export const WORKOUT_TEMPLATE: Record<number, DayTemplate> = {
  1: {
    dayType: "strength",
    title: "Ngực · Vai",
    duration: "~55 phút",
    exercises: [
      { name: "Đẩy ngực máy (chest press machine)", sets: "4 × 12", rest: "75s" },
      { name: "Incline dumbbell press", sets: "3 × 12", rest: "75s" },
      { name: "Đẩy vai máy (shoulder press machine)", sets: "3 × 12", rest: "60s" },
      { name: "Cable fly", sets: "3 × 15", rest: "45s" },
      { name: "Lateral raise (tạ đơn nhẹ)", sets: "3 × 15", rest: "45s" },
      { name: "Plank", sets: "3 × 40s", rest: "30s" },
    ],
  },
  2: {
    dayType: "cardio",
    title: "Cardio dài",
    duration: "~40 phút",
    exercises: [
      { name: "Máy elliptical hoặc xe đạp", sets: "30 phút", rest: "Vừa" },
      { name: "Đi bộ nghiêng dốc (treadmill incline)", sets: "10 phút", rest: "Dốc 8–10%" },
    ],
    note: "Cardio dài giúp tăng thâm hụt calo mà không làm cơ mỏi trước buổi tạ chân thứ Sáu.",
  },
  3: {
    dayType: "strength",
    title: "Lưng · Tay",
    duration: "~55 phút",
    exercises: [
      { name: "Lat pulldown", sets: "4 × 12", rest: "75s" },
      { name: "Seated cable row", sets: "3 × 12", rest: "75s" },
      { name: "Face pull", sets: "3 × 15", rest: "45s" },
      { name: "Bicep curl (tạ đơn)", sets: "3 × 12", rest: "45s" },
      { name: "Tricep pushdown (cáp)", sets: "3 × 12", rest: "45s" },
      { name: "Hanging knee raise", sets: "3 × 12", rest: "45s" },
    ],
  },
  4: {
    dayType: "rest",
    title: "Nghỉ chủ động",
    duration: "~20 phút",
    exercises: [],
    note: "Đi bộ nhẹ hoặc giãn cơ toàn thân. Bỏ qua nếu quá mệt, không ép tập.",
  },
  5: {
    dayType: "strength",
    title: "Chân · Mông",
    duration: "~55 phút",
    exercises: [
      { name: "Leg press", sets: "4 × 12", rest: "90s" },
      { name: "Squat máy Smith (tạ nhẹ, kỹ thuật trước)", sets: "3 × 12", rest: "90s" },
      { name: "Leg curl (đùi sau)", sets: "3 × 12", rest: "60s" },
      { name: "Leg extension (đùi trước)", sets: "3 × 12", rest: "60s" },
      { name: "Hip thrust hoặc glute bridge", sets: "3 × 15", rest: "60s" },
      { name: "Calf raise", sets: "3 × 20", rest: "30s" },
    ],
  },
  6: {
    dayType: "hiit",
    title: "HIIT",
    duration: "~25 phút",
    exercises: [
      { name: "Khởi động đi bộ nhanh", sets: "5 phút", rest: "—" },
      { name: "Chạy nhanh / đạp xe hết sức", sets: "30s hết sức", rest: "8 vòng" },
      { name: "Đi bộ hồi phục", sets: "90s chậm", rest: "xen giữa mỗi vòng" },
      { name: "Thả lỏng + giãn cơ", sets: "5 phút", rest: "—" },
    ],
  },
  0: {
    dayType: "rest",
    title: "Nghỉ",
    duration: "",
    exercises: [],
    note: "Nghỉ hoàn toàn. Ngủ đủ 7–8 tiếng để hormone phục hồi cơ hoạt động tốt nhất.",
  },
};

export const DOW_LABEL: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};
