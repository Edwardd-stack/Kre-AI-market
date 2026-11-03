import { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { formatWon } from "../../../libs/config";
import { PriceGrade, PriceMarketType } from "../../../libs/enums/price.enum";
import type { PriceHistory } from "../../../libs/types/price";

/** 4 ta chiziq: bozor turi × daraja */
const SERIES = [
  { market: PriceMarketType.RETAIL, grade: PriceGrade.HIGH, color: "#1F5E3B", dash: "" },
  { market: PriceMarketType.RETAIL, grade: PriceGrade.MEDIUM, color: "#6BA583", dash: "5 4" },
  { market: PriceMarketType.WHOLESALE, grade: PriceGrade.HIGH, color: "#C99A2E", dash: "" },
  { market: PriceMarketType.WHOLESALE, grade: PriceGrade.MEDIUM, color: "#E2C27A", dash: "5 4" },
];

export default function PriceChart({ prices }: { prices: PriceHistory[] }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  /** [{date, RETAIL_HIGH: 60790, ...}] ko'rinishiga aylantirish */
  const data = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    for (const p of prices) {
      const date = p.priceDate.slice(5, 10); // MM-DD
      if (!byDate.has(date)) byDate.set(date, { date });
      byDate.get(date)![`${p.priceMarketType}_${p.priceGrade}`] = p.priceAmount;
    }
    return [...byDate.values()];
  }, [prices]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {t("prices.chartTitle")}
        </Typography>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="#EEE9DD" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={64}
              domain={["dataMin - 1000", "dataMax + 1000"]}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip formatter={(value) => formatWon(Number(value), lang)} />
            <Legend />
            {SERIES.map((s) => (
              <Line
                key={`${s.market}_${s.grade}`}
                type="monotone"
                dataKey={`${s.market}_${s.grade}`}
                name={`${t(`market.${s.market}`)} · ${t(`grade.${s.grade}`)}`}
                stroke={s.color}
                strokeDasharray={s.dash}
                strokeWidth={2.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
