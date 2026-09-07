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

// Illustration images from yuhonas/free-exercise-db (MIT), keyed by exact exercise name.
export const EXERCISE_IMAGES: Record<string, string> = {
  "Đẩy ngực máy (chest press machine)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/0.jpg",
  "Incline dumbbell press":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
  "Đẩy vai máy (shoulder press machine)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Shoulder_Press/0.jpg",
  "Cable fly":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Cable_Flyes/0.jpg",
  "Lateral raise (tạ đơn nhẹ)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg",
  Plank: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg",
  "Máy elliptical hoặc xe đạp":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/0.jpg",
  "Đi bộ nghiêng dốc (treadmill incline)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg",
  "Lat pulldown":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
  "Seated cable row":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg",
  "Face pull":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg",
  "Bicep curl (tạ đơn)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg",
  "Tricep pushdown (cáp)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg",
  "Hanging knee raise":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg",
  "Leg press":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg",
  "Squat máy Smith (tạ nhẹ, kỹ thuật trước)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Squat/0.jpg",
  "Leg curl (đùi sau)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg",
  "Leg extension (đùi trước)":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg",
  "Hip thrust hoặc glute bridge":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg",
  "Calf raise":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg",
  "Khởi động đi bộ nhanh":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg",
  "Chạy nhanh / đạp xe hết sức":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Running_Treadmill/0.jpg",
  "Đi bộ hồi phục":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg",
  "Thả lỏng + giãn cơ":
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/0.jpg",
};

// Exercises that don't use a gym machine/cable (dumbbell, bodyweight, or
// unsupervised cardio) don't need a proof photo when checked done.
export const EXERCISES_NO_PHOTO_NEEDED = new Set<string>([
  "Incline dumbbell press",
  "Lateral raise (tạ đơn nhẹ)",
  "Plank",
  "Bicep curl (tạ đơn)",
  "Hanging knee raise",
  "Hip thrust hoặc glute bridge",
  "Calf raise",
  "Khởi động đi bộ nhanh",
  "Chạy nhanh / đạp xe hết sức",
  "Đi bộ hồi phục",
  "Thả lỏng + giãn cơ",
]);

export const DOW_LABEL: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};
