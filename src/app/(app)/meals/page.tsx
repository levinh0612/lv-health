import { desc } from "drizzle-orm";
import { format } from "date-fns";
import clsx from "clsx";
import { getDb } from "@/db";
import { meals } from "@/db/schema";
import SectionHead from "@/components/SectionHead";
import MealForm from "@/components/MealForm";
import ZoomableImage from "@/components/ZoomableImage";
import MealSuggestion from "@/components/MealSuggestion";

export const dynamic = "force-dynamic";

const MEAL_LABEL: Record<string, string> = {
  sang: "Sáng",
  trua: "Trưa",
  toi: "Tối",
  phu: "Phụ",
};

const TAG_LABEL: Record<string, string> = {
  dat_chuan: "Đạt chuẩn",
  han_che: "Hạn chế",
};

export default async function MealsPage() {
  const rows = await getDb()
    .select()
    .from(meals)
    .orderBy(desc(meals.datetime))
    .limit(100);

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Nhật ký ăn uống
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        Bữa Ăn
      </h1>

      <div className="mt-6">
        <MealSuggestion />
      </div>

      <div className="mt-6">
        <MealForm />
      </div>

      <SectionHead title="Gần đây" />

      {rows.length === 0 && (
        <p className="text-sm text-faint">Chưa có bữa ăn nào được ghi lại.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map((m) => (
          <div
            key={m.id}
            className="overflow-hidden rounded-sm border border-line bg-paper-card"
          >
            {m.photoUrl ? (
              <ZoomableImage src={m.photoUrl} sizes="200px" className="aspect-square w-full" />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-paper-dim text-xs text-faint">
                Không ảnh
              </div>
            )}
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-[11px] uppercase text-ink">
                  {MEAL_LABEL[m.mealType] ?? m.mealType}
                </span>
                <span className="text-[10px] text-faint">
                  {format(new Date(m.datetime), "dd/MM")}
                </span>
              </div>
              {m.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className={clsx(
                        "rounded-full px-2 py-0.5 text-[10px]",
                        tag === "dat_chuan"
                          ? "bg-olive/15 text-olive"
                          : "bg-rust/15 text-rust"
                      )}
                    >
                      {TAG_LABEL[tag] ?? tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
