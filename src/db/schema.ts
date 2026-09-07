import {
  pgTable,
  serial,
  text,
  date,
  timestamp,
  real,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const bodyLogs = pgTable("body_logs", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  weightKg: real("weight_kg"),
  bodyFatKg: real("body_fat_kg"),
  bodyFatPercent: real("body_fat_percent"),
  skeletalMuscleKg: real("skeletal_muscle_kg"),
  photoUrls: jsonb("photo_urls").$type<string[]>().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  datetime: timestamp("datetime").notNull(),
  mealType: text("meal_type").notNull(), // sang | trua | toi | phu
  photoUrl: text("photo_url"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]), // dat_chuan | han_che
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workoutDays = pgTable("workout_days", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  dayType: text("day_type").notNull(), // strength | cardio | hiit | rest
  title: text("title").notNull(),
  exercises: jsonb("exercises")
    .$type<{ name: string; sets: string; rest: string; done: boolean }[]>()
    .notNull()
    .default([]),
  completed: boolean("completed").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SegmentStatus = "under" | "standard" | "over";
export type BodySegments = {
  leftArm: SegmentStatus;
  rightArm: SegmentStatus;
  trunk: SegmentStatus;
  leftLeg: SegmentStatus;
  rightLeg: SegmentStatus;
};

export const inbodyScans = pgTable("inbody_scans", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  weightKg: real("weight_kg"),
  bmi: real("bmi"),
  bodyFatKg: real("body_fat_kg"),
  bodyFatPercent: real("body_fat_percent"),
  skeletalMuscleKg: real("skeletal_muscle_kg"),
  visceralFatLevel: real("visceral_fat_level"),
  bmrKcal: real("bmr_kcal"),
  desirableWeightKg: real("desirable_weight_kg"),
  photoUrl: text("photo_url"),
  segmentFat: jsonb("segment_fat").$type<BodySegments>(),
  segmentMuscle: jsonb("segment_muscle").$type<BodySegments>(),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
