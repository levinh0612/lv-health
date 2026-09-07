import type { inbodyScans } from "@/db/schema";

type Scan = typeof inbodyScans.$inferSelect;

export type GlossaryEntry = {
  label: string;
  value: string;
  explain: string;
};

function fmt(value: number | null | undefined, unit = "", signed = false) {
  if (value == null) return "—";
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value}${unit}`;
}

export function buildInbodyGlossary(scan: Scan): GlossaryEntry[] {
  return [
    {
      label: "Cân nặng",
      value: fmt(scan.weightKg, " kg"),
      explain: "Tổng trọng lượng cơ thể tại thời điểm đo.",
    },
    {
      label: "BMI",
      value: fmt(scan.bmi),
      explain: "Chỉ số khối cơ thể (cân nặng / chiều cao²) — đánh giá thừa/thiếu cân tổng quát, không phân biệt mỡ và cơ.",
    },
    {
      label: "Mức độ béo phì",
      value: fmt(scan.obesityDegreePercent, "%"),
      explain: "So sánh cân nặng hiện tại với cân nặng tiêu chuẩn theo chiều cao — 100% là vừa chuẩn.",
    },
    {
      label: "Khối lượng mỡ",
      value: [fmt(scan.bodyFatKg, " kg"), scan.bodyFatPercent != null ? `(${scan.bodyFatPercent}%)` : null]
        .filter(Boolean)
        .join(" "),
      explain: "Tổng khối lượng mỡ trong cơ thể — mỡ dư thừa làm tăng nguy cơ tim mạch, tiểu đường.",
    },
    {
      label: "Cơ xương",
      value: fmt(scan.skeletalMuscleKg, " kg"),
      explain: "Khối lượng cơ gắn liền với xương, phần cơ chủ động vận động — cơ càng nhiều, tiêu hao năng lượng lúc nghỉ càng cao.",
    },
    {
      label: "Mỡ nội tạng",
      value: fmt(scan.visceralFatLevel),
      explain: "Mức mỡ bao quanh các cơ quan trong ổ bụng — mức cao (thường trên 10) làm tăng nguy cơ bệnh chuyển hóa dù cân nặng bình thường.",
    },
    {
      label: "Tỷ lệ eo/hông",
      value: fmt(scan.abdominalFatRatio),
      explain: "Vòng eo chia vòng hông (WHR) — trên 0.9 (nam) hoặc 0.85 (nữ) cảnh báo mỡ bụng tích tụ nhiều.",
    },
    {
      label: "BMR",
      value: fmt(scan.bmrKcal, " kcal"),
      explain: "Năng lượng cơ thể tiêu hao khi nghỉ ngơi hoàn toàn trong 24h — mốc thấp nhất không nên ăn dưới mức này.",
    },
    {
      label: "Tổng năng lượng tiêu hao",
      value: fmt(scan.totalEnergyExpenditureKcal, " kcal"),
      explain: "Năng lượng tiêu hao cả ngày (BMR + vận động) — dùng để tính mức thâm hụt calo khi muốn giảm cân.",
    },
    {
      label: "Cân nặng lý tưởng",
      value: fmt(scan.desirableWeightKg, " kg"),
      explain: "Cân nặng chuẩn khuyến nghị theo chiều cao và giới tính.",
    },
    {
      label: "Cân nặng cần điều chỉnh",
      value: fmt(scan.weightControlKg, " kg", true),
      explain: "Số kg cần giảm (âm) hoặc tăng (dương) để đạt cân nặng lý tưởng.",
    },
    {
      label: "Mỡ cần điều chỉnh",
      value: fmt(scan.bodyFatControlKg, " kg", true),
      explain: "Số kg mỡ nên giảm (âm) hoặc tăng (dương) để đạt tỷ lệ mỡ khỏe mạnh.",
    },
    {
      label: "Cơ cần điều chỉnh",
      value: fmt(scan.muscleControlKg, " kg", true),
      explain: "Số kg cơ nên tăng thêm (dương) để đạt mức cơ khỏe mạnh, giúp giữ dáng khi giảm mỡ.",
    },
    {
      label: "Điểm tổng (Score)",
      value: fmt(scan.medianaScore),
      explain: "Điểm đánh giá tổng quát các thành phần cơ thể trên thang 0–100 — càng cao càng cân đối.",
    },
  ].filter((e) => e.value !== "—" && e.value !== "");
}
