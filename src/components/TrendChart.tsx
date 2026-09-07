"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type TrendPoint = {
  date: string;
  weight?: number | null;
  bodyFat?: number | null;
  muscle?: number | null;
};

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-sm border border-dashed border-line text-sm text-faint">
        Chưa có dữ liệu — thêm bản ghi body đầu tiên
      </div>
    );
  }

  return (
    <div className="h-56 w-full rounded-sm border border-line bg-paper-card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              borderRadius: 2,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--steel)"
            strokeWidth={2}
            dot={false}
            name="Cân nặng (kg)"
          />
          <Line
            type="monotone"
            dataKey="bodyFat"
            stroke="var(--rust)"
            strokeWidth={2}
            dot={false}
            name="Mỡ (kg)"
          />
          <Line
            type="monotone"
            dataKey="muscle"
            stroke="var(--olive)"
            strokeWidth={2}
            dot={false}
            name="Cơ xương (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
