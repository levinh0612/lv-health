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

// Target muscle group per exercise, shown so the user knows what they're training.
export const EXERCISE_MUSCLE_GROUP: Record<string, string> = {
  "Đẩy ngực máy (chest press machine)": "Ngực",
  "Incline dumbbell press": "Ngực trên",
  "Đẩy vai máy (shoulder press machine)": "Vai",
  "Cable fly": "Ngực (cô lập)",
  "Lateral raise (tạ đơn nhẹ)": "Vai giữa",
  Plank: "Cơ lõi / bụng",
  "Máy elliptical hoặc xe đạp": "Tim mạch toàn thân",
  "Đi bộ nghiêng dốc (treadmill incline)": "Tim mạch · đùi sau · mông",
  "Lat pulldown": "Lưng xô",
  "Seated cable row": "Lưng giữa",
  "Face pull": "Vai sau · bả vai",
  "Bicep curl (tạ đơn)": "Tay trước (bắp tay)",
  "Tricep pushdown (cáp)": "Tay sau (bắp tay sau)",
  "Hanging knee raise": "Bụng dưới",
  "Leg press": "Đùi trước · mông",
  "Squat máy Smith (tạ nhẹ, kỹ thuật trước)": "Đùi trước · mông",
  "Leg curl (đùi sau)": "Đùi sau",
  "Leg extension (đùi trước)": "Đùi trước",
  "Hip thrust hoặc glute bridge": "Mông",
  "Calf raise": "Bắp chân",
  "Khởi động đi bộ nhanh": "Khởi động toàn thân",
  "Chạy nhanh / đạp xe hết sức": "Tim mạch cường độ cao",
  "Đi bộ hồi phục": "Phục hồi tim mạch",
  "Thả lỏng + giãn cơ": "Giãn cơ toàn thân",
  // Alternatives target the same muscle group as the exercise they substitute for.
  "Đẩy ngực tạ đơn trên ghế phẳng": "Ngực",
  "Đẩy ngực nghiêng máy Smith": "Ngực trên",
  "Đẩy vai tạ đơn (ngồi)": "Vai",
  "Dumbbell fly trên ghế phẳng": "Ngực (cô lập)",
  "Cable lateral raise": "Vai giữa",
  "Dead bug hoặc side plank": "Cơ lõi / bụng",
  "Máy chèo thuyền (rowing machine)": "Tim mạch toàn thân",
  "Máy StairMaster": "Tim mạch · đùi sau · mông",
  "Assisted pull-up machine": "Lưng xô",
  "Chest-supported row (máy)": "Lưng giữa",
  "Reverse pec-deck fly": "Vai sau · bả vai",
  "Cable curl": "Tay trước (bắp tay)",
  "Overhead dumbbell tricep extension": "Tay sau (bắp tay sau)",
  "Lying leg raise": "Bụng dưới",
  "Squat máy Hack": "Đùi trước · mông",
  "Goblet squat (tạ đơn)": "Đùi trước · mông",
  "Romanian deadlift (tạ đơn)": "Đùi sau",
  "Bulgarian split squat": "Đùi trước",
  "Cable pull-through": "Mông",
  "Standing calf raise (máy Smith)": "Bắp chân",
};

// One verified instructional video per exercise, where a distinct tutorial exists.
export const EXERCISE_VIDEOS: Record<string, string> = {
  "Đẩy ngực máy (chest press machine)": "https://www.youtube.com/shorts/Qu7-ceCvq7w",
  "Incline dumbbell press": "https://www.youtube.com/watch?v=OC7Qs_SAO2E",
  "Đẩy vai máy (shoulder press machine)": "https://www.youtube.com/watch?v=e5gJP7quyGk",
  "Cable fly": "https://www.youtube.com/watch?v=ovFc-5YdcXw",
  "Lateral raise (tạ đơn nhẹ)": "https://www.youtube.com/watch?v=Y29xKcze8Ik",
  Plank: "https://www.youtube.com/watch?v=mwlp75MS6Rg",
  "Máy elliptical hoặc xe đạp": "https://www.youtube.com/watch?v=RakIFxUmSpA",
  "Đi bộ nghiêng dốc (treadmill incline)": "https://www.youtube.com/watch?v=9ccVxEvWtpA",
  "Lat pulldown": "https://www.youtube.com/watch?v=6MLs17iyK9I",
  "Seated cable row": "https://www.youtube.com/watch?v=OeLb503NZHk",
  "Face pull": "https://www.youtube.com/watch?v=UMGpxwhsy_k",
  "Bicep curl (tạ đơn)": "https://www.youtube.com/watch?v=XE_pHwbst04",
  "Tricep pushdown (cáp)": "https://www.youtube.com/watch?v=-zLyUAo1gMw",
  "Hanging knee raise": "https://www.youtube.com/watch?v=0BmrlKCfTPU",
  "Leg press": "https://www.youtube.com/watch?v=K5n2vg3oZa4",
  "Squat máy Smith (tạ nhẹ, kỹ thuật trước)": "https://www.youtube.com/watch?v=DUWK_gKcRCc",
  "Leg curl (đùi sau)": "https://www.youtube.com/watch?v=d8VJCaT5qoI",
  "Leg extension (đùi trước)": "https://www.youtube.com/watch?v=tTbJBUKnWU8",
  "Hip thrust hoặc glute bridge": "https://www.youtube.com/watch?v=UmY5lVwpycE",
  "Calf raise": "https://www.youtube.com/watch?v=ndQc4mz4mBU",
};

// A substitute exercise (same muscle group) for when the primary machine/cable is occupied.
export const EXERCISE_ALTERNATIVE: Record<string, TemplateExercise> = {
  "Đẩy ngực máy (chest press machine)": { name: "Đẩy ngực tạ đơn trên ghế phẳng", sets: "4 × 12", rest: "75s" },
  "Incline dumbbell press": { name: "Đẩy ngực nghiêng máy Smith", sets: "3 × 12", rest: "75s" },
  "Đẩy vai máy (shoulder press machine)": { name: "Đẩy vai tạ đơn (ngồi)", sets: "3 × 12", rest: "60s" },
  "Cable fly": { name: "Dumbbell fly trên ghế phẳng", sets: "3 × 15", rest: "45s" },
  "Lateral raise (tạ đơn nhẹ)": { name: "Cable lateral raise", sets: "3 × 15", rest: "45s" },
  Plank: { name: "Dead bug hoặc side plank", sets: "3 × 40s", rest: "30s" },
  "Máy elliptical hoặc xe đạp": { name: "Máy chèo thuyền (rowing machine)", sets: "30 phút", rest: "Vừa" },
  "Đi bộ nghiêng dốc (treadmill incline)": { name: "Máy StairMaster", sets: "10 phút", rest: "Vừa" },
  "Lat pulldown": { name: "Assisted pull-up machine", sets: "4 × 12", rest: "75s" },
  "Seated cable row": { name: "Chest-supported row (máy)", sets: "3 × 12", rest: "75s" },
  "Face pull": { name: "Reverse pec-deck fly", sets: "3 × 15", rest: "45s" },
  "Bicep curl (tạ đơn)": { name: "Cable curl", sets: "3 × 12", rest: "45s" },
  "Tricep pushdown (cáp)": { name: "Overhead dumbbell tricep extension", sets: "3 × 12", rest: "45s" },
  "Hanging knee raise": { name: "Lying leg raise", sets: "3 × 12", rest: "45s" },
  "Leg press": { name: "Squat máy Hack", sets: "4 × 12", rest: "90s" },
  "Squat máy Smith (tạ nhẹ, kỹ thuật trước)": { name: "Goblet squat (tạ đơn)", sets: "3 × 12", rest: "90s" },
  "Leg curl (đùi sau)": { name: "Romanian deadlift (tạ đơn)", sets: "3 × 12", rest: "60s" },
  "Leg extension (đùi trước)": { name: "Bulgarian split squat", sets: "3 × 12", rest: "60s" },
  "Hip thrust hoặc glute bridge": { name: "Cable pull-through", sets: "3 × 15", rest: "60s" },
  "Calf raise": { name: "Standing calf raise (máy Smith)", sets: "3 × 20", rest: "30s" },
  // Reverse direction — swap back to the original once the machine frees up.
  "Đẩy ngực tạ đơn trên ghế phẳng": { name: "Đẩy ngực máy (chest press machine)", sets: "4 × 12", rest: "75s" },
  "Đẩy ngực nghiêng máy Smith": { name: "Incline dumbbell press", sets: "3 × 12", rest: "75s" },
  "Đẩy vai tạ đơn (ngồi)": { name: "Đẩy vai máy (shoulder press machine)", sets: "3 × 12", rest: "60s" },
  "Dumbbell fly trên ghế phẳng": { name: "Cable fly", sets: "3 × 15", rest: "45s" },
  "Cable lateral raise": { name: "Lateral raise (tạ đơn nhẹ)", sets: "3 × 15", rest: "45s" },
  "Dead bug hoặc side plank": { name: "Plank", sets: "3 × 40s", rest: "30s" },
  "Máy chèo thuyền (rowing machine)": { name: "Máy elliptical hoặc xe đạp", sets: "30 phút", rest: "Vừa" },
  "Máy StairMaster": { name: "Đi bộ nghiêng dốc (treadmill incline)", sets: "10 phút", rest: "Dốc 8–10%" },
  "Assisted pull-up machine": { name: "Lat pulldown", sets: "4 × 12", rest: "75s" },
  "Chest-supported row (máy)": { name: "Seated cable row", sets: "3 × 12", rest: "75s" },
  "Reverse pec-deck fly": { name: "Face pull", sets: "3 × 15", rest: "45s" },
  "Cable curl": { name: "Bicep curl (tạ đơn)", sets: "3 × 12", rest: "45s" },
  "Overhead dumbbell tricep extension": { name: "Tricep pushdown (cáp)", sets: "3 × 12", rest: "45s" },
  "Lying leg raise": { name: "Hanging knee raise", sets: "3 × 12", rest: "45s" },
  "Squat máy Hack": { name: "Leg press", sets: "4 × 12", rest: "90s" },
  "Goblet squat (tạ đơn)": { name: "Squat máy Smith (tạ nhẹ, kỹ thuật trước)", sets: "3 × 12", rest: "90s" },
  "Romanian deadlift (tạ đơn)": { name: "Leg curl (đùi sau)", sets: "3 × 12", rest: "60s" },
  "Bulgarian split squat": { name: "Leg extension (đùi trước)", sets: "3 × 12", rest: "60s" },
  "Cable pull-through": { name: "Hip thrust hoặc glute bridge", sets: "3 × 15", rest: "60s" },
  "Standing calf raise (máy Smith)": { name: "Calf raise", sets: "3 × 20", rest: "30s" },
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
  // Dumbbell/bodyweight alternatives (swapped in when the primary machine is occupied)
  "Đẩy ngực tạ đơn trên ghế phẳng",
  "Đẩy vai tạ đơn (ngồi)",
  "Dumbbell fly trên ghế phẳng",
  "Dead bug hoặc side plank",
  "Overhead dumbbell tricep extension",
  "Lying leg raise",
  "Goblet squat (tạ đơn)",
  "Romanian deadlift (tạ đơn)",
  "Bulgarian split squat",
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
