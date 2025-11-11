"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

// Modern gradient color palette with better contrast
const COLORS = [
  "#3b82f6", // Vibrant blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#a855f7", // Violet
];

const renderLabel = (entry) => {
  // Only show label if value is significant enough
  if (entry.value < 2) return "";
  return `${entry.value}%`;
};

// Custom label with better styling
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.02) return null; // Don't show labels for slices < 2%

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "14px",
        fontWeight: "700",
        textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
      }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const ChartCard = ({ title, data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col h-full border border-gray-100">
      <h3 className="text-base font-semibold text-gray-900 mb-4 text-center">
        {title}
      </h3>
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: "320px" }}>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius="88%"
              innerRadius="0%"
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
